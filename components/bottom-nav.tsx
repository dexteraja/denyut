"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Compass, Plus, Inbox, User } from "lucide-react";
import clsx from "clsx";
import { UploadModal } from "./upload-modal";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [uploadOpen, setUploadOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const tabClass = (active: boolean) =>
    clsx(
      "flex flex-1 flex-col items-center justify-center gap-0.5 py-2 transition-colors",
      active ? "text-white" : "text-white/50 hover:text-white"
    );

  function handleVideoUploaded() {
    setUploadOpen(false);
    if (pathname !== "/") {
      router.push("/");
    } else {
      window.dispatchEvent(new CustomEvent("scroll-to-top"));
    }
  }

  return (
    <>
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/50 backdrop-blur-md"
        aria-label="Navigasi utama"
      >
        <div className="mx-auto flex max-w-md items-stretch px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <Link href="/" aria-label="Beranda" className={tabClass(isActive("/"))}>
            <Home
              size={22}
              strokeWidth={isActive("/") ? 2.5 : 2}
              fill={isActive("/") ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-medium">Home</span>
          </Link>

          <Link
            href="/temukan"
            aria-label="Temukan"
            className={tabClass(isActive("/temukan"))}
          >
            <Compass
              size={22}
              strokeWidth={isActive("/temukan") ? 2.5 : 2}
              fill={isActive("/temukan") ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-medium">Discover</span>
          </Link>

          <div className="flex flex-1 items-center justify-center">
            <button
              onClick={() => setUploadOpen(true)}
              aria-label="Unggah video"
              className="flex h-11 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet via-fuchsia-500 to-coral text-white shadow-[0_0_20px_rgba(139,92,246,0.55)] transition-transform active:scale-90"
            >
              <Plus size={22} strokeWidth={2.5} />
            </button>
          </div>

          <Link
            href="/inbox"
            aria-label="Kotak masuk"
            className={tabClass(isActive("/inbox"))}
          >
            <span className="relative">
              <Inbox
                size={22}
                strokeWidth={isActive("/inbox") ? 2.5 : 2}
                fill={isActive("/inbox") ? "currentColor" : "none"}
              />
              <span className="absolute -right-1 -top-1 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-coral px-0.5 text-[8px] font-bold text-white">
                3
              </span>
            </span>
            <span className="text-[10px] font-medium">Inbox</span>
          </Link>

          <Link
            href="/profil"
            aria-label="Profil"
            className={tabClass(isActive("/profil"))}
          >
            <User
              size={22}
              strokeWidth={isActive("/profil") ? 2.5 : 2}
              fill={isActive("/profil") ? "currentColor" : "none"}
            />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>

      {uploadOpen && <UploadModal onClose={() => setUploadOpen(false)} onVideoUploaded={handleVideoUploaded} />}
    </>
  );
}