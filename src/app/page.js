



"use client";
import React, { useState, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import ThemeToggle from "../components/ThemeToggle";
import Link from "next/link";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "../components/ui/tooltip";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Skeleton } from "../components/ui/skeleton";
import { Badge } from "../components/ui/badge";
import { useToast } from "../components/ui/use-toast";
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
  Proportions,
  FileUp,
  MailOpen,
  Shield,
  History,
  ChevronLeft,
  Settings,
  Loader2,
  Menu,
  ShoppingCart
} from "lucide-react";

// Component imports
import Sales from "../components/salescloud/Sales";
import ServiceCloud from "../components/servicecloud/serviceCloud";

import AIQueryAssistant from "../components/aiassistantquery/AIQueryAssistant";
import GeminiChatAssistant from "../components/aiassistantquery/GeminiChatAssistant";
import Dashboard from "../components/default";
import ReportsBuild from "../components/reports/ReportsBuild";
import SchemaBuilder from '../components/schemabuilder/SchemaBuilder';
import Health from "../components/health/Health";
import LoginHistory from "../components/loginHistory/LoginHistory";
import FileUploader from "../components/fileuploader/Fileuploader";
import EmailTemplateManager from "../components/email/CreateEmailTemplate";

const Page = () => {
  const { status, data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeCloud, setActiveCloud] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { toast } = useToast();
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Check for window resize to auto-collapse sidebar on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    // Set initial state
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: "/" });
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Sign out failed",
        description: "There was a problem signing out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} className="text-indigo-500" /> },
    { id: "salescloud", label: "Sales Cloud", icon: <Users size={20} className="text-sky-500" /> },
    { id: "servicecloud", label: "Service Cloud", icon: <HelpCircle size={20} className="text-amber-500" /> },
    { id: "aiqueryassistant", label: "AI Query Assistant", icon: <Bot size={20} className="text-purple-500" /> },
    { id: "geminiassistant", label: "Gemini Assistant", icon: <BrainCircuit size={20} className="text-fuchsia-500" /> },
    { id: "reports", label: "Reports", icon: <Proportions size={20} className="text-blue-500" /> },
    { id: "schema", label: "Schema Builder", icon: <Cloud size={20} className="text-violet-500" /> },
    { id: "health", label: "Health Check", icon: <Shield size={20} className="text-red-500" /> },
    { id: "loginHistory", label: "Login History", icon: <History size={20} className="text-cyan-500" /> },
    { id: "fileuploader", label: "File Uploader", icon: <FileUp size={20} className="text-green-500" /> },
    { id: "emailtemplate", label: "Email Template", icon: <MailOpen size={20} className="text-orange-500" /> },
  ];

  const renderContent = () => {
    switch (activeCloud) {
      case "salescloud": return <Sales />;
      case "servicecloud": return <ServiceCloud />;
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

  const getCurrentPageTitle = () => {
    const currentItem = navItems.find(item => item.id === activeCloud);
    return currentItem ? currentItem.label : "Dashboard";
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
          <h2 className="text-lg font-medium">Loading your dashboard...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <div 
        className={`${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 flex flex-col fixed h-full z-20`}
      >
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="absolute -right-3 top-12 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md z-30 hidden md:block"
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronLeft size={16} className={`text-primary transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
        </button>

        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg p-2 shadow-md flex-shrink-0">
              <Cloud size={sidebarCollapsed ? 20 : 18} className="text-white" />
            </div>
            {!sidebarCollapsed && (
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent truncate">
                Force Cloud Manager
              </h1>
            )}
          </div>

          <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
            <nav className="space-y-1 mt-4">
              {navItems.map((item) => (
                <TooltipProvider key={item.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`flex items-center justify-${sidebarCollapsed ? 'center' : 'start'} w-full rounded-lg text-sm transition-all duration-200 ${
                          activeCloud === item.id 
                            ? "bg-indigo-50 dark:bg-indigo-900/20 font-medium text-indigo-700 dark:text-indigo-300" 
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setActiveCloud(item.id)}
                        aria-current={activeCloud === item.id ? "page" : undefined}
                      >
                        <span className={`${sidebarCollapsed ? "" : "mr-3"} flex-shrink-0`}>{item.icon}</span>
                        {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                        {activeCloud === item.id && !sidebarCollapsed && (
                          <span className="absolute inset-y-0 left-0 w-1 bg-indigo-600 rounded-r-md" aria-hidden="true" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full mb-2 flex items-center justify-${sidebarCollapsed ? 'center' : 'start'} gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg`}
                  asChild
                >
                  <Link href="/dashboard">
                    <Home size={16} className="text-blue-500" />
                    <span className="ml-2 truncate">Connect Salesforce</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">Connect Salesforce</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  onClick={handleSignOut}
                  disabled={loading}
                  className={`w-full flex items-center justify-${sidebarCollapsed ? 'center' : 'start'} rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors`}
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <LogOut size={16} className="text-gray-500" />
                  )}
                  {!sidebarCollapsed && <span className="ml-2 truncate">Sign out</span>}
                </Button>
              </TooltipTrigger>
              {sidebarCollapsed && (
                <TooltipContent side="right">Sign out</TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
          onClick={() => setSidebarCollapsed(true)}
          aria-hidden="true"
        />
      )}

      {/* Main content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? 'ml-16' : 'ml-0 md:ml-64'} w-full transition-all duration-300`}>
        <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-2 md:hidden"
              onClick={() => setSidebarCollapsed(false)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </Button>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">{getCurrentPageTitle()}</h2>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeToggle />
            
            
            
            
            {session?.user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full h-10 px-2 flex items-center gap-2">
                    {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-medium shadow-md">
                      {session.user.image?.charAt(0) || "U"}
                    </div> */}
                     <Avatar className="h-8 w-9  ring-background shadow-xl">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
                    <span className="hidden md:block text-sm font-medium truncate max-w-32">
                      {session.user.name || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium">{session.user.name || "User"}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email || ""}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Settings size={16} className="mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield size={16} className="mr-2" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </header>

        {/* Status bar
        <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 flex items-center justify-between">
          
        </div> */}

        {/* Main content area */}
        <div className="flex-1 px-4 py-6 md:p-6 overflow-y-auto bg-gray-100 dark:bg-gray-950">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Page;


