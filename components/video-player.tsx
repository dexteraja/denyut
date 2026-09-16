"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play, Heart } from "lucide-react";
import clsx from "clsx";
import type { Video } from "@/lib/types";

type Props = {
  video: Video;
  isActive: boolean;
  onWatchComplete?: () => void;
  onDoubleTapLike?: () => void;
  onMuteChange?: (muted: boolean) => void;
  onPausedChange?: (paused: boolean) => void;
  initialMuted?: boolean;
};

const DOUBLE_TAP_DELAY = 300;

export function VideoPlayer({
  video,
  isActive,
  onWatchComplete,
  onDoubleTapLike,
  onMuteChange,
  onPausedChange,
  initialMuted = true,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [needsTapForSound, setNeedsTapForSound] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isPaused, setIsPaused] = useState(false);
  const [showHeartBurst, setShowHeartBurst] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState<number | null>(null);
  const hasFiredComplete = useRef(false);
  const lastTapTime = useRef(0);
  const progressBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (!isActive) {
      el.pause();
      el.currentTime = 0;
      hasFiredComplete.current = false;
      return;
    }

    let cancelled = false;

    async function tryPlayWithSound() {
      if (!el) return;
      try {
        el.muted = false;
        await el.play();
        if (!cancelled) {
          setIsMuted(false);
          setNeedsTapForSound(false);
          onMuteChange?.(false);
        }
      } catch {
        if (!el) return;
        el.muted = true;
        try {
          await el.play();
        } catch {
        }
        if (!cancelled) {
          setIsMuted(true);
          setNeedsTapForSound(true);
          onMuteChange?.(true);
        }
      }
    }

    tryPlayWithSound();
    return () => {
      cancelled = true;
    };
  }, [isActive, video.id, onMuteChange]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handleLoadedMetadata = () => {
      if (el.videoWidth && el.videoHeight) {
        setVideoAspectRatio(el.videoWidth / el.videoHeight);
      }
    };
    el.addEventListener("loadedmetadata", handleLoadedMetadata);
    return () => el.removeEventListener("loadedmetadata", handleLoadedMetadata);
  }, []);

  function handleTap() {
    const el = videoRef.current;
    if (!el) return;

    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;
    lastTapTime.current = now;

    if (timeSinceLastTap < DOUBLE_TAP_DELAY && onDoubleTapLike) {
      onDoubleTapLike();
      setShowHeartBurst(true);
      setTimeout(() => setShowHeartBurst(false), 1000);
      return;
    }

    if (needsTapForSound) {
      el.muted = false;
      setIsMuted(false);
      setNeedsTapForSound(false);
      onMuteChange?.(false);
      el.play().catch(() => {});
      return;
    }

    if (el.paused) {
      el.play().catch(() => {});
      setIsPaused(false);
      onPausedChange?.(false);
    } else {
      el.pause();
      setIsPaused(true);
      onPausedChange?.(true);
    }
  }

  function toggleMute(e: React.MouseEvent) {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setIsMuted(el.muted);
    setNeedsTapForSound(false);
    onMuteChange?.(el.muted);
  }

  function handleTimeUpdate() {
    const el = videoRef.current;
    if (!el) return;
    // Update progress bar via ref — zero re-renders
    if (progressBarRef.current && el.duration) {
      const pct = (el.currentTime / el.duration) * 100;
      progressBarRef.current.style.width = `${pct}%`;
    }
    if (!hasFiredComplete.current && el.duration && el.currentTime / el.duration > 0.7) {
      hasFiredComplete.current = true;
      onWatchComplete?.();
    }
  }

  const isVertical = videoAspectRatio !== null && videoAspectRatio < 1;
  const videoStyle: React.CSSProperties = {
    height: "100%",
    width: "100%",
    objectFit: isVertical ? "cover" : "contain",
  };

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-midnight"
      onClick={handleTap}
    >
      <div
        className={clsx(
          "absolute inset-0 bg-gradient-to-br opacity-90",
          video.posterColor
        )}
        aria-hidden
      />

      <video
        ref={videoRef}
        src={video.playbackUrl}
        loop
        playsInline
        muted={isMuted}
        preload={isActive ? "auto" : "metadata"}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => {}}
        className="relative z-10"
        style={videoStyle}
      />

      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {showHeartBurst && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center animate-heart-pop">
          <Heart size={80} className="fill-coral text-coral drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
        </div>
      )}

      {isPaused && !needsTapForSound && !showHeartBurst && (
        <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
          <div className="glass flex h-16 w-16 items-center justify-center rounded-full">
            <Play size={28} className="ml-1 fill-white text-white" />
          </div>
        </div>
      )}

      {needsTapForSound && (
        <button
          onClick={toggleMute}
          className="glass absolute left-1/2 top-6 z-30 -translate-x-1/2 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white"
        >
          <VolumeX size={16} />
          Ketuk untuk aktifkan suara
        </button>
      )}

      {!needsTapForSound && isActive && (
        <button
          onClick={toggleMute}
          aria-label={isMuted ? "Aktifkan suara" : "Matikan suara"}
          className="glass absolute right-4 top-[max(1.25rem,env(safe-area-inset-top))] z-30 flex h-9 w-9 items-center justify-center rounded-full text-white"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      )}

      {/* Progress bar — driven by ref, no re-renders */}
      {isActive && (
        <div className="absolute inset-x-0 bottom-0 z-30 h-[2px] bg-white/20">
          <div
            ref={progressBarRef}
            className="progress-bar-gradient h-full transition-none"
            style={{ width: "0%" }}
          />
        </div>
      )}
    </div>
  );
}