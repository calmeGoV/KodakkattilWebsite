"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PlaceholderBadge } from "@/components/ui/placeholder-badge";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeader } from "@/components/ui/section-header";
import type { FaqItem } from "@/types/content";

type Props = {
  kicker?: string;
  title: string;
  intro?: string;
  items: FaqItem[];
  cta?: { label: string; href: string };
};

/**
 * The five questions are verbatim from the source document. The answers are
 * not in it — every one below is a draft flagged for clinician sign-off, and
 * badged as such in development. See DESIGN.md §8.
 */
export function FaqSection({ kicker, title, intro, items, cta }: Props) {
  return (
    <section className="hairline-b bg-surface py-20 lg:py-28">
      <div className="mx-auto max-w-[84rem] px-5 lg:px-10">
        <SectionHeader
          id="faq-heading"
          kicker={kicker}
          title={title}
          intro={intro}
          cta={cta}
        />

        <Reveal className="mt-12 max-w-[68rem]">
          <Accordion type="single" collapsible className="border-t border-accent/30">
            {items.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>
                  {item.draft && (
                    <p className="mb-3">
                      <PlaceholderBadge kind="draft" />
                    </p>
                  )}
                  <p className="leading-relaxed">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
