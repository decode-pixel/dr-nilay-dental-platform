import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop — Navigation scroll handler.
 *
 * FIX: Previous 100ms delay was too short for lazy-loaded sections to mount.
 * Now uses a retry loop (up to 800ms) so hash-scrolling works even when the
 * target section is lazily hydrated after the route transition.
 *
 * Also corrects scroll-margin-top via explicit offset so the fixed Navbar (≈90px)
 * does not obscure the section heading.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Retry finding the element for up to 800ms to handle lazy hydration
      const id = hash.replace("#", "");
      const NAV_OFFSET = 110; // px — matches Navbar height + breathing room
      let attempts = 0;
      const maxAttempts = 16; // 16 × 50ms = 800ms total window

      const tryScroll = () => {
        const element = document.getElementById(id);
        if (element) {
          const top =
            element.getBoundingClientRect().top +
            window.pageYOffset -
            NAV_OFFSET;
          window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(tryScroll, 50);
        }
      };

      // First attempt after a minimal paint delay
      setTimeout(tryScroll, 80);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}
