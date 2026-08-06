"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { ServiceFaq } from "@/types";

export function ServiceFaqAccordion({ faqs }: { faqs: ServiceFaq[] }) {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id ?? null);

  return (
    <div>
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="border-b border-line dark:border-line-dark">
            <button onClick={() => setOpenId(isOpen ? null : faq.id)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={isOpen}>
              <h3 className="font-display text-lg text-ink dark:text-canvas md:text-xl">{faq.question}</h3>
              <motion.span animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.3 }} className="shrink-0 text-gold">
                <Plus className="h-5 w-5" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                  <p className="max-w-xl pb-6 text-concrete">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
