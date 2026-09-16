"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import { getVideosByHashtag } from "@/lib/mock-data";
import clsx from "clsx";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}rb`;
  return `${n}`;
}

export default function HashtagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const [tag, setTag] = useState("");
  const [videos, setVideos] = useState<{ id: string; caption: string; hashtags: string[]; posterColor: string; viewCount: number; author: { username: string } }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      const decodedTag = decodeURIComponent(p.tag);
      setTag(decodedTag);
      const matched = getVideosByHashtag(decodedTag);
      setVideos(matched);
      setLoading(false);
    });
  }, [params]);

  if (loading) {
    return (
      <main className="flex h-full w-full flex-col bg-midnight">
        <header className="flex-shrink-0 px-4 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="flex items-center gap-3">
            <Link href="/temukan" className="glass flex h-10 w-10 items-center justify-center rounded-full">
              <ArrowLeft size={20} className="text-white" />
            </Link>
            <h1 className="font-display text-xl font-semibold text-white">#{tag}</h1>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" />
        </div>
        <BottomNav />
      </main>
    );
  }

  return (
    <main className="flex h-full w-full flex-col bg-midnight">
      <header className="flex-shrink-0 px-4 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center gap-3">
          <Link href="/temukan" className="glass flex h-10 w-10 items-center justify-center rounded-full">
            <ArrowLeft size={20} className="text-white" />
          </Link>
          <h1 className="font-display text-xl font-semibold text-white">#{tag}</h1>
        </div>
        <p className="mt-1 text-sm text-glass-fg-dim">
          {videos.length} video
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-24">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {videos.map((video) => (
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
          {videos.length === 0 && (
            <p className="col-span-full py-12 text-center text-sm text-glass-fg-dim">
              Belum ada video dengan tagar ini.
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}