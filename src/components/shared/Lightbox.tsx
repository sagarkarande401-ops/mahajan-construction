"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { ReactNode } from "react";

interface LightboxProps {
  images: string[];
  children: ReactNode;
}

// Reusable lightbox: pass a render-prop `children` that receives `openAt(index)`
// so any gallery grid can trigger it without duplicating state logic.
export function Lightbox({ images, children }: LightboxProps) {
 const [activeIndex, setActiveIndex] = useState<number | null>(null);

const openAt = (index: number) => {
  setActiveIndex(index);
};
  const close = useCallback(() => setActiveIndex(null), []);
  const next = useCallback(() => setActiveIndex((i) => (i === null ? null : (i + 1) % images.length)), [images.length]);
  const prev = useCallback(
    () => setActiveIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, next, prev]);

  return (
    <>
      {children}
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-sm"
            onClick={close}
          >
            <button
              aria-label="Close gallery"
              onClick={close}
              className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center border border-canvas/30 text-canvas transition-colors hover:border-gold hover:text-gold"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              aria-label="Previous image"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-canvas/30 text-canvas transition-colors hover:border-gold hover:text-gold md:left-8"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="Next image"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-canvas/30 text-canvas transition-colors hover:border-gold hover:text-gold md:right-8"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-[70vh] w-[88vw] md:w-[75vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={images[activeIndex]} alt="" fill sizes="90vw" className="object-contain" />
            </motion.div>
            <span className="absolute bottom-6 font-mono text-xs tracking-wider text-canvas/60">
              {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

