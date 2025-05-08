

"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  HelpCircle,
  Mail,
  Bot,
  BrainCircuit,
  LogOut,
  Cloud,
  Home,
  Proportions
} from "lucide-react";

// Import your components
import Sales from "../components/salescloud/Sales";
import ServiceCloud from "../components/servicecloud/serviceCloud";
import MarketingCloud from "../components/marketingCloud";
import AIQueryAssistant from "../components/aiassistantquery/AIQueryAssistant ";
import GeminiChatAssistant from "../components/aiassistantquery/GeminiChatAssistant";
import Dashboard from "../components/default";
import ReportsBuild from "../components/reports/ReportsBuild";
import SchemaBuilder from '../components/schemabuilder/SchemaBuilder'
import Health from "../components/health/Health";
import LoginHistory from "../components/loginHistory/LoginHistory.jsx";
import FileUploader from "../components/fileuploader/Fileuploader";
import EmailTemplateManager from "../components/email/CreateEmailTemplate";
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

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Navigation items with Lucide icons
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { id: "salescloud", label: "Sales Cloud", icon: <Users size={20} /> },
    { id: "servicecloud", label: "Service Cloud", icon: <HelpCircle size={20} /> },
    { id: "marketingcloud", label: "Marketing Cloud", icon: <Mail size={20} /> },
    { id: "aiqueryassistant", label: "AI Query Assistant", icon: <Bot size={20} /> },
    { id: "geminiassistant", label: "Gemini Assistant", icon: <BrainCircuit size={20} /> },
    { id: "reports", label: "Reports", icon: <Proportions size={20} /> },
    { id: "schema", label: "Schema Builder", icon: <Cloud size={20} /> },
    { id: "health", label: "Health Check", icon: <Cloud size={20} /> },
    { id: "loginHistory", label: "Login History", icon: <Cloud size={20} /> },
    { id: "fileuploader", label: "File Uploader", icon: <Cloud size={20} /> },
    { id: "emailtemplate", label: "Email Template", icon: <Cloud size={20} /> },

  ];

  const renderContent = () => {
    switch (activeCloud) {
      case "salescloud": return <Sales />;
      case "servicecloud": return <ServiceCloud />;
      case "marketingcloud": return <MarketingCloud />;
      case "aiqueryassistant": return <AIQueryAssistant />;
      case "geminiassistant": return <GeminiChatAssistant />;
      case "reports": return <ReportsBuild />;
      case "schema": return <SchemaBuilder />;
      case "health": return <Health />;
      case "loginHistory": return <LoginHistory />;
      case "fileuploader": return <FileUploader />;
      case "emailtemplate": return <EmailTemplateManager />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col">
        {/* Logo and Title */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <div className="bg-primary rounded-full p-2">
              <Cloud size={20} className="text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold">Cloud Manager</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={`flex items-center justify-start w-full ${activeCloud === item.id ? "bg-gray-200 dark:bg-gray-700 font-medium" : ""
                  }`}
                onClick={() => setActiveCloud(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Button>
            ))}
          </nav>
        </div>

        {/* Bottom actions */}
        <div className="mt-auto p-4">
          <ThemeToggle />
          <Button
            asChild
            variant="outline"
            className="w-full mt-2 mb-2 flex items-center justify-center gap-2 hover:bg-muted transition-colors"
          >
            <Link href="/dashboard" className="flex items-center">
              <Home size={16} className="mr-2" />
              <span>Go to Dashboard</span>
            </Link>
          </Button>
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={loading}
            className="w-full flex items-center justify-center"
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;