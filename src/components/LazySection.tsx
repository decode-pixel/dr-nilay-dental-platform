import React, { useState, useEffect, useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  minHeight?: string | number;
}

/**
 * Reusable component to defer rendering of heavy, below-the-fold content
 * until it is close to entering the user's viewport.
 */
export default function LazySection({
  children,
  fallback = null,
  rootMargin = "250px",
  minHeight = "150px"
}: LazySectionProps) {
  const [isRendered, setIsRendered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || isRendered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRendered(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, isRendered]);

  return (
    <div
      ref={containerRef}
      style={{ minHeight: isRendered ? undefined : minHeight }}
      className="w-full"
    >
      {isRendered ? children : fallback}
    </div>
  );
}
