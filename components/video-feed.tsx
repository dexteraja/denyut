"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import type { Video } from "@/lib/types";
import { VideoPlayer } from "./video-player";
import { VideoCaption } from "./video-caption";
import { useAppStore } from "@/store/use-app-store";

const PAGE_SIZE = 6;

export function VideoFeed({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { registerWatchComplete, toggleLike, isLiked, userVideos } = useAppStore();

  const allVideos = useMemo(() => [...userVideos, ...videos], [userVideos, videos]);

  const feedKey = userVideos.length;

  const loadMore = useCallback(() => {
    setVideos((prev) => {
      const next = initialVideos.map((v, i) => ({
        ...v,
        id: `${v.id}-r${prev.length}-${i}`,
      }));
      return [...prev, ...next.slice(0, PAGE_SIZE)];
    });
  }, [initialVideos]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActiveIndex(idx);
            if (idx >= allVideos.length - 2) {
              loadMore();
            }
          }
        }
      },
      { root: container, threshold: 0.6 }
    );

    slideRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [allVideos.length, loadMore]);

  useEffect(() => {
    function handleScrollToTop() {
      setActiveIndex(0);
      containerRef.current?.scrollTo({ top: 0 });
    }
    window.addEventListener("scroll-to-top", handleScrollToTop);
    return () => window.removeEventListener("scroll-to-top", handleScrollToTop);
  }, []);

  function handleMuteChange(videoId: string, muted: boolean) {
    setMutedStates((prev) => ({ ...prev, [videoId]: muted }));
  }

  function handleDoubleTapLike(video: Video) {
    if (!isLiked(video.id)) {
      toggleLike(video.id, video.interestSlugs);
    }
  }

  return (
    <div className="relative h-full w-full">
      <div
        key={feedKey}
        ref={containerRef}
        className="snap-feed h-full w-full"
        role="feed"
        aria-label="Feed video"
      >
        {allVideos.map((video, i) => {
          const isActive = i === activeIndex;
          const videoMuted = mutedStates[video.id] ?? true;
          return (
            <div
              key={video.id}
              data-index={i}
              ref={(el) => {
                slideRefs.current[i] = el;
              }}
              className="snap-slide relative h-full w-full flex-shrink-0"
            >
              <VideoPlayer
                video={video}
                isActive={isActive}
                onWatchComplete={() => registerWatchComplete(video.interestSlugs)}
                onDoubleTapLike={() => handleDoubleTapLike(video)}
                onMuteChange={(muted) => handleMuteChange(video.id, muted)}
                initialMuted={videoMuted}
              />
              <VideoCaption video={video} />
            </div>
          );
        })}

        {allVideos.length === 0 && (
          <div className="snap-slide flex h-full w-full flex-col items-center justify-center gap-3 bg-midnight px-8 text-center">
            <p className="font-display text-lg font-semibold text-white">
              Belum ada video
            </p>
            <p className="text-sm text-glass-fg-dim">
              Unggah video pertama kamu untuk memulai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}