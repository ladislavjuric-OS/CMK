"use client";

import { useEffect } from "react";

export default function MomentumRevealEffect() {
  useEffect(() => {
    const els = document.querySelectorAll(".pg-momentum .reveal");
    if (!els.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return null;
}
