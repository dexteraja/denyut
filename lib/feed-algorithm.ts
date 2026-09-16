import { VIDEOS, getViralVideos } from "./mock-data";
import type { Video } from "./types";

export type TopicWeights = Record<string, number>;

const DISCOVERY_RATIO = 0.22; // ~1 in 5 slots reserved for global viral discovery

/**
 * Mulberry32 PRNG — deterministic per session seed so a feed reload during
 * the same session doesn't feel completely different, while still varying
 * across sessions/users.
 */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Weighted score for a video given the viewer's topic-affinity weights.
 * Combines: personal topic weight, base engagement, and a recency nudge.
 */
function scoreVideo(video: Video, weights: TopicWeights, rand: () => number): number {
  const topicScore = video.interestSlugs.reduce((sum, slug) => sum + (weights[slug] ?? 0), 0);
  const engagementScore = Math.log10(video.viewCount + 10) * 0.6;
  const ageHours = (Date.now() - new Date(video.createdAt).getTime()) / 3_600_000;
  const recencyBoost = Math.max(0, 1 - ageHours / 240) * 0.8; // fades over ~10 days
  const jitter = rand() * 1.5; // keeps ordering from being strictly deterministic
  return topicScore * 2 + engagementScore + recencyBoost + jitter;
}

/**
 * Builds a personalized For-You feed.
 *
 * - selectedInterests: topics chosen at onboarding (always given some base weight)
 * - topicWeights: behavioral weights accumulated from likes/watch-time
 * - seed: varies the shuffle across requests while staying stable within one
 */
export function buildFeed(
  selectedInterests: string[],
  topicWeights: TopicWeights,
  seed: number = Date.now()
): Video[] {
  const rand = mulberry32(seed);

  // Onboarding picks get a modest base weight so cold-start users still see
  // relevant content before behavioral signal accumulates.
  const effectiveWeights: TopicWeights = { ...topicWeights };
  for (const slug of selectedInterests) {
    effectiveWeights[slug] = (effectiveWeights[slug] ?? 0) + 3;
  }

  const discoveryCount = Math.max(2, Math.round(VIDEOS.length * DISCOVERY_RATIO));
  const viralPool = getViralVideos(discoveryCount * 2);
  const viralIds = new Set(viralPool.map((v) => v.id));

  const personalizedPool = VIDEOS.filter((v) => !viralIds.has(v.id))
    .map((v) => ({ v, score: scoreVideo(v, effectiveWeights, rand) }))
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.v);

  // Interleave: mostly personalized, with a viral/discovery pick dropped in
  // every few slots rather than clustered at the end.
  const result: Video[] = [];
  let pIdx = 0;
  let vIdx = 0;
  const interval = Math.max(3, Math.round(1 / DISCOVERY_RATIO));

  while (pIdx < personalizedPool.length || vIdx < viralPool.length) {
    const slot = result.length;
    const dueForDiscovery = slot > 0 && slot % interval === 0 && vIdx < viralPool.length;
    if (dueForDiscovery) {
      result.push({ ...viralPool[vIdx], isViralPick: true });
      vIdx += 1;
    } else if (pIdx < personalizedPool.length) {
      result.push(personalizedPool[pIdx]);
      pIdx += 1;
    } else if (vIdx < viralPool.length) {
      result.push({ ...viralPool[vIdx], isViralPick: true });
      vIdx += 1;
    }
  }

  return result;
}

/** Increment a user's topic weights in response to a positive interaction. */
export function applyInteractionWeight(
  weights: TopicWeights,
  interestSlugs: string[],
  kind: "like" | "comment" | "watch_complete" | "bookmark"
): TopicWeights {
  const delta = { like: 1.2, comment: 1.6, bookmark: 1.8, watch_complete: 0.4 }[kind];
  const next = { ...weights };
  for (const slug of interestSlugs) {
    next[slug] = (next[slug] ?? 0) + delta;
  }
  return next;
}
