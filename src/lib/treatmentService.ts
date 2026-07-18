import { supabase } from './supabase';
import { logger } from './logger';

export interface TreatmentCategory {
  id: string;
  slug: string;
  name: string;
  icon?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface Treatment {
  id: string;
  slug: string;
  name: string;
  description?: string;
  icon?: string;
  featured: boolean;
  category: string;
  category_id?: string;
  estimated_duration: number;
  display_order: number;
  learn_more_slug?: string;
  is_active: boolean;
  views_count: number;
  bookings_count: number;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPricing {
  id?: string;
  service_id: string;
  clinic_id: string;
  base_price: number;
  sale_price?: number;
  insurance_covered: boolean;
}

export interface TreatmentGalleryItem {
  id?: string;
  service_id: string;
  media_file_id: string;
  caption?: string;
  display_order: number;
  public_url?: string; // resolved URL joined from media_files
}

export interface TreatmentFAQ {
  id?: string;
  service_id: string;
  question: string;
  answer: string;
  display_order: number;
}

export const TreatmentService = {
  async getCategories(): Promise<TreatmentCategory[]> {
    const { data, error } = await supabase
      .from('treatment_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    if (error) {
      logger.error('Error fetching treatment categories:', error);
      return [];
    }
    return data || [];
  },

  async getTreatments(): Promise<Treatment[]> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      logger.error('Error loading treatments:', error);
      return [];
    }
    return data || [];
  },

  async getTreatmentBySlug(slug: string): Promise<Treatment | null> {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) {
      logger.error(`Error loading treatment ${slug}:`, error);
      return null;
    }
    return data;
  },

  async updateTreatmentProfile(id: string, updates: Partial<Treatment>): Promise<boolean> {
    const { error } = await supabase
      .from('services')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
    if (error) {
      logger.error(`Error updating treatment profile ${id}:`, error);
      return false;
    }
    return true;
  },

  // 1. Pricing Methods
  async getTreatmentPricing(serviceId: string): Promise<TreatmentPricing[]> {
    const { data, error } = await supabase
      .from('treatment_pricing')
      .select('*')
      .eq('service_id', serviceId);
    if (error) {
      logger.error(`Error loading pricing for treatment ${serviceId}:`, error);
      return [];
    }
    return data || [];
  },

  async saveTreatmentPricing(serviceId: string, pricingRows: Partial<TreatmentPricing>[]): Promise<boolean> {
    const { error: delErr } = await supabase
      .from('treatment_pricing')
      .delete()
      .eq('service_id', serviceId);
    if (delErr) {
      logger.error('Error clearing old pricing rows:', delErr);
      return false;
    }

    if (pricingRows.length === 0) return true;

    const rows = pricingRows.map((p) => ({
      service_id: serviceId,
      clinic_id: p.clinic_id,
      base_price: p.base_price,
      sale_price: p.sale_price || null,
      insurance_covered: p.insurance_covered ?? true
    }));

    const { error: insErr } = await supabase
      .from('treatment_pricing')
      .insert(rows);
    if (insErr) {
      logger.error('Error inserting pricing rows:', insErr);
      return false;
    }
    return true;
  },

  // 2. Clinics Mapping
  async getClinicTreatments(serviceId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('clinic_treatments')
      .select('clinic_id')
      .eq('service_id', serviceId);
    if (error) {
      logger.error(`Error loading clinics for treatment ${serviceId}:`, error);
      return [];
    }
    return (data || []).map((row) => row.clinic_id);
  },

  async saveClinicTreatments(serviceId: string, clinicIds: string[]): Promise<boolean> {
    const { error: delErr } = await supabase
      .from('clinic_treatments')
      .delete()
      .eq('service_id', serviceId);
    if (delErr) return false;

    if (clinicIds.length === 0) return true;

    const rows = clinicIds.map((cid) => ({
      service_id: serviceId,
      clinic_id: cid
    }));

    const { error: insErr } = await supabase
      .from('clinic_treatments')
      .insert(rows);
    if (insErr) return false;
    return true;
  },

  // 3. Gallery Methods
  async getTreatmentGallery(serviceId: string): Promise<TreatmentGalleryItem[]> {
    const { data, error } = await supabase
      .from('treatment_gallery')
      .select('id, service_id, media_file_id, caption, display_order, media_files(public_url)')
      .eq('service_id', serviceId)
      .order('display_order', { ascending: true });

    if (error) {
      logger.error(`Error loading gallery for treatment ${serviceId}:`, error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      service_id: item.service_id,
      media_file_id: item.media_file_id,
      caption: item.caption,
      display_order: item.display_order,
      public_url: item.media_files?.public_url
    }));
  },

  async saveTreatmentGallery(serviceId: string, galleryRows: Partial<TreatmentGalleryItem>[]): Promise<boolean> {
    const { error: delErr } = await supabase
      .from('treatment_gallery')
      .delete()
      .eq('service_id', serviceId);
    if (delErr) return false;

    if (galleryRows.length === 0) return true;

    const rows = galleryRows.map((g, idx) => ({
      service_id: serviceId,
      media_file_id: g.media_file_id,
      caption: g.caption || null,
      display_order: g.display_order ?? idx
    }));

    const { error: insErr } = await supabase
      .from('treatment_gallery')
      .insert(rows);
    if (insErr) return false;
    return true;
  },

  // 4. FAQ Methods
  async getTreatmentFAQs(serviceId: string): Promise<TreatmentFAQ[]> {
    const { data, error } = await supabase
      .from('treatment_faqs')
      .select('*')
      .eq('service_id', serviceId)
      .order('display_order', { ascending: true });
    if (error) {
      logger.error(`Error loading FAQs for treatment ${serviceId}:`, error);
      return [];
    }
    return data || [];
  },

  async saveTreatmentFAQs(serviceId: string, faqs: Partial<TreatmentFAQ>[]): Promise<boolean> {
    const { error: delErr } = await supabase
      .from('treatment_faqs')
      .delete()
      .eq('service_id', serviceId);
    if (delErr) return false;

    if (faqs.length === 0) return true;

    const rows = faqs.map((f, idx) => ({
      service_id: serviceId,
      question: f.question,
      answer: f.answer,
      display_order: f.display_order ?? idx
    }));

    const { error: insErr } = await supabase
      .from('treatment_faqs')
      .insert(rows);
    if (insErr) return false;
    return true;
  },

  // Increment views count for analytics
  async incrementViewsCount(serviceId: string): Promise<void> {
    try {
      await supabase.rpc('increment_service_views', { p_service_id: serviceId });
    } catch {
      // Fallback update
      await supabase.rpc('increment_service_views_fallback', { p_service_id: serviceId });
    }
  }
};
