"use client";

import Image from "next/image";
import { useState } from "react";

import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Click-to-play facade. Nothing from YouTube is requested until the visitor
 * chooses to watch — no autoplaying embed, no third-party script on first
 * paint, and no cost to a phone on a patchy connection.
 *
 * The poster frame is served from YouTube's static image host, which is a
 * single image request rather than the ~1MB the iframe player costs.
 */
export function VideoFacade({
  videoId,
  title,
  className,
}: {
  videoId: string;
  title: string;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={cn("relative aspect-video overflow-hidden bg-primary-deep", className)}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn(
        "group relative block aspect-video w-full overflow-hidden bg-primary-deep",
        className,
      )}
    >
      <Image
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        aria-hidden="true"
        fill
        unoptimized
        sizes="(max-width: 768px) 90vw, 40vw"
        className="object-cover opacity-80 transition-opacity duration-200 group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent-glow/70 bg-primary-deep/80 transition-colors duration-200 group-hover:bg-primary-deep">
          <svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true">
            <path d="M1 1l14 8-14 8z" fill="#D8BC85" />
          </svg>
        </span>
      </span>
      <span className="sr-only">
        {t("testimonials.playVideo")}: {title}
      </span>
    </button>
  );
}
