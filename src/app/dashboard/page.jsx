
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Cloud, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { useSalesforce } from "../../context/salesforcecontet";

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
    setCredentials
  } = useSalesforce();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

  const handleConnect = async (e) => {
    e.preventDefault();
    setFormError('');

    try {
      await connectToSalesforce(credentials);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Login failed:', error);
      if (error instanceof Error) {
        setFormError(error.message || 'Connection failed');
      } else {
        setFormError('Connection failed');
      }
    }
  };

  if (status === "loading") {
    return (
      <div>
      <div className="flex min-h-screen items-center justify-center"></div>
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="shadow-md mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">Dashboard</CardTitle>
            <CardDescription>Welcome to your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-primary/20">
                  <AvatarImage src={session.user?.image || ""} />
                  <AvatarFallback className="bg-primary/10 text-primary">{session.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{session.user?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{session.user?.email || ""}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                {!isConnected ? (
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white gap-2"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Cloud className="h-4 w-4" />
                    Connect to Salesforce
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    className="gap-2"
                    onClick={disconnectFromSalesforce}
                  >
                    <LogOut className="h-4 w-4" />
                    Disconnect Salesforce
                  </Button>
                )}
                
                <Button variant="ghost" className="gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {isConnected ? (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Salesforce Organization</CardTitle>
                <CardDescription>Connected organization details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Badge className="bg-green-500">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Connected
                    </Badge>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Organization Name</Label>
                        <div className="font-medium">{sfUserInfo?.org_name || 'N/A'}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Organization ID</Label>
                        <div className="font-medium text-sm">{sfUserInfo?.organization_id || 'N/A'}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">Instance URL</Label>
                        <div className="font-medium text-sm">{sfUserInfo?.instance_url || 'N/A'}</div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs text-muted-foreground">API Version</Label>
                        <div className="font-medium">v58.0</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Connected user details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <div className="font-medium">{sfUserInfo?.display_name || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Username</Label>
                      <div className="font-medium">{sfUserInfo?.username || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <div className="font-medium">{sfUserInfo?.email || 'N/A'}</div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">User ID</Label>
                      <div className="font-medium text-sm">{sfUserInfo?.user_id || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Welcome to your Dashboard</CardTitle>
              <CardDescription>
                Connect your Salesforce account to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Cloud className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Salesforce Connection</h3>
                <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
                  Connect your Salesforce account to view and manage your organization data
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
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
            <DialogTitle>Connect to Salesforce</DialogTitle>
            <DialogDescription>
              Enter your Salesforce credentials to connect
            </DialogDescription>
          </DialogHeader>
          
          {formError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleConnect} className="space-y-4 pt-2">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input 
                  id="username"
                  name="username"
                  placeholder="your.email@example.com" 
                  value={credentials.username}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                <Label htmlFor="securityToken">Security Token</Label>
                <Input 
                  id="securityToken"
                  name="securityToken"
                  placeholder="Your security token" 
                  value={credentials.securityToken}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You can reset your security token in Salesforce by going to Settings →
                  My Personal Information → Reset Security Token
                </p>
              </div>
            </div>
            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Connecting...' : 'Connect to Salesforce'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}