"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, Check, Loader2 } from "lucide-react";
import clsx from "clsx";
import { INTERESTS } from "@/lib/mock-data";
import { BottomNav } from "@/components/bottom-nav";

const MAX_SIZE_MB = 100;
const MAX_DURATION_SEC = 180;

type Stage = "pick" | "compose" | "compressing" | "done";

export default function UploadPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState<Stage>("pick");
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File) {
    setError(null);
    const sizeMb = file.size / (1024 * 1024);
    if (sizeMb > MAX_SIZE_MB) {
      setError(`File terlalu besar (${sizeMb.toFixed(0)}MB). Maksimal ${MAX_SIZE_MB}MB.`);
      return;
    }
    if (!file.type.startsWith("video/")) {
      setError("File harus berupa video.");
      return;
    }
    setFileName(file.name);
    setPreviewUrl(URL.createObjectURL(file));
    setStage("compose");
  }

  function toggleTopic(slug: string) {
    setSelectedTopics((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function handlePublish() {
    setStage("compressing");
    // Simulated backend pipeline: transcode → optimize → distribute.
    // In production this calls a processing service (Mux/MediaConvert/Cloudinary)
    // or a queued worker, then flips VideoStatus PROCESSING -> READY.
    setTimeout(() => setStage("done"), 2200);
  }

  return (
    <main className="flex h-full w-full flex-col bg-midnight">
      <header className="flex-shrink-0 px-4 pb-3 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <h1 className="font-display text-xl font-semibold text-white">Unggah Video</h1>
        <p className="mt-1 text-sm text-glass-fg-dim">
          Maks {MAX_DURATION_SEC / 60} menit &middot; hingga {MAX_SIZE_MB}MB &middot; dikompresi
          otomatis
        </p>
      </header>

      <div className="flex-1 overflow-y-auto px-4 pb-24">
        {stage === "pick" && (
          <button
            onClick={() => inputRef.current?.click()}
            className="glass flex h-64 w-full flex-col items-center justify-center gap-3 rounded-3xl border-dashed"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-violet to-coral">
              <UploadCloud size={26} className="text-white" />
            </span>
            <span className="font-display text-sm font-semibold text-white">
              Pilih video dari perangkatmu
            </span>
            <span className="text-xs text-glass-fg-dim">MP4, MOV — vertikal disarankan</span>
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {error && (
          <p className="mt-3 rounded-xl bg-coral/15 px-4 py-3 text-sm text-coral">{error}</p>
        )}

        {stage === "compose" && previewUrl && (
          <div className="flex flex-col gap-5 pt-2">
            <div className="flex gap-3">
              <div className="relative aspect-[9/16] w-28 flex-shrink-0 overflow-hidden rounded-xl bg-midnight-soft">
                <video src={previewUrl} className="h-full w-full object-cover" muted />
              </div>
              <div className="flex-1">
                <p className="mb-1 text-xs text-glass-fg-dim">{fileName}</p>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Tulis keterangan yang menarik..."
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
                disabled={!caption.trim() || selectedTopics.length === 0}
                className="flex-[2] rounded-full bg-gradient-to-r from-violet to-coral py-3 text-center font-display text-sm font-semibold text-white disabled:opacity-30"
              >
                Unggah
              </button>
            </div>
          </div>
        )}

        {stage === "compressing" && (
          <div className="flex flex-col items-center justify-center gap-4 pt-20 text-center">
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
        )}

        {stage === "done" && (
          <div className="flex flex-col items-center justify-center gap-4 pt-20 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-lime/15 border border-lime/40">
              <Check size={28} className="text-lime" />
            </span>
            <div>
              <p className="font-display text-base font-semibold text-white">
                Video berhasil diunggah!
              </p>
              <p className="mt-1 text-xs text-glass-fg-dim">
                Video akan muncul di feed setelah pemrosesan selesai.
              </p>
            </div>
            <button
              onClick={() => router.push("/")}
              className="mt-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-medium text-white"
            >
              Kembali ke Beranda
            </button>
          </div>
        )}
      </div>

      {stage !== "compressing" && stage !== "done" && <BottomNav />}
    </main>
  );
}
