// // 'use client'
// // import { signIn, useSession } from "next-auth/react";

// // const HomePage = () => {
// //   const { data: session } = useSession();

// //   if (session) {
// //     return (
// //       <div>
// //         <h1>Welcome, {session.user.name}</h1>
// //         <button onClick={() => signOut()}>Sign out</button>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div>
// //       <h1>Sign in with Google</h1>
// //       <button onClick={() => signIn("google")}>Sign in with Google</button>
// //     </div>
// //   );
// // };

// // export default HomePage;


// "use client";
// import React, { useState, useEffect } from "react";
// import { signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Button } from "../components/ui/button";
// import ThemeToggle from "../components/ThemeToggle";
// // // import SalesCloud from "@/components/salesCloud";
// // import Sales from "../components/salescloud/Sales"
// import SalesCloudManager from '../components/salescloud/SalesCloudManager'
// import ServiceCloud from "../components/servicecloud/serviceCloud";
// import MarketingCloud from "../components/marketingCloud";
// import AIQueryAssistant from "../components/AIQueryAssistant ";
// import GeminiChatAssistant from "../components/GeminiChatAssistant";
// import Dashboard from "../components/default";
// import Link from "next/link";

// const Page = () => {
//   const { status } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [activeCloud, setActiveCloud] = useState("dashboard");
  

  
//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   const handleGoogleSignOut = async () => {
//     setLoading(true);
//     try {
//       await signOut({ callbackUrl: "/" });
//     } catch (error) {
//       console.error("Sign out error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderCloudContent = () => {
//     switch (activeCloud) {
//       case "salescloud":
//         return <SalesCloudManager />;
//       case "servicecloud":
//         return <ServiceCloud />;
//       case "marketingcloud":
//         return <MarketingCloud />;
//       case "aiqueryassistant":
//         return <AIQueryAssistant />; 

//       default:
//         return (
//          <Dashboard/>
//         );
//     }
//   };

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
//       {/* Sidebar */}
//       <div className="w-64 bg-white dark:bg-gray-800 shadow-md relative">
//         <div className="p-4">
//           <div className="flex items-center gap-2 mb-8">
//             <div className="bg-primary rounded-full p-2">
//               {/* Cloud icon */}
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="text-primary-foreground"
//               >
//                 <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
//               </svg>
//             </div>
//             <h1 className="text-xl font-bold">Cloud Manager</h1>
//           </div>

//           {/* Navigation */}
//           <nav className="space-y-4">
//             <Link
//               href="/dashboard"
//               className={`flex items-center p-2 rounded-md w-full hover:bg-gray-100 ${
//                 activeCloud === "dashboard" ? "bg-gray-100 font-medium" : ""
//               }`}
//               onClick={() => setActiveCloud("dashboard")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-3"
//               >
//                 <rect width="7" height="9" x="3" y="3" rx="1" />
//                 <rect width="7" height="5" x="14" y="3" rx="1" />
//                 <rect width="7" height="9" x="14" y="12" rx="1" />
//                 <rect width="7" height="5" x="3" y="16" rx="1" />
//               </svg>
//               Dashboard
//             </Link>

//             {/* Buttons for other clouds */}
//             <Button
//               variant="ghost"
//               className={`flex items-center p-2 rounded-md w-full justify-start ${
//                 activeCloud === "salescloud"
//                   ? "bg-gray-200 dark:bg-gray-700 font-medium"
//                   : ""
//               }`}
//               onClick={() => setActiveCloud("salescloud")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-3"
//               >
//                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                 <circle cx="9" cy="7" r="4" />
//                 <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//               </svg>
//               Sales Cloud
//             </Button>

//             <Button
//               variant="ghost"
//               className={`flex items-center p-2 rounded-md w-full justify-start ${
//                 activeCloud === "servicecloud"
//                   ? "bg-gray-200 dark:bg-gray-700 font-medium"
//                   : ""
//               }`}
//               onClick={() => setActiveCloud("servicecloud")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-3"
//               >
//                 <circle cx="12" cy="12" r="10" />
//                 <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
//                 <path d="M12 17h.01" />
//               </svg>
//               Service Cloud
//             </Button>

//             <Button
//               variant="ghost"
//               className={`flex items-center p-2 rounded-md w-full justify-start ${
//                 activeCloud === "marketingcloud"
//                   ? "bg-gray-200 dark:bg-gray-700 font-medium"
//                   : ""
//               }`}
//               onClick={() => setActiveCloud("marketingcloud")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-3"
//               >
//                 <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A4 4 0 0 1 8.07 2h7.86A4 4 0 0 1 19 6.5l-1.9 1.5H21a2 2 0 0 1 .2.4Z" />
//                 <path d="m9.5 10 5 5" />
//                 <path d="m14.5 10-5 5" />
//               </svg>
//               Marketing Cloud
//             </Button>
//             <Button
//               variant="ghost"
//               className={`flex items-center p-2 rounded-md w-full justify-start ${
//                 activeCloud === "marketingcloud"
//                   ? "bg-gray-200 dark:bg-gray-700 font-medium"
//                   : ""
//               }`}
//               onClick={() => setActiveCloud("aiqueryassistant")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-3"
//               >
//                 <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A4 4 0 0 1 8.07 2h7.86A4 4 0 0 1 19 6.5l-1.9 1.5H21a2 2 0 0 1 .2.4Z" />
//                 <path d="m9.5 10 5 5" />
//                 <path d="m14.5 10-5 5" />
//               </svg>
//               AI Query Assistant
//             </Button>
//             <Button
//               variant="ghost"
//               className={`flex items-center p-2 rounded-md w-full justify-start ${
//                 activeCloud === "marketingcloud"
//                   ? "bg-gray-200 dark:bg-gray-700 font-medium"
//                   : ""
//               }`}
//               onClick={() => setActiveCloud("geminiassistant")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 width="20"
//                 height="20"
//                 viewBox="0 0 24 24"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth="2"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 className="mr-3"
//               >
//                 <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A4 4 0 0 1 8.07 2h7.86A4 4 0 0 1 19 6.5l-1.9 1.5H21a2 2 0 0 1 .2.4Z" />
//                 <path d="m9.5 10 5 5" />
//                 <path d="m14.5 10-5 5" />
//               </svg>
//               Gemini Chat Assistant
//             </Button>
//           </nav>
//         </div>

//         {/* Sign out & theme toggle at bottom */}
//         <div className="absolute bottom-4 w-full px-4">
//           <ThemeToggle />
//           <Button
//             variant="outline"
//             onClick={handleGoogleSignOut}
//             disabled={loading}
//             className="w-full mt-2"
//           >
//             Sign out
//           </Button>
//         </div>
//       </div>

//       {/* Main content */}
//       <div className="flex-1 p-8 overflow-auto">{renderCloudContent()}</div>  
//     </div>
//   );
// };

// export default Page;


"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import ThemeToggle from "../components/ThemeToggle";
// // import SalesCloud from "@/components/salesCloud";
// import Sales from "../components/salescloud/Sales"
import SalesCloudManager from '../components/salescloud/SalesCloudManager'
import ServiceCloud from "../components/servicecloud/serviceCloud";
import MarketingCloud from "../components/marketingCloud";
import AIQueryAssistant from "../components/aiassistantquery/AIQueryAssistant ";
import GeminiChatAssistant from "../components/aiassistantquery/GeminiChatAssistant";
import Dashboard from "../components/default";
import Link from "next/link";

const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeCloud, setActiveCloud] = useState("dashboard");
  

  
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const handleGoogleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderCloudContent = () => {
    switch (activeCloud) {
      case "salescloud":
        return <SalesCloudManager />;
      case "servicecloud":
        return <ServiceCloud />;
      case "marketingcloud":
        return <MarketingCloud />;
      case "aiqueryassistant":
        return <AIQueryAssistant />;
      case "geminiassistant":
        return <GeminiChatAssistant />;
      default:
        return (
         <Dashboard/>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md relative">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary rounded-full p-2">
              {/* Cloud icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">Cloud Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-4">
            <Link
              href="/dashboard"
              className={`flex items-center p-2 rounded-md w-full hover:bg-gray-100 ${
                activeCloud === "dashboard" ? "bg-gray-100 font-medium" : ""
              }`}
              onClick={() => setActiveCloud("dashboard")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Dashboard
            </Link>

            {/* Buttons for other clouds */}
            <Button
              variant="ghost"
              className={`flex items-center p-2 rounded-md w-full justify-start ${
                activeCloud === "salescloud"
                  ? "bg-gray-200 dark:bg-gray-700 font-medium"
                  : ""
              }`}
              onClick={() => setActiveCloud("salescloud")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Sales Cloud
            </Button>

            <Button
              variant="ghost"
              className={`flex items-center p-2 rounded-md w-full justify-start ${
                activeCloud === "servicecloud"
                  ? "bg-gray-200 dark:bg-gray-700 font-medium"
                  : ""
              }`}
              onClick={() => setActiveCloud("servicecloud")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
              </svg>
              Service Cloud
            </Button>

            <Button
              variant="ghost"
              className={`flex items-center p-2 rounded-md w-full justify-start ${
                activeCloud === "marketingcloud"
                  ? "bg-gray-200 dark:bg-gray-700 font-medium"
                  : ""
              }`}
              onClick={() => setActiveCloud("marketingcloud")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A4 4 0 0 1 8.07 2h7.86A4 4 0 0 1 19 6.5l-1.9 1.5H21a2 2 0 0 1 .2.4Z" />
                <path d="m9.5 10 5 5" />
                <path d="m14.5 10-5 5" />
              </svg>
              Marketing Cloud
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center p-2 rounded-md w-full justify-start ${
                activeCloud === "aiqueryassistant"
                  ? "bg-gray-200 dark:bg-gray-700 font-medium"
                  : ""
              }`}
              onClick={() => setActiveCloud("aiqueryassistant")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A4 4 0 0 1 8.07 2h7.86A4 4 0 0 1 19 6.5l-1.9 1.5H21a2 2 0 0 1 .2.4Z" />
                <path d="m9.5 10 5 5" />
                <path d="m14.5 10-5 5" />
              </svg>
              AI Query Assistant
            </Button>
            <Button
              variant="ghost"
              className={`flex items-center p-2 rounded-md w-full justify-start ${
                activeCloud === "geminiassistant"
                  ? "bg-gray-200 dark:bg-gray-700 font-medium"
                  : ""
              }`}
              onClick={() => setActiveCloud("geminiassistant")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2h3.9L5 6.5A4 4 0 0 1 8.07 2h7.86A4 4 0 0 1 19 6.5l-1.9 1.5H21a2 2 0 0 1 .2.4Z" />
                <path d="m9.5 10 5 5" />
                <path d="m14.5 10-5 5" />
              </svg>
              Gemini Chat Assistant
            </Button>
          </nav>
        </div>

        {/* Sign out & theme toggle at bottom */}
        <div className="absolute bottom-4 w-full px-4">
          <ThemeToggle />
          <Button
            variant="outline"
            onClick={handleGoogleSignOut}
            disabled={loading}
            className="w-full mt-2"
          >
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">{renderCloudContent()}</div>  
    </div>
  );
};

export default Page;