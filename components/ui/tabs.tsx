"use client";

import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Radix earns its place here: roving tabindex, arrow-key navigation and the
 * correct tab/tabpanel semantics are exactly the things hand-rolled segmented
 * controls get wrong.
 */
export const Tabs = TabsPrimitive.Root;

export function TabsList({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "flex w-full flex-wrap gap-px rounded-tab border border-accent/40 bg-accent/10 p-px",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "label-caps flex-1 whitespace-nowrap rounded-[15px] px-4 py-3 text-ink-muted",
        "transition-colors duration-150 hover:text-accent-ink",
        "data-[state=active]:bg-primary data-[state=active]:text-surface",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn("focus-visible:outline-none", className)}
      {...props}
    />
  );
}
