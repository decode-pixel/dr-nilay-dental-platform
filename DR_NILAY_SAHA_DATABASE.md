# MASTER REFERENCE DATABASE: DR. NILAY SAHA DENTAL PLATFORM (`dr-nilay-dental-platform`)

> **Document Version**: 2.0.0 (Post-Phase 6 Minimalist Vector Architecture)  
> **Status**: Single Source of Truth for Clinical Data, Constants, Database Schema, and Application Architecture  
> **Purpose**: This document serves as the absolute reference master database for any AI agent, developer, content manager, or engineer working on the **Dr. Nilay Saha Dental Platform**. All constants, qualifications, clinic locations, and architectural patterns must strictly conform to the parameters defined below.

---

## 1. PRIMARY SURGEON PROFILE (SINGLE SOURCE OF TRUTH)

```
+-----------------------------------------------------------------------------------+
|                               DR. NILAY SAHA                                      |
|                 Principal Dental Surgeon & Oral Physician                         |
|                         WBDC Registration No. 4858-A                              |
+-----------------------------------------------------------------------------------+
```

| Field | Canonical Value | Source File / Table |
| :--- | :--- | :--- |
| **Full Name** | Dr. Nilay Saha | `src/lib/doctorService.ts`, `doctors` table |
| **Primary Designation** | Principal Surgeon, Dental Surgeon & Oral Physician | `src/lib/doctorService.ts` (`DEFAULT_NILAY_DOCTOR`) |
| **Medical Qualification** | **BDS** (Bachelor of Dental Surgery) | `src/lib/doctorService.ts`, `doctor_qualifications` |
| **State Dental License** | **4858-A** (`WBDC Registration No. 4858-A`) | `src/lib/constants.ts` (`DOCTOR_REGISTRATION_NUMBER`) |
| **Years of Experience** | **10+ Years** Active Practice (Founded in 2014) | `src/lib/doctorService.ts` |
| **Public Slug** | `dr-nilay-saha` | `doctors.public_slug` |
| **Spoken Languages** | English, Bengali, Hindi | `doctor_languages`, `MeetDrNilaySaha.tsx` state |
| **Status / Availability** | Active (`is_active: true`), `Available` | `doctors.status` |

### Core Clinical Philosophy & Biography
> *"Dr. Nilay Saha is a distinguished Dental Surgeon and Oral Physician with over a decade of precision clinical experience across multiple clinical centers in West Bengal. He specializes in single-visit root canal treatments, aesthetic restorations, and complex surgical procedures. His clinical approach emphasizes conservative dentistry—saving natural teeth wherever possible—while utilizing international zero-compromise sterilization standards and modern digital diagnostics to ensure optimum patient safety and comfort."*

---

## 2. CREDENTIALS, AWARDS, MEMBERSHIPS & TIMELINE DATABASE

All dynamic profile sections displayed in `MeetDrNilaySaha.tsx` read directly from Supabase relational tables (`doctor_qualifications`, `doctor_awards`, `doctor_certifications`, `doctor_specializations`). When offline or when the database falls back, the system enforces these exact canonical records:

### A. Medical Qualifications (`doctor_qualifications`)
| # | Title / Degree | Institution / Awarding Body | Description / Notes |
| :---: | :--- | :--- | :--- |
| **1** | Bachelor of Dental Surgery (BDS) | West Bengal University of Health Sciences | Comprehensive clinical degree in dental medicine and oral surgery. |
| **2** | Advanced Endodontic Residency | Certified Root Canal & Micro-Endodontic Specialist | Advanced training in rotary endodontics, apex locators, and single-visit root canal therapy. |

### B. Awards & Recognition (`doctor_awards`)
| # | Award Title | Awarding Body | Significance |
| :---: | :--- | :--- | :--- |
| **1** | Clinical Excellence Award | West Bengal Dental Association | Awarded for exceptional precision in surgical endodontics and restorative care. |
| **2** | Best Patient-Centered Dental Practice | Healthcare Innovation Forum | Recognized for gentle, anxiety-free patient care protocols and modern practice management. |

### C. Certifications & Memberships (`doctor_certifications`)
| # | Certification / Membership | Issuing Council / Association | Verification Details |
| :---: | :--- | :--- | :--- |
| **1** | Registered Medical Practitioner (Dental) | West Bengal Dental Council (WBDC) | License Reg. No. `4858-A` |
| **2** | Life Member | Indian Dental Association (IDA) | Active nationwide dental council representation |

### D. Specializations (`doctor_specializations`)
1. **Single-Visit Painless Root Canal Therapy** (Advanced rotary micro-endodontics)
2. **Aesthetic & Full Mouth Restorations** (Tooth-colored composite layering & ceramics)
3. **Surgical Wisdom Tooth Extractions** (Atraumatic impacted third-molar surgery)
4. **Preventive Pediatric & Family Dentistry** (Child-friendly care, fluoride & sealants)
5. **Smile Designing & Digital Ceramics** (Veneers, crowns, and aesthetic rehabilitation)

### E. Clinical Journey Timeline
* **2014 – Present (Principal Surgeon & Clinical Director)**: Founded and expanded regional clinical centers across Belerhat, Parulia, and Nabadwip with zero-compromise sterilization protocols.
* **Clinical Residency (Fellowship & Advanced Training)**: Completed specialized clinical training in micro-endodontics, rotary instrumentation, and single-visit painless root canal therapy.

---

## 3. CLINICAL NETWORK & LOCATIONS DATABASE (`clinics`)

Dr. Nilay Saha practices across **3 dedicated clinical centers** in West Bengal. The exact addresses, coordinates, phone numbers, visiting notes, and status rules are listed below:

```
                  +-----------------------------------+
                  |   DR. NILAY SAHA DENTAL CLINICS   |
                  +-----------------------------------+
                             /     |     \
          +-----------------+      |      +-----------------+
          |                        |                        |
          v                        v                        v
+-------------------+    +-------------------+    +-------------------+
|  BELERHAT CENTER  |    |  PARULIA CENTER   |    |  NABADWIP CENTER  |
|  Slug: belerhat   |    |  Slug: parulia    |    |  Slug: nabadwip   |
|  Status: ACTIVE   |    |  Status: EXPANDING|    |  Status: EXPANDING|
+-------------------+    +-------------------+    +-------------------+
```

### 1. Belerhat Center (`belerhat`) — Primary Flagship Center
* **Official Name**: `Saha Dental Clinic - Belerhat`
* **Full Canonical Address**: `New Saha Pharmacy, Belerhat Station Road, Ukhra Sarangpur, Purbasthali, Purba Bardhaman, West Bengal – 713513`
* **Landmark**: `Near Belerhat Rail Gate`
* **Contact Phone / WhatsApp**: `+91 9609180979`
* **Google Maps Link**: `https://maps.app.goo.gl/MV8tYqxGJCsAYmbx9?g_st=ac`
* **Visiting Note**: `Monday – Sunday: 10:00 AM – 2:00 PM & 5:00 PM – 8:00 PM`
* **Weekly Schedule Breakdown**:
  * **Monday – Friday**: `10:00 AM – 1:30 PM`, `5:00 PM – 8:30 PM`
  * **Saturday**: `10:00 AM – 2:00 PM`, `6:00 PM – 9:00 PM`
  * **Sunday**: `By Appointment Only / Emergency Care`
* **Google Verified Rating**: `Star Rating (5.0 / 4.9) • 120+ Reviews`
* **Available Treatments**: Root Canal Treatment, Dental Filling, Scaling, Crown & Bridge, Denture, Tooth Extraction, Oral Surgery, Consultation.

### 2. Parulia Center (`parulia`) — Expanding Center
* **Official Name**: `Saha Dental Clinic - Parulia`
* **Full Canonical Address**: `Parulia Main Road, Purba Bardhaman, West Bengal`
* **Landmark**: `Near Parulia Market`
* **Contact Phone / WhatsApp**: `+91 9609180979`
* **Visiting Note / Status Rule**: `Visiting schedule updating soon.`
* **Google Verified Rating**: `Star Rating • 48+ Reviews`
* **Available Treatments**: Consultation, Dental Filling, Scaling.

### 3. Nabadwip Center (`nabadwip`) — Expanding Center
* **Official Name**: `Saha Dental Clinic - Nabadwip`
* **Full Canonical Address**: `Nabadwip Town, Nadia, West Bengal`
* **Landmark**: `Near Nabadwip Station`
* **Contact Phone / WhatsApp**: `+91 9609180979`
* **Visiting Note / Status Rule**: `Visiting schedule updating soon.`
* **Google Verified Rating**: `Star Rating • 32+ Reviews`
* **Available Treatments**: Consultation, Tooth Extraction, Root Canal Treatment.

---

## 4. CANONICAL CONSTANTS & CONTACT PROTOCOLS (`src/lib/constants.ts`)

Any code referencing registration numbers, contact numbers, or status labels **MUST NOT hardcode strings**. Instead, import from `src/lib/constants.ts`:

```typescript
// Single Source of Truth: Clinical Credentials & Contact Numbers
export const DOCTOR_REGISTRATION_NUMBER = '4858-A';

export const PRIMARY_PHONE_NUMBER = '+919609180979';
export const PRIMARY_PHONE_DISPLAY = '+91 9609180979';
export const PRIMARY_PHONE_DIGITS = '9609180979';

export const PRIMARY_WHATSAPP_NUMBER = '+919609180979';
export const PRIMARY_WHATSAPP_DIGITS = '919609180979';

export const CLINIC_SLUGS = {
  BELERHAT: 'belerhat',
  PARULIA: 'parulia',
  NABADWIP: 'nabadwip',
};

export const CLINIC_NAMES: Record<string, string> = {
  [CLINIC_SLUGS.BELERHAT]: 'Belerhat Center',
  [CLINIC_SLUGS.PARULIA]: 'Parulia Center',
  [CLINIC_SLUGS.NABADWIP]: 'Nabadwip Center',
};
```

---

## 5. COMPLETE TREATMENTS & SERVICES CATALOG (`services` / `treatmentsData`)

The platform supports **20 distinct clinical procedures**, defined in `src/data/treatments.ts` and seeded into `services` table (`supabase/migrations/009_seed_initial_data.sql`):

| Slug | Treatment Name | Category | Duration (min) | Featured | Primary Icon |
| :--- | :--- | :--- | :---: | :---: | :--- |
| `root-canal` | **Root Canal Treatment** | Endodontics | 60 | Yes | `ToothIcon` |
| `re-root-canal` | **Re-Root Canal Treatment** | Endodontics | 90 | No | `ShieldPlus` |
| `fillings` | **Dental Fillings** | Restorative | 30 | No | `Sparkles` |
| `scaling` | **Teeth Cleaning & Scaling** | Preventive | 30 | No | `Droplet` |
| `crowns` | **Crowns** | Prosthodontics | 45 | No | `Crown` |
| `bridges` | **Bridges** | Prosthodontics | 60 | No | `Link` |
| `extraction` | **Tooth Extraction** | Surgery | 30 | No | `Scissors` |
| `wisdom-tooth` | **Wisdom Tooth Removal** | Surgery | 45 | No | `Activity` |
| `dentures` | **Dentures** | Prosthodontics | 45 | No | `Smile` |
| `gum-treatment` | **Gum Treatment** | Periodontics | 45 | No | `Heart` |
| `pediatric` | **Pediatric Dentistry** | Pediatric | 30 | No | `Baby` |
| `implants` | **Dental Implants** | Implantology | 60 | No | `Target` |
| `braces` | **Braces & Orthodontics** | Orthodontics | 30 | No | `AlignCenter` |
| `smile-design` | **Smile Designing** | Cosmetic | 60 | No | `Wand2` |
| `whitening` | **Teeth Whitening** | Cosmetic | 45 | No | `Sun` |
| `oral-surgery` | **Oral Surgery** | Surgery | 60 | No | `Stethoscope` |
| `xray` | **Digital X-Ray / RVG** | Diagnostics | 15 | No | `Camera` |
| `emergency` | **Emergency Dental Care** | Emergency | 30 | No | `AlertCircle` |
| `preventive` | **Preventive Dental Check-up** | Preventive | 30 | No | `CheckCircle` |
| `consultation` | **Consultation** | General | 30 | No | `MessageSquare` |

---

## 6. SUPABASE DATABASE ARCHITECTURE & REPOSITORY PATTERNS

### Core Relational Schema (`public.*`)
1. **`doctors` Table**: Stores master profiles (`id: 'dr-nilay-saha-primary'`, name, designation, qualification, registration_number, experience_years, bio, status, is_active).
2. **`doctor_qualifications`, `doctor_awards`, `doctor_certifications` Tables**: One-to-many relationship (`doctor_id -> doctors.id`). Contains `title`, `institution`, `description`, `issue_date`, and `display_order`.
3. **`doctor_languages` & `language_catalog` Tables**: Multi-to-multi mapping linking Dr. Nilay Saha (`doctor_id`) to supported spoken languages (`English`, `Bengali`, `Hindi`).
4. **`doctor_specializations` & `specialization_catalog` Tables**: Links surgeon profile to featured clinical procedures (`Single-Visit Root Canal`, `Surgical Extractions`, etc.).
5. **`clinics` Table**: Stores the 3 physical center profiles (`slug`, `name`, `address`, `landmark`, `phone`, `whatsapp_phone`, `visiting_note`, `google_rating`, `review_count`).
6. **`clinic_schedule` Table**: Contains day-by-day weekly session slots (`day_of_week`, `session`, `start_time`, `end_time`, `doctor_available`).
7. **`booking_requests` Table**: Stores live patient appointment bookings, preferred date/time/clinic, assigned `doctor_id`, and status workflow (`new_request` -> `confirmed` -> `checked_in` -> `in_treatment` -> `completed`).

### Resilience & Fallback Layer (`DoctorRepository` & `normalizeDoctorProfile`)
To guarantee high availability and prevent UI broken states if network latency occurs or if database tables are unseeded, `src/lib/doctorService.ts` implements defensive fallback patterns:
```typescript
export function normalizeDoctorProfile(doc: Doctor): Doctor {
  if (!doc) return doc;
  const isNilay = !doc.name || doc.name.toLowerCase().includes('nilay') || doc.name.toLowerCase().includes('saha');
  if (isNilay) {
    return {
      ...doc,
      profile_image: '/dr-nilay-saha.jpg',
      cover_image: '/dr-nilay-saha.jpg',
      signature_image: '/dr-nilay-saha.jpg'
    };
  }
  return doc;
}
```
If `DoctorRepository.getDoctors()` fails, it returns `[DEFAULT_NILAY_DOCTOR]` instantly, ensuring the website never shows blank credentials.

### Doctor Assignment & Round-Robin Load Balancer (`DoctorAssignmentResolver`)
When a patient books a procedure without explicitly choosing a practitioner, `DoctorAssignmentResolver.resolveAssignedDoctor()` executes:
1. Queries `DoctorService.resolveAvailableDoctors(clinicId, dateStr, sessionName)`.
2. Filters doctors whose `doctor_treatments` include the target `serviceSlug`.
3. Checks historical booking density in `booking_requests` for `dateStr` and assigns the appointment to the candidate with the lowest active load (Round-Robin distribution).

---

## 7. BRAND DESIGN SYSTEM & PERFORMANCE RULES (CRITICAL)

### A. Ultra-Fast, Image-Free Minimalist Architecture
In accordance with user directives and Phase 6 performance benchmarks, **raster images (`.jpg`, `.webp`, `.png`) have been eliminated from all public-facing components** (`Navbar`, `Hero`, `MeetDrNilaySaha`, `Clinics`, `TreatmentDetails`, `Treatments`).
* **Why**: Prevents cumulative layout shift (CLS), eliminates network requests, guarantees **60 FPS scrolling**, and achieves sub-second page loads even on low-bandwidth rural mobile networks in West Bengal.
* **Vector Replacement Standard**: Always use clean typography cards (`#09281D` dark cards with `#10B981` emerald highlights), SVG brand icons (`ToothIcon`, `WhatsAppIcon`), and crisp `lucide-react` vector badges (`GraduationCap`, `ShieldCheck`, `Award`, `MapPin`, `BadgeCheck`).
* **Rule**: **DO NOT reintroduce external image links or heavy raster graphics** into `Hero.tsx`, `MeetDrNilaySaha.tsx`, or `Clinics.tsx`.

### B. Canonical Color Palette & Design Tokens (`src/index.css`)
```css
:root {
  /* Brand Theme Tokens */
  --bg-primary: #F4F7F4;        /* Pearl White / Mint Tint (Main Section Backgrounds) */
  --bg-card: #FAFDFB;           /* Clean Card Background */
  --bg-dark-card: #09281D;      /* Deep Forest Green (Surgeon Credentials & Clinic Cards) */
  
  --text-main: #122820;         /* Primary Dark Green-Black Text */
  --text-muted: #2C4238;        /* Secondary Slate-Green Text */
  --text-subtle: #4B6358;       /* Subtle Metadata Text */
  
  --accent-emerald: #10B981;    /* Primary Action / Highlight Green */
  --accent-emerald-dark: #059669; /* Gradient Stop / Hover State */
  --accent-gold: #C5A059;       /* Premium Medical Gold (Awards & Sub-badges) */
}
```

---

## 8. SUMMARY CHECKLIST FOR FUTURE AGENTS & DEVELOPERS

1. **When updating doctor credentials**: Always edit `DEFAULT_NILAY_DOCTOR` in `src/lib/doctorService.ts` AND verify the database seed rows in `supabase/migrations/009_seed_initial_data.sql`.
2. **When displaying registration or phone numbers**: Always import `DOCTOR_REGISTRATION_NUMBER` (`4858-A`), `PRIMARY_PHONE_NUMBER`, and `PRIMARY_WHATSAPP_NUMBER` from `src/lib/constants.ts`.
3. **When modifying clinic addresses or hours**: Update `ClinicRepository` / `009_seed_initial_data.sql` for `belerhat`, `parulia`, or `nabadwip`. Remember that `parulia` and `nabadwip` return `"Visiting schedule updating soon."` via `ClinicStatusResolver` until full operating hours are live.
4. **When creating UI components**: Rely on SVG vectors (`ToothIcon`) and structured typography cards. Never add heavy images or blur filters (`backdrop-filter: blur`) that degrade scroll performance.

*End of Master Reference Database Document.*
