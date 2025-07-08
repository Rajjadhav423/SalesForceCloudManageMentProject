



// "use client";
// import React, { useState, useEffect } from "react";
// import { signOut, useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Button } from "../components/ui/button";
// import ThemeToggle from "../components/ThemeToggle";
// import Link from "next/link";
// import { 
//   Tooltip, 
//   TooltipContent, 
//   TooltipProvider, 
//   TooltipTrigger 
// } from "../components/ui/tooltip";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "../components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "../components/ui/dropdown-menu";
// import { Skeleton } from "../components/ui/skeleton";
// import { Badge } from "../components/ui/badge";
// import { useToast } from "../components/ui/use-toast";
// import {
//   LayoutDashboard,
//   Users,
//   HelpCircle,
//   Mail,
//   Bot,
//   BrainCircuit,
//   LogOut,
//   Cloud,
//   Home,
//   Proportions,
//   FileUp,
//   MailOpen,
//   Shield,
//   History,
//   ChevronLeft,
//   Settings,
//   Loader2,
//   Menu,
//   ShoppingCart
// } from "lucide-react";

// // Component imports
// import Sales from "../components/salescloud/Sales";
// import ServiceCloud from "../components/servicecloud/serviceCloud";

// import AIQueryAssistant from "../components/aiassistantquery/AIQueryAssistant";
// import GeminiChatAssistant from "../components/aiassistantquery/GeminiChatAssistant";
// import Dashboard from "../components/default";
// import ReportsBuild from "../components/reports/ReportsBuild";
// import SchemaBuilder from '../components/schemabuilder/SchemaBuilder';
// import Health from "../components/health/Health";
// import LoginHistory from "../components/loginHistory/LoginHistory";
// import FileUploader from "../components/fileuploader/Fileuploader";
// import EmailTemplateManager from "../components/email/CreateEmailTemplate";

// const Page = () => {
//   const { status, data: session } = useSession();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [activeCloud, setActiveCloud] = useState("dashboard");
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const { toast } = useToast();
//   const [notifications, setNotifications] = useState(3);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/login");
//     }
//   }, [status, router]);

//   // Check for window resize to auto-collapse sidebar on mobile
//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 768) {
//         setSidebarCollapsed(true);
//       }
//     };

//     // Set initial state
//     handleResize();

//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   const handleSignOut = async () => {
//     setLoading(true);
//     try {
//       await signOut({ callbackUrl: "/" });
//       toast({
//         title: "Signed out successfully",
//         description: "You have been logged out of your account",
//       });
//     } catch (error) {
//       console.error("Sign out error:", error);
//       toast({
//         title: "Sign out failed",
//         description: "There was a problem signing out. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const navItems = [
//     { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} className="text-indigo-500" /> },
//     { id: "salescloud", label: "Sales Cloud", icon: <Users size={20} className="text-sky-500" /> },
//     { id: "servicecloud", label: "Service Cloud", icon: <HelpCircle size={20} className="text-amber-500" /> },
//     { id: "aiqueryassistant", label: "AI Query Assistant", icon: <Bot size={20} className="text-purple-500" /> },
//     { id: "geminiassistant", label: "Gemini Assistant", icon: <BrainCircuit size={20} className="text-fuchsia-500" /> },
//     { id: "reports", label: "Reports", icon: <Proportions size={20} className="text-blue-500" /> },
//     { id: "schema", label: "Schema Builder", icon: <Cloud size={20} className="text-violet-500" /> },
//     { id: "health", label: "Health Check", icon: <Shield size={20} className="text-red-500" /> },
//     { id: "loginHistory", label: "Login History", icon: <History size={20} className="text-cyan-500" /> },
//     { id: "fileuploader", label: "File Uploader", icon: <FileUp size={20} className="text-green-500" /> },
//     { id: "emailtemplate", label: "Email Template", icon: <MailOpen size={20} className="text-orange-500" /> },
//   ];

//   const renderContent = () => {
//     switch (activeCloud) {
//       case "salescloud": return <Sales />;
//       case "servicecloud": return <ServiceCloud />;
//       case "aiqueryassistant": return <AIQueryAssistant />;
//       case "geminiassistant": return <GeminiChatAssistant />;
//       case "reports": return <ReportsBuild />;
//       case "schema": return <SchemaBuilder />;
//       case "health": return <Health />;
//       case "loginHistory": return <LoginHistory />;
//       case "fileuploader": return <FileUploader />;
//       case "emailtemplate": return <EmailTemplateManager />;
//       default: return <Dashboard />;
//     }
//   };

//   const getCurrentPageTitle = () => {
//     const currentItem = navItems.find(item => item.id === activeCloud);
//     return currentItem ? currentItem.label : "Dashboard";
//   };

//   if (status === "loading") {
//     return (
//       <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto mb-4" />
//           <h2 className="text-lg font-medium">Loading your dashboard...</h2>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
//       {/* Sidebar */}
//       <div 
//         className={`${
//           sidebarCollapsed ? 'w-16' : 'w-64'
//         } bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 flex flex-col fixed h-full z-20`}
//       >
//         <button 
//           onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
//           className="absolute -right-3 top-12 bg-white dark:bg-gray-900 p-1 rounded-full shadow-md z-30 hidden md:block"
//           aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
//         >
//           <ChevronLeft size={16} className={`text-primary transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} />
//         </button>

//         <div className="p-4 border-b border-gray-200 dark:border-gray-800">
//           <div className="flex items-center gap-2 mb-4">
//             <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg p-2 shadow-md flex-shrink-0">
//               <Cloud size={sidebarCollapsed ? 20 : 18} className="text-white" />
//             </div>
//             {!sidebarCollapsed && (
//               <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-700 bg-clip-text text-transparent truncate">
//                 Force Cloud Manager
//               </h1>
//             )}
//           </div>

//           <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
//             <nav className="space-y-1 mt-4">
//               {navItems.map((item) => (
//                 <TooltipProvider key={item.id}>
//                   <Tooltip>
//                     <TooltipTrigger asChild>
//                       <Button
//                         variant="ghost"
//                         className={`flex items-center justify-${sidebarCollapsed ? 'center' : 'start'} w-full rounded-lg text-sm transition-all duration-200 ${
//                           activeCloud === item.id 
//                             ? "bg-indigo-50 dark:bg-indigo-900/20 font-medium text-indigo-700 dark:text-indigo-300" 
//                             : "hover:bg-gray-50 dark:hover:bg-gray-800"
//                         }`}
//                         onClick={() => setActiveCloud(item.id)}
//                         aria-current={activeCloud === item.id ? "page" : undefined}
//                       >
//                         <span className={`${sidebarCollapsed ? "" : "mr-3"} flex-shrink-0`}>{item.icon}</span>
//                         {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
//                         {activeCloud === item.id && !sidebarCollapsed && (
//                           <span className="absolute inset-y-0 left-0 w-1 bg-indigo-600 rounded-r-md" aria-hidden="true" />
//                         )}
//                       </Button>
//                     </TooltipTrigger>
//                     {sidebarCollapsed && (
//                       <TooltipContent side="right">{item.label}</TooltipContent>
//                     )}
//                   </Tooltip>
//                 </TooltipProvider>
//               ))}
//             </nav>
//           </div>
//         </div>

//         <div className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800">
//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   className={`w-full mb-2 flex items-center justify-${sidebarCollapsed ? 'center' : 'start'} gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-lg`}
//                   asChild
//                 >
//                   <Link href="/dashboard">
//                     <Home size={16} className="text-blue-500" />
//                     <span className="ml-2 truncate">Connect Salesforce</span>
//                   </Link>
//                 </Button>
//               </TooltipTrigger>
//               {sidebarCollapsed && (
//                 <TooltipContent side="right">Connect Salesforce</TooltipContent>
//               )}
//             </Tooltip>
//           </TooltipProvider>

//           <TooltipProvider>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   variant="outline"
//                   onClick={handleSignOut}
//                   disabled={loading}
//                   className={`w-full flex items-center justify-${sidebarCollapsed ? 'center' : 'start'} rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors`}
//                 >
//                   {loading ? (
//                     <Loader2 size={16} className="animate-spin" />
//                   ) : (
//                     <LogOut size={16} className="text-gray-500" />
//                   )}
//                   {!sidebarCollapsed && <span className="ml-2 truncate">Sign out</span>}
//                 </Button>
//               </TooltipTrigger>
//               {sidebarCollapsed && (
//                 <TooltipContent side="right">Sign out</TooltipContent>
//               )}
//             </Tooltip>
//           </TooltipProvider>
//         </div>
//       </div>

//       {/* Mobile sidebar overlay */}
//       {!sidebarCollapsed && (
//         <div 
//           className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden" 
//           onClick={() => setSidebarCollapsed(true)}
//           aria-hidden="true"
//         />
//       )}

//       {/* Main content */}
//       <div className={`flex-1 flex flex-col overflow-hidden ${sidebarCollapsed ? 'ml-16' : 'ml-0 md:ml-64'} w-full transition-all duration-300`}>
//         <header className="bg-white dark:bg-gray-900 shadow-sm h-16 flex items-center px-4 md:px-6 justify-between sticky top-0 z-10">
//           <div className="flex items-center">
//             <Button 
//               variant="ghost" 
//               size="sm" 
//               className="mr-2 md:hidden"
//               onClick={() => setSidebarCollapsed(false)}
//               aria-label="Open menu"
//             >
//               <Menu size={20} />
//             </Button>
//             <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 truncate">{getCurrentPageTitle()}</h2>
//           </div>

//           <div className="flex items-center gap-2 md:gap-4">
//             <ThemeToggle />




//             {session?.user && (
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="rounded-full h-10 px-2 flex items-center gap-2">
//                     {/* <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-medium shadow-md">
//                       {session.user.image?.charAt(0) || "U"}
//                     </div> */}
//                      <Avatar className="h-8 w-9  ring-background shadow-xl">
//                 <AvatarImage src={session.user?.image || ""} />
//                 <AvatarFallback className="bg-primary text-primary-foreground text-xl">
//                   {session.user?.name?.charAt(0) || "U"}
//                 </AvatarFallback>
//               </Avatar>
//                     <span className="hidden md:block text-sm font-medium truncate max-w-32">
//                       {session.user.name || "User"}
//                     </span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-56">
//                   <DropdownMenuLabel>
//                     <div className="flex flex-col space-y-1">
//                       <p className="font-medium">{session.user.name || "User"}</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{session.user.email || ""}</p>
//                     </div>
//                   </DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem>
//                     <Settings size={16} className="mr-2" />
//                     Account Settings
//                   </DropdownMenuItem>
//                   <DropdownMenuItem>
//                     <Shield size={16} className="mr-2" />
//                     Security
//                   </DropdownMenuItem>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem onClick={handleSignOut}>
//                     <LogOut size={16} className="mr-2" />
//                     Sign out
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             )}
//           </div>
//         </header>

//         {/* Status bar
//         <div className="bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 flex items-center justify-between">

//         </div> */}

//         {/* Main content area */}
//         <div className="flex-1 px-4 py-6 md:p-6 overflow-y-auto bg-gray-100 dark:bg-gray-950">
//           {renderContent()}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Page;
'use client'
import React, { useState } from 'react';
import {
  Layout,
  Menu,
  Button,
  Card,
  Row,
  Col,
  Typography,
  Steps,
  Carousel,
  Avatar,
  Table,
  Collapse,
  Form,
  Input,
  Space,
  Divider,
  FloatButton,
  ConfigProvider,
  theme,
  Badge,
  Rate,
  Statistic,
  Timeline,
  notification
} from 'antd';
import {
  MenuOutlined,
  PlayCircleOutlined,
  CheckCircleOutlined,
  StarOutlined,
  ThunderboltOutlined,
  ShieldCheckOutlined,
  BarChartOutlined,
  ApiOutlined,
  RobotOutlined,
  ClusterOutlined,
  SafetyOutlined,
  DatabaseOutlined,
  ArrowRightOutlined,
  MessageOutlined,
  SunOutlined,
  MoonOutlined,
  TwitterOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  LoginOutlined
} from '@ant-design/icons';
import Link from 'next/link'

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

export default function CloudForceLanding() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSubmit = () => {
    notification.success({
      message: 'Success!',
      description: 'Thank you for your interest. We will contact you soon.',
      placement: 'topRight',
    });
  };

  const features = [
    {
      icon: <ApiOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: 'Salesforce Integration',
      description: 'Seamlessly connect and sync with your existing Salesforce environment in minutes.'
    },
    {
      icon: <RobotOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: 'AI Query Assistant',
      description: 'Get instant insights with our AI-powered query assistant that understands natural language.'
    },
    {
      icon: <ClusterOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      title: 'Schema Visualization',
      description: 'Visualize your data relationships with interactive schema diagrams and flowcharts.'
    },
    {
      icon: <BarChartOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      title: 'Advanced Reporting',
      description: 'Create powerful reports and dashboards with real-time data and custom analytics.'
    },
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#f5222d' }} />,
      title: 'Secure & Scalable',
      description: 'Enterprise-grade security with SOC 2 compliance and unlimited scalability.'
    },
    {
      icon: <DatabaseOutlined style={{ fontSize: '32px', color: '#13c2c2' }} />,
      title: 'Easy Data Management',
      description: 'Manage, clean, and organize your CRM data with intuitive drag-and-drop tools.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      company: 'TechCorp Inc.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Cloud Force CRM Manager transformed our sales process. The AI assistant saves us hours every day!'
    },
    {
      name: 'Michael Chen',
      company: 'GrowthStart',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'The schema visualization feature is a game-changer. We finally understand our data structure.'
    },
    {
      name: 'Emily Rodriguez',
      company: 'DataFlow Solutions',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      text: 'Seamless Salesforce integration and incredible reporting capabilities. Highly recommended!'
    }
  ];

  const pricingPlans = [
    {
      title: 'Free',
      price: '$0',
      period: '/month',
      features: [
        'Up to 1,000 records',
        'Basic reporting',
        'Email support',
        'Standard templates'
      ],
      popular: false
    },
    {
      title: 'Pro',
      price: '$49',
      period: '/month',
      features: [
        'Up to 10,000 records',
        'Advanced reporting',
        'AI Query Assistant',
        'Priority support',
        'Custom templates',
        'API access'
      ],
      popular: true
    },
    {
      title: 'Enterprise',
      price: '$199',
      period: '/month',
      features: [
        'Unlimited records',
        'Advanced analytics',
        'Custom integrations',
        'Dedicated support',
        'White-label options',
        'On-premise deployment'
      ],
      popular: false
    }
  ];

  const faqs = [
    {
      question: 'How long does it take to set up Cloud Force CRM Manager?',
      answer: 'Setup typically takes 5-10 minutes. Our one-click Salesforce integration makes it incredibly fast to get started.'
    },
    {
      question: 'Is my data secure with Cloud Force CRM Manager?',
      answer: 'Yes, we use enterprise-grade security with SOC 2 compliance, end-to-end encryption, and regular security audits.'
    },
    {
      question: 'Can I customize the reports and dashboards?',
      answer: 'Absolutely! Our platform offers extensive customization options for reports, dashboards, and data visualizations.'
    },
    {
      question: 'Do you offer customer support?',
      answer: 'Yes, we provide 24/7 customer support via chat, email, and phone for all our paid plans.'
    },
    {
      question: 'Can I integrate with other tools besides Salesforce?',
      answer: 'Currently, we specialize in Salesforce integration, but we are working on integrations with HubSpot, Pipedrive, and other CRM platforms.'
    }
  ];

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {/* Navigation */}
        <Header style={{
          padding: '0 50px',
          background: isDarkMode ? '#001529' : '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}>
          <Row align="middle" justify="space-between">
            <Col>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ThunderboltOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={4} style={{ margin: 0, color: isDarkMode ? '#fff' : '#000' }}>
                  Cloud Force CRM
                </Title>
              </div>
            </Col>
            <Col>
              <Space size="large">
                <Menu
                  mode="horizontal"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    minWidth: '400px'
                  }}
                  items={[
                    { key: 'features', label: 'Features' },
                    { key: 'pricing', label: 'Pricing' },
                    { key: 'about', label: 'About' },
                    { key: 'contact', label: 'Contact' }
                  ]}
                />
                <Button
                  icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
                  onClick={toggleTheme}
                  type="text"
                />
                <Button type="primary" size="large">
                  Get Started
                </Button>
                <Button
                  type="default"
                  size="large"
                  icon={<LoginOutlined />}
                  href="/login"
                  style={{ marginLeft: 8 }}
                >
                  Login
                </Button>
              </Space>
            </Col>
          </Row>
        </Header>

        <Content>
          {/* Hero Section */}
          <div style={{
            background: isDarkMode
              ? 'linear-gradient(135deg, #001529 0%, #003a8c 100%)'
              : 'linear-gradient(135deg, #e6f7ff 0%, #bae7ff 100%)',
            padding: '100px 50px',
            textAlign: 'center'
          }}>
            <Row justify="center" align="middle" gutter={[48, 48]}>
              <Col xs={24} lg={12}>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Badge.Ribbon text="New Features" color="blue">
                    <Card style={{ textAlign: 'left' }}>
                      <Title level={1} style={{ marginBottom: '16px', fontSize: '3rem' }}>
                        Supercharge Your <span style={{ color: '#1890ff' }}>Salesforce CRM</span>
                      </Title>
                      <Paragraph style={{ fontSize: '1.2rem', marginBottom: '32px' }}></Paragraph>
                      AI-powered Salesforce CRM management for modern businesses.
                      Visualize data, automate workflows, and get insights in minutes.

                      <Space size="large">
                        <Button
                          type="primary"
                          size="large"
                          icon={<PlayCircleOutlined />}
                          style={{ height: '50px', fontSize: '16px' }}
                        >
                          Start Free Trial
                        </Button>
                        <Button
                          size="large"
                          icon={<ArrowRightOutlined />}
                          style={{ height: '50px', fontSize: '16px' }}
                        >
                          Request Demo
                        </Button>
                        <Button
                          type="default"
                          size="large"
                          icon={<LoginOutlined />}
                          href="/login"
                        >
                          Login
                        </Button>
                      </Space>
                    </Card>
                  </Badge.Ribbon>
                </Space>
              </Col>
              <Col xs={24} lg={12}>
                <div style={{
                  background: isDarkMode ? '#1f1f1f' : '#fff',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                  <img
                    src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop"
                    alt="CRM Dashboard"
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </div>
              </Col>
            </Row>
          </div>

          {/* Stats Section */}
          <div style={{ padding: '80px 50px', background: isDarkMode ? '#141414' : '#fafafa' }}>
            <Row justify="center" gutter={[48, 48]}>
              <Col xs={12} md={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Statistic title="Active Users" value={12000} suffix="+" />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Statistic title="Data Records Processed" value={50} suffix="M+" />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Statistic title="Time Saved" value={40} suffix="hrs/week" />
                </Card>
              </Col>
              <Col xs={12} md={6}>
                <Card style={{ textAlign: 'center' }}>
                  <Statistic title="Customer Satisfaction" value={98} suffix="%" />
                </Card>
              </Col>
            </Row>
          </div>

          {/* Features Section */}
          <div style={{ padding: '100px 50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>Powerful Features for Modern Teams</Title>
              <Paragraph style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                Everything you need to manage, analyze, and optimize your Salesforce CRM data
              </Paragraph>
            </div>
            <Row gutter={[32, 32]} justify="center">
              {features.map((feature, index) => (
                <Col xs={24} md={12} lg={8} key={index}>
                  <Card
                    hoverable
                    style={{
                      height: '100%',
                      transition: 'all 0.3s ease',
                      border: '1px solid #f0f0f0'
                    }}
                    bodyStyle={{ padding: '32px' }}
                  >
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ marginBottom: '16px' }}>
                        {feature.icon}
                      </div>
                      <Title level={4} style={{ marginBottom: '16px' }}>
                        {feature.title}
                      </Title>
                      <Paragraph style={{ color: '#666' }}>
                        {feature.description}
                      </Paragraph>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* How It Works Section */}
          <div style={{ padding: '100px 50px', background: isDarkMode ? '#141414' : '#fafafa' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>How It Works</Title>
              <Paragraph style={{ fontSize: '1.1rem' }}>
                Get started in minutes with our simple 5-step process
              </Paragraph>
            </div>
            <Row justify="center">
              <Col xs={24} lg={16}>
                <Timeline
                  mode="alternate"
                  items={[
                    {
                      dot: <ApiOutlined style={{ fontSize: '16px' }} />,
                      children: (
                        <Card>
                          <Title level={4}>Connect Salesforce</Title>
                          <Paragraph>
                            One-click integration with your existing Salesforce environment
                          </Paragraph>
                        </Card>
                      )
                    },
                    {
                      dot: <DatabaseOutlined style={{ fontSize: '16px' }} />,
                      children: (
                        <Card>
                          <Title level={4}>Import & Organize Data</Title>
                          <Paragraph>
                            Automatically sync and organize your CRM data with smart categorization
                          </Paragraph>
                        </Card>
                      )
                    },
                    {
                      dot: <ClusterOutlined style={{ fontSize: '16px' }} />,
                      children: (
                        <Card>
                          <Title level={4}>Visualize Relationships</Title>
                          <Paragraph>
                            See your data connections with interactive schema diagrams
                          </Paragraph>
                        </Card>
                      )
                    },
                    {
                      dot: <RobotOutlined style={{ fontSize: '16px' }} />,
                      children: (
                        <Card>
                          <Title level={4}>AI-Powered Insights</Title>
                          <Paragraph>
                            Get intelligent recommendations and automated workflows
                          </Paragraph>
                        </Card>
                      )
                    },
                    {
                      dot: <BarChartOutlined style={{ fontSize: '16px' }} />,
                      children: (
                        <Card>
                          <Title level={4}>Advanced Reporting</Title>
                          <Paragraph>
                            Create custom reports and dashboards for actionable insights
                          </Paragraph>
                        </Card>
                      )
                    }
                  ]}
                />
              </Col>
            </Row>
          </div>

          {/* Screenshots Section */}
          <div style={{ padding: '100px 50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>See Cloud Force CRM in Action</Title>
              <Paragraph style={{ fontSize: '1.1rem' }}>
                Explore our intuitive interface and powerful features
              </Paragraph>
            </div>
            <Row justify="center">
              <Col xs={24} lg={20}>
                <Carousel autoplay dots={{ className: 'custom-dots' }}>
                  <div>
                    <Card
                      cover={<img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=500&fit=crop" alt="Dashboard" />}
                      style={{ margin: '0 16px' }}
                    >
                      <Title level={4}>Interactive Dashboard</Title>
                      <Paragraph>Real-time analytics and KPI tracking</Paragraph>
                    </Card>
                  </div>
                  <div>
                    <Card
                      cover={<img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=500&fit=crop" alt="Analytics" />}
                      style={{ margin: '0 16px' }}
                    >
                      <Title level={4}>Advanced Analytics</Title>
                      <Paragraph>Deep insights into your sales performance</Paragraph>
                    </Card>
                  </div>
                  <div>
                    <Card
                      cover={<img src="https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&h=500&fit=crop" alt="AI Assistant" />}
                      style={{ margin: '0 16px' }}
                    >
                      <Title level={4}>AI Query Assistant</Title>
                      <Paragraph>Natural language queries for instant insights</Paragraph>
                    </Card>
                  </div>
                </Carousel>
              </Col>
            </Row>
          </div>

          {/* Testimonials Section */}
          <div style={{ padding: '100px 50px', background: isDarkMode ? '#141414' : '#fafafa' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>What Our Customers Say</Title>
              <Paragraph style={{ fontSize: '1.1rem' }}>
                Join thousands of satisfied customers who trust Cloud Force CRM
              </Paragraph>
            </div>
            <Row gutter={[32, 32]} justify="center">
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <Card style={{ height: '100%' }}>
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <Avatar size={64} src={testimonial.avatar} />
                      <div style={{ marginTop: '16px' }}>
                        <Title level={5} style={{ marginBottom: '4px' }}>
                          {testimonial.name}
                        </Title>
                        <Text type="secondary">{testimonial.company}</Text>
                      </div>
                      <Rate disabled defaultValue={testimonial.rating} style={{ marginTop: '8px' }} />
                    </div>
                    <Paragraph style={{ fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Pricing Section */}
          <div style={{ padding: '100px 50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>Choose Your Plan</Title>
              <Paragraph style={{ fontSize: '1.1rem' }}>
                Start free and scale as you grow
              </Paragraph>
            </div>
            <Row gutter={[32, 32]} justify="center">
              {pricingPlans.map((plan, index) => (
                <Col xs={24} md={8} key={index}>
                  <Badge.Ribbon
                    text="Most Popular"
                    color="blue"
                    style={{ display: plan.popular ? 'block' : 'none' }}
                  >
                    <Card
                      style={{
                        height: '100%',
                        border: plan.popular ? '2px solid #1890ff' : '1px solid #f0f0f0'
                      }}
                    >
                      <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <Title level={3}>{plan.title}</Title>
                        <div style={{ marginBottom: '16px' }}>
                          <Text style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                            {plan.price}
                          </Text>
                          <Text type="secondary">{plan.period}</Text>
                        </div>
                        <Button
                          type={plan.popular ? "primary" : "default"}
                          size="large"
                          block
                          style={{ marginBottom: '24px' }}
                        >
                          {plan.title === 'Free' ? 'Start Free' : 'Start Trial'}
                        </Button>
                      </div>
                      <div>
                        {plan.features.map((feature, idx) => (
                          <div key={idx} style={{ marginBottom: '8px' }}>
                            <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                            <Text>{feature}</Text>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>
          </div>

          {/* FAQ Section */}
          <div style={{ padding: '100px 50px', background: isDarkMode ? '#141414' : '#fafafa' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>Frequently Asked Questions</Title>
              <Paragraph style={{ fontSize: '1.1rem' }}>
                Everything you need to know about Cloud Force CRM Manager
              </Paragraph>
            </div>
            <Row justify="center">
              <Col xs={24} lg={16}>
                <Collapse size="large">
                  {faqs.map((faq, index) => (
                    <Panel header={faq.question} key={index}>
                      <Paragraph>{faq.answer}</Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </Col>
            </Row>
          </div>

          {/* Contact Section */}
          <div style={{ padding: '100px 50px' }}>
            <div style={{ textAlign: 'center', marginBottom: '80px' }}>
              <Title level={2}>Get in Touch</Title>
              <Paragraph style={{ fontSize: '1.1rem' }}>
                Ready to transform your CRM experience? Let's talk!
              </Paragraph>
            </div>
            <Row gutter={[48, 48]} justify="center">
              <Col xs={24} lg={12}>
                <Card title="Send us a message">
                  <Form
                    layout="vertical"
                    onFinish={handleSubmit}
                  >
                    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email' }]}>
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="company" label="Company">
                      <Input size="large" />
                    </Form.Item>
                    <Form.Item name="message" label="Message" rules={[{ required: true }]}>
                      <Input.TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                      <Button type="primary" htmlType="submit" size="large" block>
                        Send Message
                      </Button>
                    </Form.Item>
                  </Form>
                </Card>
              </Col>
              <Col xs={24} lg={12}>
                <Card title="Contact Information">
                  <Space direction="vertical" size="large" style={{ width: '100%' }}>
                    <div>
                      <MailOutlined style={{ marginRight: '8px' }} />
                      <Text>contact@cloudforcecrm.com</Text>
                    </div>
                    <div>
                      <PhoneOutlined style={{ marginRight: '8px' }} />
                      <Text>+1 (555) 123-4567</Text>
                    </div>
                    <div>
                      <EnvironmentOutlined style={{ marginRight: '8px' }} />
                      <Text>San Francisco, CA</Text>
                    </div>
                    <Divider />
                    <div>
                      <Title level={5}>Follow us</Title>
                      <Space size="large">
                        <TwitterOutlined style={{ fontSize: '20px', color: '#1DA1F2' }} />
                        <LinkedinOutlined style={{ fontSize: '20px', color: '#0077B5' }} />
                        <FacebookOutlined style={{ fontSize: '20px', color: '#1877F2' }} />
                        <InstagramOutlined style={{ fontSize: '20px', color: '#E4405F' }} />
                      </Space>
                    </div>
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>
        </Content>

        {/* Footer */}
        <Footer style={{ background: isDarkMode ? '#001529' : '#001529', color: '#fff' }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} md={6}>
              <Space direction="vertical">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ThunderboltOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                  <Title level={4} style={{ color: '#fff', margin: 0 }}>
                    Cloud Force CRM
                  </Title>
                </div>
                <Paragraph style={{ color: '#fff' }}>
                  AI-powered Salesforce CRM management for modern businesses.
                </Paragraph>
                <Space>
                  <TwitterOutlined style={{ fontSize: '20px', color: '#1DA1F2' }} />
                  <LinkedinOutlined style={{ fontSize: '20px', color: '#0077B5' }} />
                  <FacebookOutlined style={{ fontSize: '20px', color: '#1877F2' }} />
                  <InstagramOutlined style={{ fontSize: '20px', color: '#E4405F' }} />
                </Space>
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: '#fff' }}>Product</Title>
              <Space direction="vertical">
                Features
                Pricing
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: '#fff' }}>Company</Title>
              <Space direction="vertical">
                <Link href={'/about'}>About</Link>
                 <Link href={'/blog'}>blog</Link>
               <Link href={'/contact-us'}>contact us</Link>
              </Space>
            </Col>
            <Col xs={24} md={6}>
              <Title level={5} style={{ color: '#fff' }}>Legal</Title>
              <Space direction="vertical">
                {/* <a href="/privacy-policy" style={{ color: '#fff' }}>Privacy Policy</a> */}
                <Link href="/privacy-policy">
                  Privacy Policy
                </Link>
                <Link href="/terms-and-conditions">
                 Terms of Service
                </Link>
                <Link href="/refund-policy">
                Refund Policy
                </Link>
              </Space>
            </Col>
          </Row>
          <Divider style={{ borderColor: '#434343' }} />
          <div style={{ textAlign: 'center' }}>
            <Text style={{ color: '#fff' }}>
              © 2024 Cloud Force CRM Manager. All rights reserved.
            </Text>
          </div>
        </Footer>

        {/* Floating Chat Button */}
        <FloatButton
          icon={<MessageOutlined />}
          type="primary"
          style={{ right: 24, bottom: 24 }}
          onClick={() => notification.info({
            message: 'Chat Support',
            description: 'Our support team will be with you shortly!',
            placement: 'topRight'
          })}
        />
      </Layout>
    </ConfigProvider>
  );
}