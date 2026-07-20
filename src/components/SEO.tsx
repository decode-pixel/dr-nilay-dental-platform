import { useEffect, useState } from "react";
import { SettingsService } from "../lib/settingsService";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  schemaData?: any[];
}

export default function SEO({ title: fallbackTitle, description: fallbackDesc, url: fallbackUrl, schemaData }: SEOProps) {
  const [seo, setSeo] = useState<any>(null);

  useEffect(() => {
    const pathName = window.location.pathname;
    SettingsService.getSeoForPath(pathName).then((data) => {
      if (data) {
        setSeo(data);
      }
    });
  }, []);

  const activeTitle = seo?.title || fallbackTitle;
  const activeDesc = seo?.meta_description || fallbackDesc;
  const activeUrl = seo?.canonical_url || fallbackUrl;

  useEffect(() => {
    // Update Title
    document.title = activeTitle;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', activeDesc);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', activeUrl);

    // Open Graph Tags
    const setOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setOgTag('og:title', seo?.og_title || activeTitle);
    setOgTag('og:description', seo?.og_description || activeDesc);
    setOgTag('og:url', activeUrl);
    setOgTag('og:type', 'website');
    if (seo?.og_image) {
      setOgTag('og:image', seo.og_image);
    }

    // Twitter Card Tags
    const setTwitterTag = (name: string, content: string) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    setTwitterTag('twitter:title', seo?.twitter_title || activeTitle);
    setTwitterTag('twitter:description', seo?.twitter_description || activeDesc);
    if (seo?.twitter_image) {
      setTwitterTag('twitter:image', seo.twitter_image);
    }

    // Schema.org Structured Data
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
    existingScripts.forEach(script => script.remove());

    const activeSchema = seo?.structured_data || schemaData || {
      "@context": "https://schema.org",
      "@type": "Dentist",
      "name": "Dr. Nilay Saha Advanced Dental Clinic",
      "image": "https://res.cloudinary.com/tud0sobq/image/upload/v1783343231/ChatGPT_Image_Jul_6_2026_06_28_47_PM_1_ipilq6.png",
      "telephone": "+919609180979",
      "url": "https://www.sahadental.com",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Belerhat & Parulia",
        "addressLocality": "Purba Bardhaman",
        "addressRegion": "West Bengal",
        "postalCode": "713101",
        "addressCountry": "IN"
      },
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
          "opens": "09:00",
          "closes": "21:00"
        }
      ]
    };

    if (activeSchema) {
      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.textContent = JSON.stringify(activeSchema);
      document.head.appendChild(script);
    }

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]');
      scripts.forEach(script => script.remove());
    };
  }, [activeTitle, activeDesc, activeUrl, schemaData, seo]);

  return null;
}
