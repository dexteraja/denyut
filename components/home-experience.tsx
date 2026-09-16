"use client";

import { useEffect, useState } from "react";
import { useAppStore } from "@/store/use-app-store";
import { VideoFeed } from "./video-feed";
import { buildFeed } from "@/lib/feed-algorithm";
import { BottomNav } from "./bottom-nav";

export function HomeExperience() {
  const { hasOnboarded, selectedInterests, topicWeights, completeOnboarding } = useAppStore();
  const [mounted, setMounted] = useState(false);
  const [feedSeed] = useState(() => Date.now());

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasOnboarded) {
      completeOnboarding(["hewan-peliharaan", "komedi", "kuliner"]);
    }
  }, [mounted, hasOnboarded, completeOnboarding]);

  if (!mounted) {
    return <div className="h-full w-full bg-midnight" />;
  }

  if (!hasOnboarded) {
    return <div className="h-full w-full bg-midnight flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-2 border-violet-500 border-t-transparent" /></div>;
  }

  const feed = buildFeed(selectedInterests, topicWeights, feedSeed);

  return (
    <div className="relative h-full w-full">
      <VideoFeed initialVideos={feed} />
      <BottomNav />
    </div>
  );
}