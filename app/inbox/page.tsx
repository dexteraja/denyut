"use client";

import { Heart, UserPlus, MessageCircle, AtSign } from "lucide-react";
import { BottomNav } from "@/components/bottom-nav";
import clsx from "clsx";

type Notification = {
  id: string;
  kind: "like" | "follow" | "comment" | "mention";
  username: string;
  avatarUrl: string;
  text: string;
  time: string;
  unread: boolean;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    kind: "like",
    username: "kucing.gemoy",
    avatarUrl: "https://i.pravatar.cc/150?img=47",
    text: "menyukai video Anda",
    time: "2m",
    unread: true,
  },
  {
    id: "n2",
    kind: "follow",
    username: "sarahtraveling",
    avatarUrl: "https://i.pravatar.cc/150?img=25",
    text: "mulai mengikuti Anda",
    time: "18m",
    unread: true,
  },
  {
    id: "n3",
    kind: "comment",
    username: "bang_reza",
    avatarUrl: "https://i.pravatar.cc/150?img=12",
    text: "mengomentari: “settingannya cakep bang 🔥”",
    time: "1j",
    unread: true,
  },
  {
    id: "n4",
    kind: "like",
    username: "dapurmama",
    avatarUrl: "https://i.pravatar.cc/150?img=32",
    text: "menyukai video Anda",
    time: "3j",
    unread: false,
  },
  {
    id: "n5",
    kind: "mention",
    username: "komedi.receh",
    avatarUrl: "https://i.pravatar.cc/150?img=8",
    text: "menandai Anda dalam komentar",
    time: "5j",
    unread: false,
  },
  {
    id: "n6",
    kind: "follow",
    username: "gamer_senja",
    avatarUrl: "https://i.pravatar.cc/150?img=51",
    text: "mulai mengikuti Anda",
    time: "1h",
    unread: false,
  },
];

const KIND_ICON = {
  like: Heart,
  follow: UserPlus,
  comment: MessageCircle,
  mention: AtSign,
} as const;

export default function InboxPage() {
  return (
    <main className="flex h-full w-full flex-col bg-midnight">
      <header className="flex-shrink-0 px-4 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-xl font-semibold text-white">
          Kotak Masuk
        </h1>
        <p className="mt-1 text-sm text-glass-fg-dim">
          Aktivitas terbaru seputar akun Anda (data demo).
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-28">
        <div className="flex flex-col gap-2">
          {NOTIFICATIONS.map((n) => {
            const Icon = KIND_ICON[n.kind];
            return (
              <div
                key={n.id}
                className={clsx(
                  "glass flex items-center gap-3 rounded-2xl p-3",
                  !n.unread && "opacity-70"
                )}
              >
                <span className="relative flex-shrink-0">
                  <img
                    src={n.avatarUrl}
                    alt={n.username}
                    className="h-11 w-11 rounded-full object-cover"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-violet to-coral">
                    <Icon size={11} className="text-white" />
                  </span>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-white">
                    <span className="font-semibold">@{n.username}</span>{" "}
                    <span className="text-white/80">{n.text}</span>
                  </p>
                  <p className="mt-0.5 text-xs text-glass-fg-dim">{n.time}</p>
                </div>
                {n.unread && (
                  <span className="h-2 w-2 flex-shrink-0 rounded-full bg-coral" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
