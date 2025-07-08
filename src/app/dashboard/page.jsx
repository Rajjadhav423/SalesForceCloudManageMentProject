// "use client";

// import { useState, useEffect } from "react";
// import { useSession, signOut } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Button } from "../../components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import { Cloud, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
// import { Alert, AlertDescription } from "../../components/ui/alert";
// import { Badge } from "../../components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
// import { useSalesforce } from "../../context/salesforcecontet";

// export default function DashboardPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const {
//     isConnected,
//     isLoading,
//     sfUserInfo,
//     credentials,
//     connectToSalesforce,
//     disconnectFromSalesforce,
//     setCredentials
//   } = useSalesforce();
//   const [isDialogOpen, setIsDialogOpen] = useState(false);
//   const [formError, setFormError] = useState('');

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.push("/");
//     }
//   }, [status, router]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setCredentials({
//       ...credentials,
//       [name]: value,
//     });
//   };

//   const handleConnect = async (e) => {
//     e.preventDefault();
//     setFormError('');

//     try {
//       await connectToSalesforce(credentials);
//       setIsDialogOpen(false);
//     } catch (error) {
//       console.error('Login failed:', error);
//       if (error instanceof Error) {
//         setFormError(error.message || 'Connection failed');
//       } else {
//         setFormError('Connection failed');
//       }
//     }
//   };

//   if (status === "loading") {
//     return (
//       <div>
//       <div className="flex min-h-screen items-center justify-center"></div>
//         <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!session) {
//     return null; // Will redirect in useEffect
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-6xl mx-auto">
//         <Card className="shadow-md mb-6">
//           <CardHeader>
//             <CardTitle className="text-2xl">Dashboard</CardTitle>
//             <CardDescription>Welcome to your dashboard</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//               <div className="flex items-center gap-4">
//                 <Avatar className="h-16 w-16 ring-2 ring-primary/20">
//                   <AvatarImage src={session.user?.image || ""} />
//                   <AvatarFallback className="bg-primary/10 text-primary">{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h2 className="text-xl font-bold">{session.user?.name || "User"}</h2>
//                   <p className="text-sm text-muted-foreground">{session.user?.email || ""}</p>
//                 </div>
//               </div>

//               <div className="flex gap-3 mt-4 md:mt-0">
//                 {!isConnected ? (
//                   <Button
//                     className="bg-primary hover:bg-primary/90 text-white gap-2"
//                     onClick={() => setIsDialogOpen(true)}
//                   >
//                     <Cloud className="h-4 w-4" />
//                     Connect to Salesforce
//                   </Button>
//                 ) : (
//                   <Button
//                     variant="outline"
//                     className="gap-2"
//                     onClick={disconnectFromSalesforce}
//                   >
//                     <LogOut className="h-4 w-4" />
//                     Disconnect Salesforce
//                   </Button>
//                 )}

//                 <Button variant="ghost" className="gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
//                   <LogOut className="h-4 w-4" />
//                   Sign Out
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {isConnected ? (
//           <div className="grid gap-6 md:grid-cols-2">
//             <Card className="shadow-md">
//               <CardHeader>
//                 <CardTitle>Salesforce Organization</CardTitle>
//                 <CardDescription>Connected organization details</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center space-x-2 mb-4">
//                     <Badge className="bg-green-500">
//                       <CheckCircle2 className="h-3 w-3 mr-1" />
//                       Connected
//                     </Badge>
//                   </div>

//                   <div className="space-y-4">
//                     <div className="grid grid-cols-1 gap-4">
//                       <div className="space-y-2">
//                         <Label className="text-xs text-muted-foreground">Organization Name</Label>
//                         <div className="font-medium">{sfUserInfo?.org_name || 'N/A'}</div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-xs text-muted-foreground">Organization ID</Label>
//                         <div className="font-medium text-sm">{sfUserInfo?.organization_id || 'N/A'}</div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-xs text-muted-foreground">Instance URL</Label>
//                         <div className="font-medium text-sm">{sfUserInfo?.instance_url || 'N/A'}</div>
//                       </div>
//                       <div className="space-y-2">
//                         <Label className="text-xs text-muted-foreground">API Version</Label>
//                         <div className="font-medium">v58.0</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="shadow-md">
//               <CardHeader>
//                 <CardTitle>Account Information</CardTitle>
//                 <CardDescription>Connected user details</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-1 gap-4">
//                     <div className="space-y-2">
//                       <Label className="text-xs text-muted-foreground">Name</Label>
//                       <div className="font-medium">{sfUserInfo?.display_name || 'N/A'}</div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-xs text-muted-foreground">Username</Label>
//                       <div className="font-medium">{sfUserInfo?.username || 'N/A'}</div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-xs text-muted-foreground">Email</Label>
//                       <div className="font-medium">{sfUserInfo?.email || 'N/A'}</div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label className="text-xs text-muted-foreground">User ID</Label>
//                       <div className="font-medium text-sm">{sfUserInfo?.user_id || 'N/A'}</div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         ) : (
//           <Card className="shadow-md">
//             <CardHeader>
//               <CardTitle>Welcome to your Dashboard</CardTitle>
//               <CardDescription>
//                 Connect your Salesforce account to get started
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="flex flex-col items-center justify-center py-12">
//                 <Cloud className="h-16 w-16 text-muted-foreground mb-4" />
//                 <h3 className="text-lg font-medium mb-2">No Salesforce Connection</h3>
//                 <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
//                   Connect your Salesforce account to view and manage your organization data
//                 </p>
//                 <Button onClick={() => setIsDialogOpen(true)}>
//                   Connect to Salesforce
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Connect to Salesforce Dialog */}
//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="max-w-md">
//           <DialogHeader>
//             <DialogTitle>Connect to Salesforce</DialogTitle>
//             <DialogDescription>
//               Enter your Salesforce credentials to connect
//             </DialogDescription>
//           </DialogHeader>

//           {formError && (
//             <Alert variant="destructive">
//               <AlertCircle className="h-4 w-4" />
//               <AlertDescription>{formError}</AlertDescription>
//             </Alert>
//           )}

//           <form onSubmit={handleConnect} className="space-y-4 pt-2">
//             <div className="grid gap-4">
//               <div className="space-y-2">
//                 <Label htmlFor="username">Username</Label>
//                 <Input
//                   id="username"
//                   name="username"
//                   placeholder="your.email@example.com"
//                   value={credentials.username}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="password">Password</Label>
//                 <Input
//                   id="password"
//                   name="password"
//                   type="password"
//                   placeholder="Enter your password"
//                   value={credentials.password}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label htmlFor="securityToken">Security Token</Label>
//                 <Input
//                   id="securityToken"
//                   name="securityToken"
//                   placeholder="Your security token"
//                   value={credentials.securityToken}
//                   onChange={handleChange}
//                   required
//                 />
//                 <p className="text-xs text-muted-foreground mt-1">
//                   You can reset your security token in Salesforce by going to Settings →
//                   My Personal Information → Reset Security Token
//                 </p>
//               </div>
//             </div>
//             <Button
//               type="submit"
//               className="w-full"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Connecting...' : 'Connect to Salesforce'}
//             </Button>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }


// src\app\dashboard\page.jsx

"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Cloud,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Mail,
  Key,
  BarChart3,
  Database,
  Globe,
  Code2,
  Fingerprint,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Separator } from "../../components/ui/separator";
import { Progress } from "../../components/ui/progress";
import { useSalesforce } from "../../context/salesforcecontet";
import ThemeToggle from "../../components/ThemeToggle";
import Link from "next/link";
export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    isConnected,
    isLoading,
    sfUserInfo,
    credentials,
    connectToSalesforce,
    disconnectFromSalesforce,
    setCredentials,
  } = useSalesforce();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [progress, setProgress] = useState(0);

  // useEffect(() => {
  //   if (status === "unauthenticated") {
  //     router.push("/");
  //   }
  // }, [status, router]);

  useEffect(() => {
    // Simulate loading progress when connecting
    if (isLoading) {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    } else {
      setProgress(0);
    }
  }, [isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setFormError("");

    try {
      await connectToSalesforce(credentials);
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Login failed:", error);
      if (error instanceof Error) {
        setFormError(error.message || "Connection failed");
      } else {
        setFormError("Connection failed");
      }
    }
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-lg border-0 mb-6 overflow-hidden">
          <div className="absolute inset-0  z-0 h-48"></div>
          <CardHeader className="relative z-10 pb-0">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <Link
                  href="/home"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  ← Back to Home
                </Link>
                <CardTitle className="text-3xl font-bold tracking-tight">
                  Dashboard
                </CardTitle>
                <CardDescription className="text-base mt-1">
                  Welcome back, {session.user?.name?.split(" ")[0] || "User"}
                </CardDescription>
              </div>

              <div className="flex gap-3">
                {!isConnected ? (
                  <Button
                    className="bg-primary hover:bg-primary/90 text-white gap-2 shadow-md"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Cloud className="h-4 w-4" />
                    Connect to Salesforce
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="gap-2 border-primary/20 text-primary hover:bg-primary/5"
                    onClick={disconnectFromSalesforce}
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect Salesforce
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="gap-2 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
             
                </Button>
                <ThemeToggle  className="ml-2" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8 relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <Avatar className="h-20 w-20 ring-4 ring-background shadow-xl">
                <AvatarImage src={session.user?.image || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {session.user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">
                  {session.user?.name || "User"}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {session.user?.email || ""}
                  </p>
                </div>

                {isConnected && (
                  <Badge className="mt-2 bg-emerald-500/90 text-white hover:bg-emerald-500">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Salesforce Connected
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {isConnected ? (
          <Tabs
            defaultValue="overview"
            className="space-y-4"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="organization">Organization</TabsTrigger>
              <TabsTrigger value="account">Account Details</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="shadow-md border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Building className="h-4 w-4 mr-2 text-primary" />
                      Organization
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold truncate">
                      {sfUserInfo?.org_name || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sfUserInfo?.organization_id || "No ID available"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <User className="h-4 w-4 mr-2 text-primary" />
                      User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold truncate">
                      {sfUserInfo?.display_name || "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sfUserInfo?.username || "No username available"}
                    </p>
                  </CardContent>
                </Card>

                <Card className="shadow-md border-0">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-primary" />
                      Instance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold truncate">
                      {sfUserInfo?.instance_url?.replace("https://", "") ||
                        "N/A"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      API v58.0
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Connection Status
                  </CardTitle>
                  <CardDescription>
                    Your Salesforce connection is active and healthy
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <CheckCircle2 className="h-4 w-4 mr-2 text-emerald-500" />
                          <span>Authentication Status</span>
                        </div>
                        <span className="font-medium text-emerald-500">
                          Active
                        </span>
                      </div>
                      <Progress
                        value={100}
                        className="h-2 bg-emerald-100"
                        indicatorClassName="bg-emerald-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2 text-blue-500" />
                          <span>Data Sync</span>
                        </div>
                        <span className="font-medium text-blue-500">Ready</span>
                      </div>
                      <Progress
                        value={100}
                        className="h-2 bg-blue-100"
                        indicatorClassName="bg-blue-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Code2 className="h-4 w-4 mr-2 text-violet-500" />
                          <span>API Access</span>
                        </div>
                        <span className="font-medium text-violet-500">
                          Authorized
                        </span>
                      </div>
                      <Progress
                        value={100}
                        className="h-2 bg-violet-100"
                        indicatorClassName="bg-violet-500"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Last synced: Just now
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-sm"
                    onClick={disconnectFromSalesforce}
                  >
                    <LogOut className="h-3 w-3" />
                    Disconnect
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="organization" className="space-y-4">
              <Card className="shadow-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-primary" />
                    Organization Details
                  </CardTitle>
                  <CardDescription>
                    Information about your Salesforce organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Organization Name
                        </Label>
                        <div className="font-medium text-lg">
                          {sfUserInfo?.org_name || "N/A"}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Organization ID
                        </Label>
                        <div className="font-medium flex items-center gap-2">
                          <Fingerprint className="h-4 w-4 text-primary" />
                          <code className="bg-muted py-1 px-2 rounded text-sm">
                            {sfUserInfo?.organization_id || "N/A"}
                          </code>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Instance URL
                        </Label>
                        <div className="font-medium flex items-center gap-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <a
                            href={sfUserInfo?.instance_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {sfUserInfo?.instance_url || "N/A"}
                          </a>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          API Version
                        </Label>
                        <div className="font-medium flex items-center gap-2">
                          <Code2 className="h-4 w-4 text-primary" />
                          <span>v58.0</span>
                        </div>
                      </div>
                    </div>

                    <Alert className="bg-primary/5 border-primary/20">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      <AlertTitle>Connection Active</AlertTitle>
                      <AlertDescription>
                        Your Salesforce organization connection is active and
                        working properly.
                      </AlertDescription>
                    </Alert>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-4">
              <Card className="shadow-md border-0">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-primary" />
                    Account Information
                  </CardTitle>
                  <CardDescription>
                    Your Salesforce user account details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {sfUserInfo?.display_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3 className="text-lg font-bold">
                          {sfUserInfo?.display_name || "N/A"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {sfUserInfo?.username || "N/A"}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          Email Address
                        </Label>
                        <div className="font-medium flex items-center gap-2">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>{sfUserInfo?.email || "N/A"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">
                          User ID
                        </Label>
                        <div className="font-medium flex items-center gap-2">
                          <Fingerprint className="h-4 w-4 text-primary" />
                          <code className="bg-muted py-1 px-2 rounded text-sm">
                            {sfUserInfo?.user_id || "N/A"}
                          </code>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">Security Status</h4>
                        <p className="text-sm text-muted-foreground">
                          Your connection is secure
                        </p>
                      </div>
                      <Badge className="bg-emerald-500/90 text-white">
                        Protected
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    Connected via OAuth
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-sm"
                    onClick={disconnectFromSalesforce}
                  >
                    <Key className="h-3 w-3" />
                    Manage Access
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          <Card className="shadow-lg border-0 bg-gradient-to-b from-background to-muted/20">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold">
                Welcome to your Dashboard
              </CardTitle>
              <CardDescription className="text-base">
                Connect your Salesforce account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="p-6 bg-primary/5 rounded-full mb-6">
                  <Cloud className="h-16 w-16 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  No Active Connection
                </h3>
                <p className="text-center text-muted-foreground max-w-md mb-8">
                  Connect your Salesforce account to view and manage your
                  organization data
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="px-8 py-6 text-base h-auto font-medium gap-2 shadow-lg"
                  size="lg"
                >
                  <Cloud className="h-5 w-5 mr-1" />
            
                  Connect to Salesforce
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Connect to Salesforce Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Cloud className="h-5 w-5 text-primary" />
              Connect to Salesforce
            </DialogTitle>
            <DialogDescription>
              Enter your Salesforce credentials to establish a connection
            </DialogDescription>
          </DialogHeader>

          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="py-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-center text-muted-foreground mt-2">
                Connecting to Salesforce...
              </p>
            </div>
          )}

          <form onSubmit={handleConnect} className="space-y-4 pt-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  placeholder="your.email@example.com"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="border-input"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Key className="h-3 w-3" />
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="securityToken"
                  className="flex items-center gap-2"
                >
                  <Fingerprint className="h-3 w-3" />
                  Security Token
                </Label>
                <Input
                  id="securityToken"
                  name="securityToken"
                  placeholder="Your security token"
                  value={credentials.securityToken}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can reset your security token in Salesforce by going to
                  Settings → My Personal Information → Reset Security Token
                </p>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isLoading}
              >
                <Cloud className="h-4 w-4" />
                {isLoading ? "Connecting..." : "Connect to Salesforce"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
