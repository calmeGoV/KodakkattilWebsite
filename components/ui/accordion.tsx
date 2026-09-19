"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Radix earns its place: correct button/region semantics, aria-expanded, and
 * keyboard handling that a hand-rolled details/summary hybrid gets wrong.
 *
 * The open/close animation is a grid-rows transition rather than a height
 * animation, so it needs no measurement and is stilled by the global
 * reduced-motion block.
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  className,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-accent/30", className)}
      {...props}
    />
  );
}

export function AccordionTrigger({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(
          "group flex flex-1 items-start justify-between gap-6 py-6 text-left",
          "font-display text-xl font-semibold text-ink transition-colors duration-150",
          "hover:text-accent-ink",
          className,
        )}
        {...props}
      >
        {children}
        <span
          aria-hidden="true"
          className="mt-1.5 flex h-6 w-6 shrink-0 items-center justify-center border border-accent/50 text-accent-ink transition-colors duration-150 group-hover:border-accent"
        >
          {/* A plus that becomes a minus — no rotating chevron. */}
          <svg width="11" height="11" viewBox="0 0 12 12">
            <path d="M0 6h12" stroke="currentColor" strokeWidth="1.3" />
            <path
              d="M6 0v12"
              stroke="currentColor"
              strokeWidth="1.3"
              className="origin-center transition-transform duration-200 group-data-[state=open]:scale-y-0"
            />
          </svg>
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

export function AccordionContent({
  className,
  children,
  ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(
        "grid grid-rows-[0fr] overflow-hidden transition-[grid-template-rows] duration-300 ease-out",
        "data-[state=open]:grid-rows-[1fr]",
        className,
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className="max-w-[64ch] pb-7 pr-10 text-ink-muted">{children}</div>
      </div>
    </AccordionPrimitive.Content>
  );
}
