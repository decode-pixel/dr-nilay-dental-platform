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
  created_at?: string;
  updated_at?: string;
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
  status: 'Draft' | 'Published' | 'Hidden' | 'Archived';
  consultation_duration: number;
  procedure_duration: number;
  recovery_time?: string;
  follow_up_required?: boolean;
  required_specialization_id?: string;
  estimated_duration: number; // legacy compatibility mirror
  is_active: boolean; // legacy compatibility mirror
  display_order: number;
  learn_more_slug?: string;
  views_count: number;
  bookings_count: number;
  created_at: string;
  updated_at: string;
}

export interface TreatmentPricing {
  id?: string;
  service_id: string;
  treatment_id?: string;
  clinic_id: string;
  consultation_fee?: number;
  base_price: number;
  minimum_price?: number;
  maximum_price?: number;
  offer_price?: number;
  sale_price?: number; // legacy mirror
  currency?: string;
  emi_available?: boolean;
  insurance_supported?: boolean;
  insurance_covered?: boolean; // legacy mirror
  price_notes?: string;
  effective_from?: string;
  effective_to?: string;
}

export interface TreatmentGalleryItem {
  id?: string;
  service_id: string;
  treatment_id?: string;
  media_file_id: string;
  alt_text?: string;
  caption?: string;
  image_type?: 'Before' | 'After' | 'Illustration' | 'Procedure' | 'Clinic';
  display_order: number;
  public_url?: string; // resolved URL joined from media_files
}

export interface TreatmentFAQ {
  id?: string;
  service_id: string;
  treatment_id?: string;
  question: string;
  answer: string;
  category?: string;
  featured?: boolean;
  visibility?: 'Public' | 'Patients Only' | 'Hidden';
  display_order: number;
}

export interface TreatmentSEO {
  id?: string;
  treatment_id: string;
  service_id?: string;
  meta_title?: string;
  meta_description?: string;
  canonical_url?: string;
  og_image?: string;
  schema?: any;
  robots?: string;
}

export interface TreatmentBlock {
  id?: string;
  treatment_id: string;
  service_id?: string;
  block_type: 'Overview' | 'Benefits' | 'Procedure' | 'Preparation' | 'Recovery' | 'Risks' | 'Aftercare';
  title?: string;
  content: string;
  display_order: number;
  is_active?: boolean;
}

export const TreatmentService = {
  // --- Category Methods ---
  async getCategories(): Promise<TreatmentCategory[]> {
    const { data, error } = await supabase
      .from('treatment_categories')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      logger.error('Error fetching treatment categories:', error);
      return [];
    }
    return data || [];
  },

  async saveCategory(category: Partial<TreatmentCategory>): Promise<boolean> {
    if (category.id) {
      const { error } = await supabase
        .from('treatment_categories')
        .update({
          slug: category.slug,
          name: category.name,
          icon: category.icon,
          description: category.description,
          display_order: category.display_order,
          is_active: category.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', category.id);
      if (error) {
        logger.error('Error updating category:', error);
        return false;
      }
    } else {
      const { error } = await supabase
        .from('treatment_categories')
        .insert({
          slug: category.slug || category.name?.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          name: category.name,
          icon: category.icon,
          description: category.description,
          display_order: category.display_order ?? 0,
          is_active: category.is_active ?? true
        });
      if (error) {
        logger.error('Error inserting category:', error);
        return false;
      }
    }
    return true;
  },

  async deleteCategory(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('treatment_categories')
      .delete()
      .eq('id', id);
    if (error) {
      logger.error('Error deleting category:', error);
      return false;
    }
    return true;
  },

  // --- Treatment Core Methods ---
  async getTreatments(): Promise<Treatment[]> {
    // Try querying primary treatments table first
    const { data: treatmentsData, error: treatmentsError } = await supabase
      .from('treatments')
      .select('*, treatment_categories(name)')
      .order('display_order', { ascending: true });

    if (!treatmentsError && treatmentsData && treatmentsData.length > 0) {
      return treatmentsData.map((t: any) => ({
        id: t.id,
        slug: t.slug,
        name: t.name,
        description: t.description,
        icon: t.icon,
        featured: t.featured || false,
        category: t.treatment_categories?.name || 'General',
        category_id: t.category_id,
        status: t.status || 'Published',
        consultation_duration: t.consultation_duration ?? 15,
        procedure_duration: t.procedure_duration ?? 45,
        recovery_time: t.recovery_time || '1-2 days',
        follow_up_required: t.follow_up_required || false,
        required_specialization_id: t.required_specialization_id,
        estimated_duration: (t.consultation_duration ?? 15) + (t.procedure_duration ?? 45),
        is_active: t.status === 'Published',
        display_order: t.display_order ?? 0,
        views_count: t.views_count ?? 0,
        bookings_count: t.bookings_count ?? 0,
        created_at: t.created_at,
        updated_at: t.updated_at
      }));
    }

    // Fallback to services if treatments table is empty
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .order('display_order', { ascending: true });
    if (error) {
      logger.error('Error loading treatments:', error);
      return [];
    }
    return (data || []).map((s: any) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      description: s.description,
      icon: s.icon,
      featured: s.featured || false,
      category: s.category || 'General',
      category_id: s.category_id,
      status: s.is_active ? 'Published' : 'Hidden',
      consultation_duration: 15,
      procedure_duration: s.estimated_duration ?? 45,
      recovery_time: '1-2 days',
      follow_up_required: false,
      estimated_duration: s.estimated_duration ?? 45,
      is_active: s.is_active ?? true,
      display_order: s.display_order ?? 0,
      views_count: s.views_count ?? 0,
      bookings_count: s.bookings_count ?? 0,
      created_at: s.created_at,
      updated_at: s.updated_at
    }));
  },

  async getTreatmentBySlug(slug: string): Promise<Treatment | null> {
    const treatments = await this.getTreatments();
    return treatments.find((t) => t.slug === slug) || null;
  },

  async getTreatmentById(id: string): Promise<Treatment | null> {
    const treatments = await this.getTreatments();
    return treatments.find((t) => t.id === id) || null;
  },

  async updateTreatmentProfile(id: string, updates: Partial<Treatment>): Promise<boolean> {
    const payload: any = {
      ...updates,
      updated_at: new Date().toISOString()
    };
    if (updates.status) {
      payload.is_active = updates.status === 'Published';
    } else if (updates.is_active !== undefined) {
      payload.status = updates.is_active ? 'Published' : 'Hidden';
    }

    // Update both treatments and services for full dual-compatibility
    await supabase.from('treatments').update(payload).eq('id', id);
    const { error } = await supabase.from('services').update(payload).eq('id', id);

    if (error) {
      logger.error(`Error updating treatment profile ${id}:`, error);
      return false;
    }
    return true;
  },

  async createTreatment(treatment: Partial<Treatment>): Promise<Treatment | null> {
    const id = crypto.randomUUID();
    const slug = treatment.slug || treatment.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'new-treatment';
    const row = {
      id,
      slug,
      name: treatment.name || 'New Treatment',
      description: treatment.description || '',
      icon: treatment.icon || 'Smile',
      featured: treatment.featured || false,
      category_id: treatment.category_id || null,
      status: treatment.status || 'Published',
      consultation_duration: treatment.consultation_duration ?? 15,
      procedure_duration: treatment.procedure_duration ?? 45,
      recovery_time: treatment.recovery_time || '1-2 days',
      follow_up_required: treatment.follow_up_required || false,
      required_specialization_id: treatment.required_specialization_id || null,
      display_order: treatment.display_order ?? 0,
      views_count: 0,
      bookings_count: 0
    };

    const { error: tErr } = await supabase.from('treatments').insert(row);
    if (tErr) {
      logger.error('Error creating in treatments table:', tErr);
      return null;
    }

    //Also ensure services mirror is explicitly populated if trigger missed
    await supabase.from('services').upsert({
      id,
      slug,
      name: row.name,
      description: row.description,
      icon: row.icon,
      featured: row.featured,
      category: treatment.category || 'General',
      category_id: row.category_id,
      estimated_duration: row.consultation_duration + row.procedure_duration,
      display_order: row.display_order,
      is_active: row.status === 'Published'
    });

    return this.getTreatmentById(id);
  },

  async deleteTreatment(id: string): Promise<boolean> {
    await supabase.from('treatments').delete().eq('id', id);
    const { error } = await supabase.from('services').delete().eq('id', id);
    if (error) {
      logger.error(`Error deleting treatment ${id}:`, error);
      return false;
    }
    return true;
  },

  // --- Pricing Methods ---
  async getTreatmentPricing(serviceId: string): Promise<TreatmentPricing[]> {
    const { data, error } = await supabase
      .from('treatment_pricing')
      .select('*')
      .or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);
    if (error) {
      logger.error(`Error loading pricing for treatment ${serviceId}:`, error);
      return [];
    }
    return (data || []).map((p: any) => ({
      id: p.id,
      service_id: p.service_id || serviceId,
      treatment_id: p.treatment_id || serviceId,
      clinic_id: p.clinic_id,
      consultation_fee: p.consultation_fee ?? 500.00,
      base_price: p.base_price,
      minimum_price: p.minimum_price,
      maximum_price: p.maximum_price,
      offer_price: p.offer_price ?? p.sale_price,
      sale_price: p.offer_price ?? p.sale_price,
      currency: p.currency || 'INR',
      emi_available: p.emi_available ?? false,
      insurance_supported: p.insurance_supported ?? p.insurance_covered ?? true,
      insurance_covered: p.insurance_supported ?? p.insurance_covered ?? true,
      price_notes: p.price_notes,
      effective_from: p.effective_from,
      effective_to: p.effective_to
    }));
  },

  async saveTreatmentPricing(serviceId: string, pricingRows: Partial<TreatmentPricing>[]): Promise<boolean> {
    await supabase.from('treatment_pricing').delete().or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);

    if (pricingRows.length === 0) return true;

    const rows = pricingRows.map((p) => ({
      service_id: serviceId,
      treatment_id: serviceId,
      clinic_id: p.clinic_id,
      consultation_fee: p.consultation_fee ?? 500.00,
      base_price: p.base_price,
      minimum_price: p.minimum_price || null,
      maximum_price: p.maximum_price || null,
      offer_price: (p.offer_price ?? p.sale_price) || null,
      sale_price: (p.offer_price ?? p.sale_price) || null,
      currency: p.currency || 'INR',
      emi_available: p.emi_available ?? false,
      insurance_supported: (p.insurance_supported ?? p.insurance_covered) ?? true,
      insurance_covered: (p.insurance_supported ?? p.insurance_covered) ?? true,
      price_notes: p.price_notes || null,
      effective_from: p.effective_from || null,
      effective_to: p.effective_to || null
    }));

    const { error: insErr } = await supabase.from('treatment_pricing').insert(rows);
    if (insErr) {
      logger.error('Error inserting pricing rows:', insErr);
      return false;
    }
    return true;
  },

  async getTreatmentPriceForClinic(treatmentId: string, clinicId: string): Promise<TreatmentPricing | null> {
    const rows = await this.getTreatmentPricing(treatmentId);
    return rows.find((r) => r.clinic_id === clinicId) || rows[0] || null;
  },

  // --- Clinics Mapping ---
  async getClinicTreatments(serviceId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('clinic_treatments')
      .select('clinic_id')
      .or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);
    if (error) {
      logger.error(`Error loading clinics for treatment ${serviceId}:`, error);
      return [];
    }
    return (data || []).map((row) => row.clinic_id);
  },

  async saveClinicTreatments(serviceId: string, clinicIds: string[]): Promise<boolean> {
    await supabase.from('clinic_treatments').delete().or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);

    if (clinicIds.length === 0) return true;

    const rows = clinicIds.map((cid) => ({
      service_id: serviceId,
      treatment_id: serviceId,
      clinic_id: cid
    }));

    const { error: insErr } = await supabase.from('clinic_treatments').insert(rows);
    return !insErr;
  },

  // --- Doctors Mapping ---
  async getTreatmentDoctors(serviceId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('doctor_treatments')
      .select('doctor_id')
      .eq('service_id', serviceId);
    if (error) {
      logger.error(`Error loading doctors for treatment ${serviceId}:`, error);
      return [];
    }
    return (data || []).map((row) => row.doctor_id);
  },

  async saveTreatmentDoctors(serviceId: string, doctorIds: string[]): Promise<boolean> {
    await supabase.from('doctor_treatments').delete().eq('service_id', serviceId);

    if (doctorIds.length === 0) return true;

    const rows = doctorIds.map((did) => ({
      service_id: serviceId,
      doctor_id: did
    }));

    const { error: insErr } = await supabase.from('doctor_treatments').insert(rows);
    return !insErr;
  },

  // --- Gallery Methods ---
  async getTreatmentGallery(serviceId: string): Promise<TreatmentGalleryItem[]> {
    const { data, error } = await supabase
      .from('treatment_gallery')
      .select('id, service_id, treatment_id, media_file_id, caption, alt_text, image_type, display_order, media_files(public_url)')
      .or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`)
      .order('display_order', { ascending: true });

    if (error) {
      logger.error(`Error loading gallery for treatment ${serviceId}:`, error);
      return [];
    }

    return (data || []).map((item: any) => ({
      id: item.id,
      service_id: item.service_id || serviceId,
      treatment_id: item.treatment_id || serviceId,
      media_file_id: item.media_file_id,
      caption: item.caption,
      alt_text: item.alt_text || item.caption,
      image_type: item.image_type || 'Before',
      display_order: item.display_order,
      public_url: item.media_files?.public_url
    }));
  },

  async saveTreatmentGallery(serviceId: string, galleryRows: Partial<TreatmentGalleryItem>[]): Promise<boolean> {
    await supabase.from('treatment_gallery').delete().or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);

    if (galleryRows.length === 0) return true;

    const rows = galleryRows.map((g, idx) => ({
      service_id: serviceId,
      treatment_id: serviceId,
      media_file_id: g.media_file_id,
      caption: g.caption || null,
      alt_text: g.alt_text || g.caption || null,
      image_type: g.image_type || 'Before',
      display_order: g.display_order ?? idx
    }));

    const { error: insErr } = await supabase.from('treatment_gallery').insert(rows);
    return !insErr;
  },

  // --- FAQ Methods ---
  async getTreatmentFAQs(serviceId: string): Promise<TreatmentFAQ[]> {
    const { data, error } = await supabase
      .from('treatment_faqs')
      .select('*')
      .or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`)
      .order('display_order', { ascending: true });
    if (error) {
      logger.error(`Error loading FAQs for treatment ${serviceId}:`, error);
      return [];
    }
    return (data || []).map((f: any) => ({
      id: f.id,
      service_id: f.service_id || serviceId,
      treatment_id: f.treatment_id || serviceId,
      question: f.question,
      answer: f.answer,
      category: f.category || 'General',
      featured: f.featured ?? false,
      visibility: f.visibility || 'Public',
      display_order: f.display_order ?? 0
    }));
  },

  async saveTreatmentFAQs(serviceId: string, faqs: Partial<TreatmentFAQ>[]): Promise<boolean> {
    await supabase.from('treatment_faqs').delete().or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);

    if (faqs.length === 0) return true;

    const rows = faqs.map((f, idx) => ({
      service_id: serviceId,
      treatment_id: serviceId,
      question: f.question,
      answer: f.answer,
      category: f.category || 'General',
      featured: f.featured ?? false,
      visibility: f.visibility || 'Public',
      display_order: f.display_order ?? idx
    }));

    const { error: insErr } = await supabase.from('treatment_faqs').insert(rows);
    return !insErr;
  },

  // --- SEO Methods ---
  async getTreatmentSEO(serviceId: string): Promise<TreatmentSEO | null> {
    const { data, error } = await supabase
      .from('treatment_seo')
      .select('*')
      .or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`)
      .maybeSingle();
    if (error || !data) return null;
    return {
      id: data.id,
      treatment_id: data.treatment_id || serviceId,
      service_id: data.service_id || serviceId,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      canonical_url: data.canonical_url,
      og_image: data.og_image,
      schema: data.schema,
      robots: data.robots || 'index, follow'
    };
  },

  async saveTreatmentSEO(serviceId: string, seoData: Partial<TreatmentSEO>): Promise<boolean> {
    const existing = await this.getTreatmentSEO(serviceId);
    const payload = {
      treatment_id: serviceId,
      service_id: serviceId,
      meta_title: seoData.meta_title || null,
      meta_description: seoData.meta_description || null,
      canonical_url: seoData.canonical_url || null,
      og_image: seoData.og_image || null,
      schema: seoData.schema || null,
      robots: seoData.robots || 'index, follow',
      updated_at: new Date().toISOString()
    };

    if (existing?.id) {
      const { error } = await supabase.from('treatment_seo').update(payload).eq('id', existing.id);
      return !error;
    } else {
      const { error } = await supabase.from('treatment_seo').insert(payload);
      return !error;
    }
  },

  // --- Content Blocks Methods ---
  async getTreatmentBlocks(serviceId: string): Promise<TreatmentBlock[]> {
    const { data, error } = await supabase
      .from('treatment_blocks')
      .select('*')
      .or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`)
      .order('display_order', { ascending: true });
    if (error) {
      logger.error(`Error loading blocks for treatment ${serviceId}:`, error);
      return [];
    }
    return (data || []).map((b: any) => ({
      id: b.id,
      treatment_id: b.treatment_id || serviceId,
      service_id: b.service_id || serviceId,
      block_type: b.block_type,
      title: b.title,
      content: b.content,
      display_order: b.display_order ?? 0,
      is_active: b.is_active ?? true
    }));
  },

  async saveTreatmentBlocks(serviceId: string, blocks: Partial<TreatmentBlock>[]): Promise<boolean> {
    await supabase.from('treatment_blocks').delete().or(`service_id.eq.${serviceId},treatment_id.eq.${serviceId}`);

    if (blocks.length === 0) return true;

    const rows = blocks.map((b, idx) => ({
      treatment_id: serviceId,
      service_id: serviceId,
      block_type: b.block_type || 'Overview',
      title: b.title || b.block_type || 'Overview',
      content: b.content || '',
      display_order: b.display_order ?? idx,
      is_active: b.is_active ?? true
    }));

    const { error: insErr } = await supabase.from('treatment_blocks').insert(rows);
    return !insErr;
  },

  // --- Analytics & Views ---
  async incrementViewsCount(serviceId: string): Promise<void> {
    try {
      await supabase.rpc('increment_service_views', { p_service_id: serviceId });
    } catch {
      // Fallback
    }
  }
};
