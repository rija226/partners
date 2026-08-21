import { useEffect, useRef, useState } from "react";

// Used for the scroll-reveal fade-in on page-builder blocks (see ComponentMapper.tsx). Reveals
// once and stops observing — content shouldn't fade back out scrolling back up past it, that
// reads as broken rather than polished. prefers-reduced-motion is handled in CSS (GridItem,
// CmsPage.style.ts), not here — checking it in JS would mean a different initial state on the
// server (no `window`) than on the client for reduced-motion users, causing a hydration mismatch.
export function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}
