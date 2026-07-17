import { supabase } from './supabase';
import { logger } from './logger';

export interface WebsiteSection {
  id: string;
  title: string;
  description?: string;
  is_visible: boolean;
  display_order: number;
}

export interface WebsiteContent {
  id: string;
  section_id: string;
  content_key: string;
  draft_content: any;
  published_content?: any;
  is_published: boolean;
  published_at?: string;
  updated_by?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ContentVersion {
  id: string;
  content_id: string;
  version: number;
  published_content: any;
  created_by?: string;
  created_at: string;
}

/**
 * CmsRepository handles database select/write transitions.
 */
export const CmsRepository = {
  async getSections(): Promise<WebsiteSection[]> {
    const { data, error } = await supabase
      .from('website_sections')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      logger.error('Error fetching website sections:', error);
      throw error;
    }
    return data || [];
  },

  async getContent(sectionId?: string): Promise<WebsiteContent[]> {
    let query = supabase.from('website_content').select('*');
    if (sectionId) {
      query = query.eq('section_id', sectionId);
    }
    const { data, error } = await query.order('display_order', { ascending: true });
    if (error) {
      logger.error('Error fetching website content:', error);
      throw error;
    }
    return data || [];
  },

  async saveDraft(
    sectionId: string,
    contentKey: string,
    draftContent: any,
    userId?: string
  ): Promise<WebsiteContent> {
    const { data, error } = await supabase
      .from('website_content')
      .upsert(
        {
          section_id: sectionId,
          content_key: contentKey,
          draft_content: draftContent,
          is_published: false,
          updated_by: userId,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'section_id,content_key' }
      )
      .select()
      .single();

    if (error) {
      logger.error(`Error saving draft for section ${sectionId} key ${contentKey}:`, error);
      throw error;
    }
    return data;
  },

  async publishContent(contentId: string, userId?: string): Promise<WebsiteContent> {
    // 1. Fetch current draft content
    const { data: record, error: fetchError } = await supabase
      .from('website_content')
      .select('*')
      .eq('id', contentId)
      .single();

    if (fetchError || !record) {
      logger.error(`Failed to retrieve content record for publish: ${contentId}`, fetchError);
      throw fetchError || new Error('Record not found');
    }

    const nextPublished = record.draft_content;
    const nowStr = new Date().toISOString();

    // 2. Update record status
    const { data: updated, error: updateError } = await supabase
      .from('website_content')
      .update({
        published_content: nextPublished,
        is_published: true,
        published_at: nowStr,
        updated_by: userId,
        updated_at: nowStr
      })
      .eq('id', contentId)
      .select()
      .single();

    if (updateError) {
      logger.error(`Error updating publish state for content ${contentId}:`, updateError);
      throw updateError;
    }

    // 3. Log into version history database
    const { data: latestVersion } = await supabase
      .from('content_versions')
      .select('version')
      .eq('content_id', contentId)
      .order('version', { ascending: false })
      .limit(1);

    const nextVer = latestVersion && latestVersion.length > 0 ? latestVersion[0].version + 1 : 1;

    await supabase.from('content_versions').insert({
      content_id: contentId,
      version: nextVer,
      published_content: nextPublished,
      created_by: userId,
      created_at: nowStr
    });

    return updated;
  },

  async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    const { data, error } = await supabase
      .from('content_versions')
      .select('*')
      .eq('content_id', contentId)
      .order('version', { ascending: false });
    if (error) {
      logger.error(`Error loading versions for content ${contentId}:`, error);
      throw error;
    }
    return data || [];
  },

  async rollback(contentId: string, publishedContent: any, userId?: string): Promise<WebsiteContent> {
    const nowStr = new Date().toISOString();
    const { data, error } = await supabase
      .from('website_content')
      .update({
        draft_content: publishedContent,
        published_content: publishedContent,
        is_published: true,
        published_at: nowStr,
        updated_by: userId,
        updated_at: nowStr
      })
      .eq('id', contentId)
      .select()
      .single();
    if (error) {
      logger.error(`Error during content rollback for ${contentId}:`, error);
      throw error;
    }
    return data;
  }
};

/**
 * CmsService exposes content states.
 */
export const CmsService = {
  async getSections(): Promise<WebsiteSection[]> {
    try {
      return await CmsRepository.getSections();
    } catch {
      return [];
    }
  },

  async getPublishedContent(sectionId: string): Promise<Record<string, any>> {
    try {
      const list = await CmsRepository.getContent(sectionId);
      const data: Record<string, any> = {};
      list.forEach((item) => {
        // Use published_content if exists, fallback to draft
        data[item.content_key] = item.published_content || item.draft_content;
      });
      return data;
    } catch (err) {
      logger.error(`Failed to load published content for section ${sectionId}:`, err);
      return {};
    }
  },

  async getDraftContent(sectionId: string): Promise<Record<string, any>> {
    try {
      const list = await CmsRepository.getContent(sectionId);
      const data: Record<string, any> = {};
      list.forEach((item) => {
        data[item.content_key] = item.draft_content;
      });
      return data;
    } catch (err) {
      logger.error(`Failed to load draft content for section ${sectionId}:`, err);
      return {};
    }
  },

  async getRawContentList(sectionId: string): Promise<WebsiteContent[]> {
    try {
      return await CmsRepository.getContent(sectionId);
    } catch {
      return [];
    }
  },

  async saveDraft(sectionId: string, contentKey: string, value: any, userId?: string): Promise<boolean> {
    try {
      await CmsRepository.saveDraft(sectionId, contentKey, value, userId);
      return true;
    } catch (err) {
      logger.error(`Failed to save draft content:`, err);
      return false;
    }
  },

  async publishSection(sectionId: string, userId?: string): Promise<boolean> {
    try {
      const list = await CmsRepository.getContent(sectionId);
      const promises = list.map((item) => CmsRepository.publishContent(item.id, userId));
      await Promise.all(promises);
      return true;
    } catch (err) {
      logger.error(`Failed to publish section ${sectionId}:`, err);
      return false;
    }
  },

  async getContentVersions(contentId: string): Promise<ContentVersion[]> {
    try {
      return await CmsRepository.getContentVersions(contentId);
    } catch {
      return [];
    }
  },

  async rollbackToVersion(contentId: string, publishedContent: any, userId?: string): Promise<boolean> {
    try {
      await CmsRepository.rollback(contentId, publishedContent, userId);
      return true;
    } catch (err) {
      logger.error('Failed to rollback content:', err);
      return false;
    }
  }
};
