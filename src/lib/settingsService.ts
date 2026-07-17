import { supabase } from './supabase';
import { logger } from './logger';

export interface SystemSetting {
  key: string;
  value: any;
  setting_group: 'general' | 'contact' | 'booking' | 'appearance' | 'notifications';
  description?: string;
  updated_at: string;
  updated_by?: string;
}

export interface SeoSetting {
  path: string;
  title: string;
  meta_description?: string;
  meta_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
  robots_index: boolean;
  robots_follow: boolean;
  schema_type: string;
  last_generated?: string;
}

export interface NotificationTemplate {
  id: string;
  channel: 'whatsapp' | 'email' | 'sms';
  language: string;
  event_trigger: string;
  template_body: string;
  placeholders: string[];
  preview?: string;
  version: number;
  enabled: boolean;
  timing_offset_minutes: number;
}

/**
 * SettingsRepository handles direct Supabase operations for system config, SEO, and templates.
 */
export const SettingsRepository = {
  async getSettings(): Promise<SystemSetting[]> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*');
    if (error) {
      logger.error('Error fetching system settings from DB:', error);
      throw error;
    }
    return data || [];
  },

  async updateSetting(key: string, value: any, group: string, desc?: string, userId?: string): Promise<void> {
    // 1. Log version history snapshot first
    const { data: current } = await supabase
      .from('system_settings')
      .select('value, version_num')
      .eq('key', key)
      .single();

    const { error: upsertErr } = await supabase
      .from('system_settings')
      .upsert({
        key,
        value,
        setting_group: group,
        description: desc,
        updated_at: new Date().toISOString(),
        updated_by: userId
      });

    if (upsertErr) {
      logger.error(`Error saving setting key ${key}:`, upsertErr);
      throw upsertErr;
    }

    // Insert to setting_versions for future rollback audit trail
    if (current) {
      await supabase.from('setting_versions').insert({
        setting_key: key,
        version: 1, // Simple default incremental version
        value: current.value,
        created_by: userId
      });
    }
  },

  async getSeoSettings(): Promise<SeoSetting[]> {
    const { data, error } = await supabase
      .from('seo_settings')
      .select('*');
    if (error) {
      logger.error('Error loading SEO settings:', error);
      throw error;
    }
    return data || [];
  },

  async updateSeo(path: string, seo: Partial<SeoSetting>): Promise<void> {
    const { error } = await supabase
      .from('seo_settings')
      .upsert({
        path,
        ...seo,
        last_generated: new Date().toISOString()
      });
    if (error) {
      logger.error(`Error upserting SEO settings for path ${path}:`, error);
      throw error;
    }
  },

  async getNotificationTemplates(): Promise<NotificationTemplate[]> {
    const { data, error } = await supabase
      .from('notification_templates')
      .select('*');
    if (error) {
      logger.error('Error loading templates:', error);
      throw error;
    }
    return data || [];
  },

  async updateNotificationTemplate(id: string, template: Partial<NotificationTemplate>): Promise<void> {
    const { error } = await supabase
      .from('notification_templates')
      .update({
        ...template,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) {
      logger.error(`Error saving template ${id}:`, error);
      throw error;
    }
  }
};

/**
 * SettingsService provides structured accessors and business operations.
 */
export const SettingsService = {
  async getSettingsGroup(group: string): Promise<Record<string, any>> {
    try {
      const all = await SettingsRepository.getSettings();
      const groupSettings = all.filter((s) => s.setting_group === group);
      
      const config: Record<string, any> = {};
      groupSettings.forEach((item) => {
        config[item.key] = item.value;
      });
      return config;
    } catch (err) {
      logger.error(`Failed to resolve settings group ${group}:`, err);
      return {};
    }
  },

  async saveSettingsGroup(group: string, values: Record<string, any>, userId?: string): Promise<boolean> {
    try {
      const promises = Object.entries(values).map(([key, val]) =>
        SettingsRepository.updateSetting(key, val, group, undefined, userId)
      );
      await Promise.all(promises);
      return true;
    } catch (err) {
      logger.error(`Failed to save settings group ${group}:`, err);
      return false;
    }
  },

  async getSeoForPath(path: string): Promise<SeoSetting | null> {
    try {
      const list = await SettingsRepository.getSeoSettings();
      return list.find((s) => s.path === path) || null;
    } catch (err) {
      logger.error(`Failed to load SEO for path ${path}:`, err);
      return null;
    }
  },

  async saveSeoForPath(path: string, data: Partial<SeoSetting>): Promise<boolean> {
    try {
      await SettingsRepository.updateSeo(path, data);
      return true;
    } catch (err) {
      logger.error(`Failed to save SEO for path ${path}:`, err);
      return false;
    }
  },

  async getTemplates(): Promise<NotificationTemplate[]> {
    try {
      return await SettingsRepository.getNotificationTemplates();
    } catch (err) {
      logger.error('Failed to get notification templates:', err);
      return [];
    }
  },

  async saveTemplate(id: string, data: Partial<NotificationTemplate>): Promise<boolean> {
    try {
      await SettingsRepository.updateNotificationTemplate(id, data);
      return true;
    } catch (err) {
      logger.error(`Failed to save template ${id}:`, err);
      return false;
    }
  }
};
