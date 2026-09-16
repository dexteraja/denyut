"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { applyInteractionWeight, type TopicWeights } from "@/lib/feed-algorithm";
import type { Video } from "@/lib/types";

type InteractionKind = "like" | "comment" | "watch_complete" | "bookmark";

type AppState = {
  hasOnboarded: boolean;
  selectedInterests: string[];
  topicWeights: TopicWeights;
  likedVideoIds: string[];
  bookmarkedVideoIds: string[];
  followingUsernames: string[];
  userVideos: Video[];

  completeOnboarding: (interests: string[]) => void;
  toggleLike: (videoId: string, interestSlugs: string[]) => void;
  toggleBookmark: (videoId: string, interestSlugs: string[]) => void;
  toggleFollow: (username: string) => void;
  registerWatchComplete: (interestSlugs: string[]) => void;
  registerComment: (interestSlugs: string[]) => void;
  isLiked: (videoId: string) => boolean;
  isBookmarked: (videoId: string) => boolean;
  isFollowing: (username: string) => boolean;
  addUserVideo: (video: Video) => void;
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      hasOnboarded: false,
      selectedInterests: [],
      topicWeights: {},
      likedVideoIds: [],
      bookmarkedVideoIds: [],
      followingUsernames: [],
      userVideos: [],

      completeOnboarding: (interests) =>
        set({ hasOnboarded: true, selectedInterests: interests }),

      toggleLike: (videoId, interestSlugs) =>
        set((state) => {
          const isLiked = state.likedVideoIds.includes(videoId);
          const likedVideoIds = isLiked
            ? state.likedVideoIds.filter((id) => id !== videoId)
            : [...state.likedVideoIds, videoId];
          const topicWeights = isLiked
            ? state.topicWeights
            : applyInteractionWeight(state.topicWeights, interestSlugs, "like");
          return { likedVideoIds, topicWeights };
        }),

      toggleBookmark: (videoId, interestSlugs) =>
        set((state) => {
          const isBookmarked = state.bookmarkedVideoIds.includes(videoId);
          const bookmarkedVideoIds = isBookmarked
            ? state.bookmarkedVideoIds.filter((id) => id !== videoId)
            : [...state.bookmarkedVideoIds, videoId];
          const topicWeights = isBookmarked
            ? state.topicWeights
            : applyInteractionWeight(state.topicWeights, interestSlugs, "bookmark");
          return { bookmarkedVideoIds, topicWeights };
        }),

      toggleFollow: (username) =>
        set((state) => ({
          followingUsernames: state.followingUsernames.includes(username)
            ? state.followingUsernames.filter((u) => u !== username)
            : [...state.followingUsernames, username],
        })),

      registerWatchComplete: (interestSlugs) =>
        set((state) => ({
          topicWeights: applyInteractionWeight(state.topicWeights, interestSlugs, "watch_complete"),
        })),

      registerComment: (interestSlugs) =>
        set((state) => ({
          topicWeights: applyInteractionWeight(state.topicWeights, interestSlugs, "comment"),
        })),

      addUserVideo: (video) =>
        set((state) => ({
          userVideos: [video, ...state.userVideos],
        })),

      isLiked: (videoId) => get().likedVideoIds.includes(videoId),
      isBookmarked: (videoId) => get().bookmarkedVideoIds.includes(videoId),
      isFollowing: (username) => get().followingUsernames.includes(username),
    }),
    { name: "shortvid-app-state" }
  )
);

export type { InteractionKind };
