"use client";

import { useRef, useState, useCallback } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfterSlider({ before, after }: { before: string; after: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/10] w-full select-none overflow-hidden bg-concrete-light"
      onMouseMove={(e) => dragging && updatePosition(e.clientX)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onTouchMove={(e) => updatePosition(e.touches[0].clientX)}
    >
      <Image src={after} alt="After renovation" fill className="object-cover" sizes="90vw" />
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <Image src={before} alt="Before renovation" fill className="object-cover" sizes="90vw" />
      </div>
      <div className="pointer-events-none absolute left-4 top-4 bg-ink/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-canvas">
        Before
      </div>
      <div className="pointer-events-none absolute right-4 top-4 bg-canvas/90 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-ink">
        After
      </div>
      <div
        className="absolute top-0 z-10 h-full w-px cursor-ew-resize bg-canvas"
        style={{ left: `${position}%` }}
        onMouseDown={() => setDragging(true)}
      >
        <div className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-canvas text-ink shadow-lg">
          <MoveHorizontal className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

