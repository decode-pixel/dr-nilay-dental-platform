-- Migration: 009_seed_initial_data.sql
-- Description: Idempotent seed data for clinics, services, and global settings.

-- 1. Seed Clinics
INSERT INTO public.clinics (slug, name, address, landmark, phone, whatsapp_phone, emergency_phone, google_map_link, visiting_note, display_order)
VALUES 
(
    'belerhat',
    'Saha Dental Clinic - Belerhat',
    'New Saha Pharmacy, Belerhat Station Road, Ukhra Sarangpur, Purbasthali, Purba Bardhaman, West Bengal – 713513',
    'Near Belerhat Rail Gate',
    '+91 9609180979',
    '+91 9609180979',
    '+91 9609180979',
    'https://maps.app.goo.gl/MV8tYqxGJCsAYmbx9?g_st=ac',
    'Monday – Sunday: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM',
    1
),
(
    'parulia',
    'Saha Dental Clinic - Parulia',
    'Parulia Main Road, Purba Bardhaman, West Bengal',
    'Near Parulia Market',
    '+91 9609180979',
    '+91 9609180979',
    '+91 9609180979',
    NULL,
    'Visiting schedule updating soon.',
    2
),
(
    'nabadwip',
    'Saha Dental Clinic - Nabadwip',
    'Nabadwip Town, Nadia, West Bengal',
    'Near Nabadwip Station',
    '+91 9609180979',
    '+91 9609180979',
    '+91 9609180979',
    NULL,
    'Visiting schedule updating soon.',
    3
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    landmark = EXCLUDED.landmark,
    phone = EXCLUDED.phone,
    whatsapp_phone = EXCLUDED.whatsapp_phone,
    visiting_note = EXCLUDED.visiting_note,
    display_order = EXCLUDED.display_order;

-- 2. Seed Services
INSERT INTO public.services (slug, name, description, icon, featured, category, estimated_duration, display_order, learn_more_slug)
VALUES 
('root-canal', 'Root Canal Treatment', 'Save your natural tooth with advanced endodontic care designed to relieve pain and preserve your tooth.', 'ToothIcon', true, 'Endodontics', 60, 1, 'root-canal'),
('re-root-canal', 'Re-Root Canal Treatment', 'Expert retreatment to heal persistent infections and restore your tooths foundation.', 'ShieldPlus', false, 'Endodontics', 90, 2, 're-root-canal'),
('fillings', 'Dental Fillings', 'Restore cavities with tooth-colored, durable fillings for a natural seamless look.', 'Sparkles', false, 'Restorative', 30, 3, 'fillings'),
('scaling', 'Teeth Cleaning & Scaling', 'Professional cleaning to remove plaque and tartar for healthy gums and fresh breath.', 'Droplet', false, 'Preventive', 30, 4, 'scaling'),
('crowns', 'Crowns', 'Custom-fitted caps to strengthen and protect damaged or weakened teeth.', 'Crown', false, 'Prosthodontics', 45, 5, 'crowns'),
('bridges', 'Bridges', 'Replace missing teeth seamlessly with durable and natural-looking dental bridges.', 'Link', false, 'Prosthodontics', 60, 6, 'bridges'),
('extraction', 'Tooth Extraction', 'Painless and safe removal of severely damaged or decayed teeth.', 'Scissors', false, 'Surgery', 30, 7, 'extraction'),
('wisdom-tooth', 'Wisdom Tooth Removal', 'Gentle surgical extraction of impacted or problematic wisdom teeth.', 'Activity', false, 'Surgery', 45, 8, 'wisdom-tooth'),
('dentures', 'Dentures', 'Comfortable, custom-made removable replacements for missing teeth.', 'Smile', false, 'Prosthodontics', 45, 9, 'dentures'),
('gum-treatment', 'Gum Treatment', 'Advanced care for periodontal disease to restore your gum health.', 'Heart', false, 'Periodontics', 45, 10, 'gum-treatment'),
('pediatric', 'Pediatric Dentistry', 'Friendly and gentle dental care tailored specifically for children.', 'Baby', false, 'Pediatric', 30, 11, 'pediatric'),
('implants', 'Dental Implants', 'Permanent and natural-looking replacements for missing teeth roots.', 'Target', false, 'Implantology', 60, 12, 'implants'),
('braces', 'Braces & Orthodontics', 'Straighten your teeth and correct your bite with modern orthodontic solutions.', 'AlignCenter', false, 'Orthodontics', 30, 13, 'braces'),
('smile-design', 'Smile Designing', 'Complete smile makeovers using veneers, contouring, and advanced aesthetics.', 'Wand2', false, 'Cosmetic', 60, 14, 'smile-design'),
('whitening', 'Teeth Whitening', 'Brighten your smile safely with our professional whitening treatments.', 'Sun', false, 'Cosmetic', 45, 15, 'whitening'),
('oral-surgery', 'Oral Surgery', 'Expert surgical procedures for complex dental and maxillofacial conditions.', 'Stethoscope', false, 'Surgery', 60, 16, 'oral-surgery'),
('xray', 'Digital X-Ray / RVG', 'Quick, low-radiation imaging for accurate and instant dental diagnosis.', 'Camera', false, 'Diagnostics', 15, 17, 'xray'),
('emergency', 'Emergency Dental Care', 'Immediate attention and relief for severe toothaches and dental injuries.', 'AlertCircle', false, 'Emergency', 30, 18, 'emergency'),
('preventive', 'Preventive Dental Check-up', 'Routine check-ups to catch and prevent dental issues before they worsen.', 'CheckCircle', false, 'Preventive', 30, 19, 'preventive'),
('consultation', 'Consultation', 'Comprehensive evaluation and personalized treatment planning with our experts.', 'MessageSquare', false, 'General', 30, 20, 'consultation')
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    icon = EXCLUDED.icon,
    featured = EXCLUDED.featured,
    category = EXCLUDED.category,
    estimated_duration = EXCLUDED.estimated_duration,
    display_order = EXCLUDED.display_order;

-- 3. Seed Global Settings
INSERT INTO public.settings (clinic_name, primary_phone, whatsapp_number, emergency_number, email, logo_url, default_appointment_duration_minutes)
SELECT 
    'Dr. Nilay Saha Dental Clinic',
    '+91 9609180979',
    '+91 9609180979',
    '+91 9609180979',
    'contact@drnilaysaha.com',
    'https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png',
    30
WHERE NOT EXISTS (SELECT 1 FROM public.settings);
