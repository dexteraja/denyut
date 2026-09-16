"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import clsx from "clsx";
import { INTERESTS } from "@/lib/mock-data";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [interests, setInterests] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function toggleInterest(slug: string) {
    setInterests((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, interestSlugs: interests }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan.");
      setLoading(false);
      return;
    }

    const signInRes = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });
    setLoading(false);

    if (signInRes?.error) {
      router.push("/masuk");
      return;
    }
    router.push("/");
  }

  return (
    <main className="flex h-full w-full flex-col overflow-y-auto bg-midnight px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-white">Buat Akun</h1>
        <p className="mt-1 text-sm text-glass-fg-dim">Mulai jadi kreator hari ini.</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama lengkap"
            className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />
          <input
            required
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            placeholder="Username"
            className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email"
            className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="Password (min. 8 karakter)"
            className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />

          <div>
            <p className="mb-2 mt-1 text-sm font-medium text-white">Minat awal</p>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const active = interests.includes(interest.slug);
                return (
                  <button
                    type="button"
                    key={interest.slug}
                    onClick={() => toggleInterest(interest.slug)}
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

          {error && <p className="text-sm text-coral">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gradient-to-r from-violet to-coral py-3 text-center font-display text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Daftar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-glass-fg-dim">
          Sudah punya akun?{" "}
          <Link href="/masuk" className="font-medium text-violet-soft">
            Masuk
          </Link>
        </p>
      </div>
    </main>
  );
}
