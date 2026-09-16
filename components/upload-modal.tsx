"use client";

import { useRef, useState } from "react";
import { X, UploadCloud, Clapperboard, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { INTERESTS } from "@/lib/mock-data";
import { useAppStore } from "@/store/use-app-store";
import type { Video } from "@/lib/types";

const SAMPLE_SOURCES = [
  "https://assets.mixkit.co/videos/preview/mixkit-woman-walking-in-the-forest-31848-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-the-rain-31956-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-jumping-in-the-air-at-sunset-31856-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-enjoying-the-sunset-at-the-beach-31952-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-person-walking-in-the-forest-slow-motion-31847-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-the-street-31957-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-surfing-on-a-wave-31870-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-at-sunrise-31862-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-couple-walking-on-the-beach-at-sunset-31949-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-running-in-the-mountains-31855-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-in-a-park-31943-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-person-drinking-coffee-in-a-cafe-31941-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-playing-guitar-on-the-street-31937-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-taking-photos-with-phone-31935-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-laughing-together-31930-large.mp4",
];

const GRADIENTS = [
  "from-violet-600 via-fuchsia-600 to-rose-500",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-amber-400 via-orange-500 to-rose-600",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-pink-500 via-rose-600 to-red-600",
  "from-lime-400 via-emerald-500 to-teal-600",
];

type Stage = "pick" | "compose" | "compressing" | "done";

type Props = {
  onClose: () => void;
  onVideoUploaded?: () => void;
};

export function UploadModal({ onClose, onVideoUploaded }: Props) {
  const { addUserVideo } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("pick");
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [demoNotice, setDemoNotice] = useState(false);

  function extractHashtags(text: string): string[] {
    const matches = text.match(/#(\w+)/g);
    return matches ? matches.map((m) => m.slice(1)) : [];
  }

  function toggleTopic(slug: string) {
    setSelectedTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handlePublish() {
    const hashtags = extractHashtags(caption);
    const allTopics = [...new Set([...selectedTopics, ...hashtags])];

    setStage("compressing");

    setTimeout(() => {
      const newVideo: Video = {
        id: `user-${Date.now()}`,
        caption,
        hashtags,
        interestSlugs: allTopics,
        playbackUrl: SAMPLE_SOURCES[Math.floor(Math.random() * SAMPLE_SOURCES.length)],
        thumbnailUrl: "",
        posterColor: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        durationSec: Math.floor(15 + Math.random() * 60),
        author: {
          id: "current-user",
          username: "kamu",
          name: "Kamu",
          avatarUrl: "https://i.pravatar.cc/150?img=68",
          followerCount: 0,
        },
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        bookmarkCount: 0,
        viralScore: 0,
        createdAt: new Date().toISOString(),
        isViralPick: false,
      };

      addUserVideo(newVideo);
      setStage("done");

      setTimeout(() => {
        onClose();
        onVideoUploaded?.();
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      }, 1500);
    }, 2200);
  }

  if (stage === "pick") {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <button
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          aria-label="Tutup unggah"
          onClick={onClose}
        />
        <div className="glass-strong animate-slide-up relative flex w-full max-w-md flex-col rounded-t-3xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-3xl">
          <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/25 sm:hidden" />
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-display text-base font-semibold text-white">
              Buat video baru
            </h2>
            <button
              onClick={onClose}
              aria-label="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-full text-glass-fg-dim hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-3">
            <button
              onClick={() => inputRef.current?.click()}
              className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-coral">
                <UploadCloud size={20} className="text-white" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-white">
                  Unggah dari perangkat
                </span>
                <span className="block text-xs text-glass-fg-dim">
                  MP4 / MOV — maks 3 menit, 100MB
                </span>
              </span>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setFileName(file.name);
                  setPreviewUrl(URL.createObjectURL(file));
                  setStage("compose");
                }
              }}
            />

            <button
              onClick={() => setDemoNotice(true)}
              className="glass flex items-center gap-3 rounded-2xl p-4 text-left transition-transform active:scale-[0.98]"
            >
              <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                <Clapperboard size={20} className="text-white" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-white">
                  Rekam langsung
                </span>
                <span className="block text-xs text-glass-fg-dim">
                  Kamera dalam aplikasi (segera hadir)
                </span>
              </span>
            </button>

            {demoNotice && (
              <p className="rounded-xl bg-violet/15 px-4 py-2.5 text-center text-xs text-violet-soft">
                Mode rekam langsung belum tersedia di fase demo.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (stage === "compose" && previewUrl) {
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
        <button
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          aria-label="Tutup unggah"
          onClick={() => {
            setStage("pick");
            setPreviewUrl(null);
            setCaption("");
            setSelectedTopics([]);
          }}
        />
        <div className="glass-strong animate-slide-up relative flex w-full max-w-md flex-col rounded-t-3xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-3xl">
          <span className="mx-auto mb-3 block h-1 w-10 rounded-full bg-white/25 sm:hidden" />
          <div className="flex items-center justify-between pb-2">
            <h2 className="font-display text-base font-semibold text-white">
              Buat video baru
            </h2>
            <button
              onClick={() => {
                setStage("pick");
                setPreviewUrl(null);
                setCaption("");
                setSelectedTopics([]);
              }}
              aria-label="Tutup"
              className="flex h-8 w-8 items-center justify-center rounded-full text-glass-fg-dim hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-2 flex flex-col gap-5 pt-2">
            <div className="flex gap-3">
              <div className="relative aspect-[9/16] w-28 flex-shrink-0 overflow-hidden rounded-xl bg-midnight-soft">
                <video src={previewUrl} className="h-full w-full object-cover" muted />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-xs text-glass-fg-dim">{fileName}</p>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tulis keterangan yang menarik... #hashtag akan otomatis terdeteksi"
                  rows={4}
                  className="glass w-full resize-none rounded-2xl px-3.5 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
                />
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-white">Kategori (pilih yang relevan)</p>
              <div className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => {
                  const active = selectedTopics.includes(interest.slug);
                  return (
                    <button
                      key={interest.slug}
                      onClick={() => toggleTopic(interest.slug)}
                      className={clsx(
                        "flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium",
                        active
                          ? "border-violet bg-violet/20 text-white"
                          : "border-white/15 bg-white/5 text-glass-fg-dim"
                      )}
                    >
                      <span>{interest.emoji}</span>
                      {interest.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setStage("pick");
                  setPreviewUrl(null);
                  setCaption("");
                  setSelectedTopics([]);
                }}
                className="flex-1 rounded-full border border-white/15 py-3 text-center text-sm font-medium text-glass-fg-dim"
              >
                Batal
              </button>
              <button
                onClick={handlePublish}
                disabled={!caption.trim()}
                className="flex-[2] rounded-full bg-gradient-to-r from-violet to-coral py-3 text-center font-display text-sm font-semibold text-white disabled:opacity-30"
              >
                Posting
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "compressing") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <button
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          aria-label="Tutup"
        />
        <div className="glass-strong animate-slide-up relative flex w-full max-w-md flex-col rounded-t-3xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-3xl">
          <div className="flex flex-col items-center justify-center gap-4 pt-10 pb-10 text-center">
            <Loader2 size={32} className="animate-spin text-violet-soft" />
            <div>
              <p className="font-display text-sm font-semibold text-white">
                Mengompresi & mengoptimalkan video...
              </p>
              <p className="mt-1 text-xs text-glass-fg-dim">
                Video sedang diproses ke format ramah web (H.264/HLS)
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === "done") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <button
          className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
          aria-label="Tutup"
        />
        <div className="glass-strong animate-slide-up relative flex w-full max-w-md flex-col rounded-t-3xl px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 sm:rounded-3xl">
          <div className="flex flex-col items-center justify-center gap-4 pt-10 pb-10 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/15 border border-lime/40">
              <Check size={28} className="text-lime" />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-white">
                Video berhasil diposting!
              </p>
              <p className="mt-1 text-xs text-glass-fg-dim">
                Video muncul di posisi pertama di For You.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}