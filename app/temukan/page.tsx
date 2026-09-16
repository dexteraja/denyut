"use client";

import { useState } from "react";
import { Search, Flame } from "lucide-react";
import Link from "next/link";
import { INTERESTS } from "@/lib/mock-data";
import { getVideosByInterests, getViralVideos } from "@/lib/mock-data";
import { BottomNav } from "@/components/bottom-nav";
import clsx from "clsx";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}rb`;
  return `${n}`;
}

export default function DiscoverPage() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const grid = activeSlug ? getVideosByInterests([activeSlug]) : getViralVideos(12);

  const filteredGrid = query
    ? grid.filter(
        (v) =>
          v.caption.toLowerCase().includes(query.toLowerCase()) ||
          v.hashtags.some((h) => h.toLowerCase().includes(query.toLowerCase()))
      )
    : grid;

  return (
    <main className="flex h-full w-full flex-col bg-midnight">
      <header className="flex-shrink-0 px-4 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display mb-3 text-xl font-semibold text-white">Temukan</h1>
        <div className="glass flex items-center gap-2 rounded-full px-4 py-2.5">
          <Search size={17} className="text-glass-fg-dim" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari video atau #tagar"
            className="flex-1 bg-transparent text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />
        </div>

        <div className="mt-3 -mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          <button
            onClick={() => setActiveSlug(null)}
            className={clsx(
              "flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
              !activeSlug
                ? "border-lime/50 bg-lime/15 text-lime"
                : "border-white/15 bg-white/5 text-glass-fg-dim"
            )}
          >
            <Flame size={14} />
            Viral
          </button>
          {INTERESTS.map((interest) => (
            <button
              key={interest.slug}
              onClick={() => setActiveSlug(interest.slug)}
              className={clsx(
                "flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium",
                activeSlug === interest.slug
                  ? "border-violet bg-violet/20 text-white"
                  : "border-white/15 bg-white/5 text-glass-fg-dim"
              )}
            >
              <span>{interest.emoji}</span>
              {interest.label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-24">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {filteredGrid.map((video) => (
            <Link
              key={video.id}
              href="/"
              className={clsx(
                "group relative aspect-[9/16] overflow-hidden rounded-2xl bg-gradient-to-br",
                video.posterColor
              )}
            >
              <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/25" />
              <div className="absolute inset-x-0 bottom-0 p-2.5">
                <p className="line-clamp-2 text-xs font-medium text-white drop-shadow">
                  {video.caption}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-white/85">
                  <Flame size={11} className="text-lime" />
                  {formatCount(video.viewCount)}
                </div>
              </div>
            </Link>
          ))}
          {filteredGrid.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-glass-fg-dim">
              Tidak ada video yang cocok. Coba kata kunci lain.
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
