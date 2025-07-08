// "use client";

// import { useState } from "react";
// import { useRouter } from 'next/navigation';
// import Link from "next/link";

// export default function RegisterPage() {
//   const router = useRouter();
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     const res = await fetch("/api/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ name, email, password }),
//     });

//     const data = await res.json();
//     if (!res.ok) {
//       setError(data.message);
//     } else {
//       router.push("/login");
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-background">
//       <form onSubmit={handleRegister} className="space-y-4 bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h1 className="text-xl font-bold text-center">Register</h1>
//         <input type="text" placeholder="Name" value={name}
//           onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
//         <input type="email" placeholder="Email" value={email}
//           onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" required />
//         <input type="password" placeholder="Password" value={password}
//           onChange={(e) => setPassword(e.target.value)} className="w-full border px-3 py-2 rounded" required />
//         {error && <p className="text-red-500 text-sm">{error}</p>}
//         <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">Create Account</button>
//         <p className="text-sm text-center">Already have an account? <Link href="/login" className="text-blue-600 underline">Login</Link></p>
//       </form>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  EyeTwoTone,
  EyeInvisibleOutlined,
} from "@ant-design/icons";
import ThemeToggle from '../../components/ThemeToggle'
export default function RegisterComponent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Registration failed.");
      } else {
        router.push("/login");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br px-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-lg p-8">
        <ThemeToggle/>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign up to get started
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-300 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Full Name
            </label>
            <div className="relative">
              <UserOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="name"
                required
                placeholder="Enter your full name"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email Address
            </label>
            <div className="relative">
              <MailOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Password
            </label>
            <div className="relative">
              <LockOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Create a password"
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <LockOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirm your password"
                className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Link to Login */}
        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
