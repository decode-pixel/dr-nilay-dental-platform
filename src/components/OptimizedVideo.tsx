import React, { useState, useEffect, useRef } from 'react';
import OptimizedImage from './OptimizedImage';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export interface OptimizedVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  poster: string;
  alt: string;
  className?: string;
  aspectRatio?: string; // e.g. "aspect-video"
  isBackgroundLoop?: boolean; // if true, force muted, autoPlay, loop, playsInline with controls off
  showCustomControls?: boolean;
}

/**
 * Production-Ready OptimizedVideo Component
 * Supports Hero Video, Clinic Walkthrough, Doctor Introduction, Background Loops.
 * Handles reduced motion preferences, low bandwidth / saveData detection, lazy loading via IntersectionObserver,
 * poster support with OptimizedImage fallback, and custom luxury controls.
 */
export default function OptimizedVideo({
  src,
  poster,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
  isBackgroundLoop = false,
  showCustomControls = false,
  ...rest
}: OptimizedVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(isBackgroundLoop);
  const [isLoaded, setIsLoaded] = useState(false);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [lowBandwidth, setLowBandwidth] = useState(false);

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleMotionChange);

    // Check bandwidth / saveData if supported by browser
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (conn) {
      if (conn.saveData || conn.effectiveType === '2g' || conn.effectiveType === 'slow-2g') {
        setLowBandwidth(true);
      }
    }

    return () => mediaQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadVideo(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: '100px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current || !shouldLoadVideo) return;

    if (isBackgroundLoop && !reducedMotion && !lowBandwidth) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Autoplay blocked or failed, gracefully fallback to poster
        setIsPlaying(false);
      });
    }
  }, [shouldLoadVideo, isBackgroundLoop, reducedMotion, lowBandwidth]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  // If user prefers reduced motion or low bandwidth is detected on a background loop,
  // we render the high-quality static poster image instead to preserve performance and accessibility.
  if (isBackgroundLoop && (reducedMotion || lowBandwidth)) {
    return (
      <div ref={containerRef} className={`relative overflow-hidden bg-[#0a0a0c] ${aspectRatio} ${className}`}>
        <OptimizedImage
          src={poster}
          alt={`${alt} (Static Preview)`}
          priority={false}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative overflow-hidden bg-[#0a0a0c] rounded-[2rem] border border-white/10 ${aspectRatio} ${className}`}>
      {/* Poster / Fallback Image rendered until video is loaded or if video fails */}
      {(!isLoaded || !shouldLoadVideo) && (
        <div className="absolute inset-0 z-10">
          <OptimizedImage
            src={poster}
            alt={alt}
            priority={false}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {shouldLoadVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted={isMuted}
          loop={isBackgroundLoop || rest.loop}
          autoPlay={isBackgroundLoop && !reducedMotion}
          playsInline
          onLoadedData={() => setIsLoaded(true)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className={`w-full h-full object-cover transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          {...rest}
        />
      )}

      {/* Custom Luxury Controls for non-background feature videos (Walkthrough, Doctor Intro) */}
      {showCustomControls && isLoaded && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full glass-2 border border-white/15 backdrop-blur-xl">
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            className="w-8 h-8 rounded-full bg-[#8B7BF7]/20 flex items-center justify-center text-white hover:bg-[#8B7BF7]/40 transition-colors"
          >
            {isPlaying ? <Pause className="w-4 h-4 text-[#8B7BF7]" /> : <Play className="w-4 h-4 text-[#8B7BF7] ml-0.5" />}
          </button>
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/15 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}
    </div>
  );
}
