"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { Video } from "@/lib/types";
import clsx from "clsx";

function HashtagLink({ tag }: { tag: string }) {
  return (
    <Link
      href={`/tag/${encodeURIComponent(tag)}`}
      className="text-sm font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
    >
      #{tag}
    </Link>
  );
}

export function VideoCaption({ video }: { video: Video }) {
  const [expanded, setExpanded] = useState(false);
  const [shouldTruncate, setShouldTruncate] = useState(false);
  const captionRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (captionRef.current) {
      const el = captionRef.current;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * 2;
      setShouldTruncate(el.scrollHeight > maxHeight + 2);
    }
  }, [video.caption, expanded]);

  return (
    <div className="absolute bottom-24 left-0 z-30 max-w-[72%] px-4 pb-2">
      {video.isViralPick && (
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-lime/15 border border-lime/40 px-2.5 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-lime animate-live-pulse" />
          <span className="text-[11px] font-semibold tracking-wide text-lime">
            Lagi Viral
          </span>
        </div>
      )}

      <div className="mb-2">
        <Link
          href={`/profil/${video.author.username}`}
          className="font-display text-[15px] font-semibold text-white"
        >
          @{video.author.username}
        </Link>
      </div>

      <p
        ref={captionRef}
        className={clsx(
          "mb-2 text-sm leading-snug text-white/95",
          shouldTruncate && !expanded && "line-clamp-2"
        )}
      >
        {video.caption}
      </p>

      {shouldTruncate && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mb-2 text-sm font-medium text-cyan-400"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}

      {video.hashtags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-x-2 gap-y-0.5">
          {video.hashtags.map((tag) => (
            <HashtagLink key={tag} tag={tag} />
          ))}
        </div>
      )}
    </div>
  );
}