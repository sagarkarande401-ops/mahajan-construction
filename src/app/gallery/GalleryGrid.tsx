"use client";

import { useState, useMemo } from "react";
import Image from "next/image";

import { GalleryItem } from "@/types";
import { cn } from "@/lib/utils";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((i) => i.category).filter(Boolean)))], [items]) as string[];
  const [active, setActive] = useState("All");
  const filtered = active === "All" ? items : items.filter((img) => img.category === active);

  if (items.length === 0) {
    return <p className="text-concrete">No photos uploaded yet — add some from the admin panel.</p>;
  }

  return (
    <div>
      {categories.length > 1 && (
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={cn(
                "px-5 py-2.5 text-sm tracking-wide transition-colors",
                active === cat ? "bg-ink text-canvas dark:bg-canvas dark:text-ink" : "text-ink hover:text-gold dark:text-canvas"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

            <div className="mt-10 columns-2 gap-4 md:columns-3 [&>*]:mb-4">
        {filtered.map((img, i) => (
          <button
            key={img.id}
            onClick={() => console.log("Open image", i)}
            className="group relative block w-full overflow-hidden bg-concrete-light"
            style={{ aspectRatio: i % 3 === 0 ? "3/4" : "1/1" }}
          >
            <Image
              src={img.url}
              alt={img.title || "Mahajan Construction project"}
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-luxury group-hover:scale-110"
            />

            {img.title && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-mono text-[10px] uppercase tracking-widest text-canvas">
                  {img.title}
                </span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}