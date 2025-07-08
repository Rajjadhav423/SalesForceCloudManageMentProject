"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleRegister} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
        <h1 className="text-xl font-bold text-center">Register</h1>
        <input type="text" placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        <input type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" required />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create Account</button>
        <p className="text-sm text-center">Already have an account? <Link href="/login" className="text-blue-600 underline">Login</Link></p>
      </form>
    </div>
  );
}
