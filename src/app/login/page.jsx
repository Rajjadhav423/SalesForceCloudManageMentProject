// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import Link from "next/link";
// import { Button } from "../../components/ui/button";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardFooter,
//     CardHeader,
//     CardTitle,
// } from "../../components/ui/card";
// import ThemeToggle from '../../components/ThemeToggle'

// export default function LoginPage() {
//     const [loading, setLoading] = useState(false);

//     const handleGoogleSignIn = async () => {
//         setLoading(true);
//         try {
//             await signIn("google", { callbackUrl: "/home" });
//         } catch (error) {
//             console.error("Sign in error:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <MainContent loading={loading} onGoogleSignIn={handleGoogleSignIn} />
//         </>
//     );
// }

// function Header() {
//     return (
//         <div className="fixed top-4 right-4 z-50">
//             <ThemeToggle />
//         </div>
//     );
// }

// function MainContent({ loading, onGoogleSignIn }) {
//     return (
//         <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background transition-colors">
//             <div className="w-full max-w-md">
//                 <LoginCard loading={loading} onGoogleSignIn={onGoogleSignIn} />
//                 <Footer />
//             </div>
//         </div>
//     );
// }

// function LoginCard({ loading, onGoogleSignIn }) {
//     return (
//         <Card className="border-2">
//             <CardHeader className="space-y-1">
//                 <CardTitle className="text-2xl text-center">Sign in</CardTitle>
//                 <CardDescription className="text-center">
//                     Enter your credentials to access your account
//                 </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//                 <Button
//                     variant="outline"
//                     onClick={onGoogleSignIn}
//                     disabled={loading}
//                     className="w-full"
//                 >
//                     <GoogleIcon />
//                     Sign in with Google
//                 </Button>
//             </CardContent>
//             <CardFooter className="flex flex-col space-y-4 pt-0">
//                 <div className="text-center text-sm">
//                     Don&apos;t have an account?{" "}
//                     <Link href="/register" className="text-primary hover:underline">
//                         Create an account
//                     </Link>
//                 </div>
//             </CardFooter>
//         </Card>
//     );
// }

// function Footer() {
//     return (
//         <div className="mt-8 text-center text-sm text-muted-foreground">
//             <p>Cloud Manager &copy; {new Date().getFullYear()}</p>
//         </div>
//     );
// }

// function GoogleIcon() {
//     return (
//         <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
//             <path
//                 d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
//                 fill="currentColor"
//             />
//         </svg>
//     );
// }

// "use client";

// import { useState } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from 'next/navigation';
// import Link from "next/link";

// export default function LoginPage() {
// const router = useRouter();

//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

//   // Google OAuth Sign-in
//   const handleGoogleSignIn = async () => {
//     setLoading(true);
//     try {
//       await signIn("google", { callbackUrl: "/home" });
//     } catch (err) {
//       setError("Google sign-in failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Custom Credentials Sign-in
//   const handleCustomLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     const res = await signIn("credentials", {
//       redirect: false,
//       email,
//       password,
//       callbackUrl: "/home",
//     });

//     if (res?.error) {
//       setError(res.error);
//     } else {
//       router.push("/home");
//     }

//     setLoading(false);
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md bg-white p-6 rounded shadow-md space-y-6">
//         <h1 className="text-2xl font-bold text-center">Sign In</h1>

//         {/* Error Message */}
//         {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//         {/* Email/Password Form */}
//         <form onSubmit={handleCustomLogin} className="space-y-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             className="w-full border px-3 py-2 rounded"
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             className="w-full border px-3 py-2 rounded"
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         {/* OR Divider */}
//         <div className="flex items-center justify-center">
//           <div className="border-t border-gray-300 w-full"></div>
//           <span className="px-2 text-gray-500 text-sm">OR</span>
//           <div className="border-t border-gray-300 w-full"></div>
//         </div>

//         {/* Google Button */}
//         <button
//           onClick={handleGoogleSignIn}
//           disabled={loading}
//           className="w-full border py-2 rounded flex items-center justify-center hover:bg-gray-100"
//         >
//           <GoogleIcon />
//           Sign in with Google
//         </button>

//         {/* Link to Register */}
//         <p className="text-center text-sm">
//           Don&apos;t have an account?{" "}
//           <Link href="/register" className="text-blue-600 underline">
//             Register here
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// function GoogleIcon() {
//   return (
//     <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
//       <path
//         d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972
//           c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032
//           c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,
//           15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,
//           10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,
//           10.239z"
//         fill="currentColor"
//       />
//     </svg>
//   );
// }





"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";
import ThemeToggle from '../../components/ThemeToggle'
export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError("");
    try {
      await signIn("google", { callbackUrl: "/home" });
    } catch (err) {
      setError("Google sign-in failed.");
      setLoading(false);
    }
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") 
    const password = formData.get("password") 

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/home",
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push("/home");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
     
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8">
         <ThemeToggle/>
        <div className="text-center mb-6">
           
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-300 px-4 py-2 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleCustomLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <div className="relative">
              <MailOutlined className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                placeholder="Enter your email"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-200">
              Password
            </label>
            <div className="relative">
              <LockOutlined className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                placeholder="Enter your password"
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-md hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="border-t w-full border-gray-300 dark:border-zinc-700" />
          <span className="px-3 text-gray-500 text-sm">OR</span>
          <span className="border-t w-full border-gray-300 dark:border-zinc-700" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full flex items-center justify-center border border-gray-300 dark:border-zinc-600 py-2 rounded-md text-sm hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
        >
          <GoogleOutlined className="mr-2" />
          Sign in with Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
