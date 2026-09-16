export type Interest = {
  slug: string;
  label: string;
  emoji: string;
};

export type VideoAuthor = {
  id: string;
  username: string;
  name: string;
  avatarUrl: string;
  followerCount: number;
  isFollowing?: boolean;
};

export type Video = {
  id: string;
  caption: string;
  hashtags: string[];
  interestSlugs: string[];
  playbackUrl: string;
  thumbnailUrl: string;
  posterColor: string; // fallback gradient seed for thumbnails without real art
  durationSec: number;
  author: VideoAuthor;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  bookmarkCount: number;
  viralScore: number;
  createdAt: string;
  isViralPick?: boolean;
};

export type Comment = {
  id: string;
  videoId: string;
  author: Pick<VideoAuthor, "username" | "avatarUrl" | "name">;
  text: string;
  createdAt: string;
  likeCount: number;
};

export type UserProfile = {
  id: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  followerCount: number;
  followingCount: number;
  likeCount: number;
  videos: Video[];
};
