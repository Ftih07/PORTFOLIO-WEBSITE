"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 🧠 Cek apakah user sudah login
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      const user = session?.user;

      if (user) {
        const role = user.user_metadata?.role;
        if (role === "admin") {
          // Kalau udah login sebagai admin, langsung ke /admin
          router.push("/admin");
        } else {
          // Kalau login tapi bukan admin, arahkan ke halaman lain (opsional)
          router.push("/");
        }
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { user } = data;
    const role = user?.user_metadata?.role;

    if (role === "admin") {
      router.push("/admin");
    } else {
      alert("You do not have permission to access admin page");
      await supabase.auth.signOut();
      router.push("/login");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-24 text-white"
    >
      <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
      <input
        type="email"
        className="p-2 bg-gray-800 rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="p-2 bg-gray-800 rounded"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-orange-500 p-2 rounded font-bold disabled:opacity-60"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
