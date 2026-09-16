"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Email atau password salah.");
      return;
    }
    router.push("/");
  }

  return (
    <main className="flex h-full w-full flex-col justify-center bg-midnight px-6">
      <div className="mx-auto w-full max-w-sm">
        <h1 className="font-display text-2xl font-semibold text-white">Masuk</h1>
        <p className="mt-1 text-sm text-glass-fg-dim">
          Lanjutkan menjelajahi video pilihanmu.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="glass rounded-2xl px-4 py-3 text-sm text-white placeholder:text-glass-fg-dim focus:outline-none"
          />
          {error && <p className="text-sm text-coral">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 rounded-full bg-gradient-to-r from-violet to-coral py-3 text-center font-display text-sm font-semibold text-white disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-glass-fg-dim">
          Belum punya akun?{" "}
          <Link href="/daftar" className="font-medium text-violet-soft">
            Daftar
          </Link>
        </p>
        <p className="mt-2 text-center text-xs text-glass-fg-dim">
          Atau{" "}
          <Link href="/" className="font-medium text-violet-soft">
            lanjutkan sebagai tamu
          </Link>{" "}
          untuk mencoba demo.
        </p>
      </div>
    </main>
  );
}
