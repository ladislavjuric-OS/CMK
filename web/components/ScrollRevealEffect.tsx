"use client";

import { useEffect } from "react";

/**
 * Mirrors static HTML: IntersectionObserver adds .visible to .reveal blocks inside a scoped page root
 * (e.g. .pg-materials, .pg-momentum). CSS must define .{scope} .reveal and .{scope} .reveal.visible.
 */
export default function ScrollRevealEffect({ scopeClass }: { scopeClass: string }) {
  useEffect(() => {
    const root = scopeClass.replace(/^\./, "");
    const els = document.querySelectorAll(`.${root} .reveal`);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [scopeClass]);

  return null;
}
