import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-square", "aspect-[4/5]", "aspect-video"
  priority?: boolean; // if true, loading="eager" & fetchPriority="high" for LCP
  fallbackSrc?: string;
  blurPlaceholder?: boolean;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Production-Ready OptimizedImage Component
 * Implements AVIF/WebP/JPG fallback structure, skeleton pulse loading,
 * blur transitions, LCP priority handling, and graceful failure fallbacks.
 */
export default function OptimizedImage({
  src,
  alt,
  className = '',
  aspectRatio = '',
  priority = false,
  fallbackSrc = '/placeholder.webp',
  blurPlaceholder = true,
  objectFit = 'cover',
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Helper to generate AVIF and WebP candidate URLs if src is standard webp/png/jpg
  const getSourceVariants = (url: string) => {
    if (!url || url.startsWith('data:') || url.startsWith('http')) {
      return { avif: null, webp: null };
    }
    const base = url.substring(0, url.lastIndexOf('.'));
    return {
      avif: `${base}.avif`,
      webp: `${base}.webp`
    };
  };

  const variants = getSourceVariants(currentSrc);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  const objectFitClass = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  return (
    <div className={`relative overflow-hidden bg-white/5 ${aspectRatio} ${className}`}>
      {/* Skeleton Loading State */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-white/5 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#8B7BF7]/30 border-t-[#8B7BF7] animate-spin" />
        </div>
      )}

      {/* Graceful Fallback State when image fails completely */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0a0a0c] text-[#A1A1A6] p-4 text-center border border-white/10 rounded-inherit">
          <ImageOff className="w-6 h-6 text-[#8B7BF7]/60 mb-1.5" />
          <span className="text-[11px] font-medium text-gray-400 line-clamp-1">{alt}</span>
        </div>
      ) : (
        <picture>
          {/* AVIF Source */}
          {variants.avif && <source srcSet={variants.avif} type="image/avif" />}
          {/* WebP Source */}
          {variants.webp && <source srcSet={variants.webp} type="image/webp" />}
          
          <img
            src={currentSrc}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            onLoad={() => setIsLoaded(true)}
            onError={handleError}
            className={`w-full h-full ${objectFitClass} transition-all duration-700 ease-out ${
              !isLoaded && blurPlaceholder ? 'scale-105 blur-md opacity-0' : 'scale-100 blur-0 opacity-100'
            }`}
            {...rest}
          />
        </picture>
      )}
    </div>
  );
}
