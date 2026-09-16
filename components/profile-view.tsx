"use client";

import Link from "next/link";
import { Settings, Flame } from "lucide-react";
import type { UserProfile } from "@/lib/types";
import { useAppStore } from "@/store/use-app-store";
import { BottomNav } from "@/components/bottom-nav";

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}rb`;
  return `${n}`;
}

export function ProfileView({
  profile,
  isOwnProfile,
}: {
  profile: UserProfile;
  isOwnProfile: boolean;
}) {
  const { isFollowing, toggleFollow } = useAppStore();
  const following = isFollowing(profile.username);

  return (
    <main className="flex h-full w-full flex-col bg-midnight">
      <header className="flex-shrink-0 px-5 pb-4 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-white">
            @{profile.username}
          </span>
          {isOwnProfile && (
            <button aria-label="Pengaturan" className="text-glass-fg-dim">
              <Settings size={20} />
            </button>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="h-20 w-20 rounded-full object-cover ring-2 ring-white/15"
          />
          <div className="flex-1">
            <p className="font-display text-base font-semibold text-white">{profile.name}</p>
            <div className="mt-1.5 flex gap-4 text-sm">
              <span className="text-white">
                <strong className="font-display">{formatCount(profile.followingCount)}</strong>{" "}
                <span className="text-glass-fg-dim">Mengikuti</span>
              </span>
              <span className="text-white">
                <strong className="font-display">{formatCount(profile.followerCount)}</strong>{" "}
                <span className="text-glass-fg-dim">Pengikut</span>
              </span>
              <span className="text-white">
                <strong className="font-display">{formatCount(profile.likeCount)}</strong>{" "}
                <span className="text-glass-fg-dim">Suka</span>
              </span>
            </div>
          </div>
        </div>

        <p className="mt-3 text-sm text-white/85">{profile.bio}</p>

        {isOwnProfile && (
          <div className="mt-4 flex gap-2.5">
            <button className="flex-1 rounded-full bg-gradient-to-r from-violet to-coral py-2.5 text-center font-display text-sm font-semibold text-white transition-transform active:scale-[0.98]">
              Edit Profile
            </button>
            <button
              aria-label="Bagikan profil"
              className="rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-transform active:scale-[0.98]"
            >
              Bagikan
            </button>
          </div>
        )}

        {!isOwnProfile && (
          <button
            onClick={() => toggleFollow(profile.username)}
            className={
              following
                ? "mt-4 w-full rounded-full bg-white/10 py-2.5 text-sm font-medium text-white"
                : "mt-4 w-full rounded-full bg-gradient-to-r from-violet to-coral py-2.5 text-center font-display text-sm font-semibold text-white"
            }
          >
            {following ? "Mengikuti" : "Ikuti"}
          </button>
        )}
      </header>

      <div className="flex-1 overflow-y-auto px-3 pb-24">
        <div className="grid grid-cols-3 gap-1.5">
          {profile.videos.map((video) => (
            <Link
              key={video.id}
              href="/"
              className={`group relative aspect-[9/16] overflow-hidden rounded-lg bg-gradient-to-br ${video.posterColor}`}
            >
              <div className="absolute inset-x-0 bottom-0 flex items-center gap-1 p-1.5 text-[10px] font-medium text-white">
                <Flame size={10} className="text-lime" />
                {formatCount(video.viewCount)}
              </div>
            </Link>
          ))}
          {profile.videos.length === 0 && (
            <p className="col-span-3 py-16 text-center text-sm text-glass-fg-dim">
              Belum ada video yang diunggah.
            </p>
          )}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
