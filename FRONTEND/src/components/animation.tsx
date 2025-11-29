"use client";

import { useEffect, useRef } from "react";

export default function Animation() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const original = el.innerHTML;

            // Restart the SVG animation by clearing + resetting DOM
            el.innerHTML = "";
            el.innerHTML = original;
          }
        });
      },
      {
        threshold: 0.4, // 40% of the element is visible
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="
        absolute 
        right-0 
        top-1/2 
        -translate-y-1/2 
        translate-x-20
        w-[260px] 
        opacity-40 
        pointer-events-none 
        z-0
      "
    >
      {/* ⬇️ PUT YOUR SVG CODE FROM STORYSET BELOW ⬇️ */}
      {/* Example:
      <svg>
        ...
      </svg>
      */}
    </div>
  );
}
