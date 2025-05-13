'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Loader2, RefreshCw, Plus, Edit, Trash } from "lucide-react";

const initialAccountState = {
  Name: '',
  Industry: '',
  Phone: '',
  Website: '',
  Type: 'Prospect'
};

// Account industry options
const accountIndustryOptions = [
  'Agriculture',
  'Apparel',
  'Banking',
  'Biotechnology',
  'Chemicals',
  'Communications',
  'Construction',
  'Consulting',
  'Education',
  'Electronics',
  'Energy',
  'Engineering',
  'Entertainment',
  'Environmental',
  'Finance',
  'Food & Beverage',
  'Government',
  'Healthcare',
  'Hospitality',
  'Insurance',
  'Machinery',
  'Manufacturing',
  'Media',
  'Not For Profit',
  'Recreation',
  'Retail',
  'Shipping',
  'Technology',
  'Telecommunications',
  'Transportation',
  'Utilities',
  'Other'
];

// Account type options
const accountTypeOptions = [
  'Analyst',
  'Competitor',
  'Customer',
  'Integrator',
  'Investor',
  'Partner',
  'Press',
  'Prospect',
  'Reseller',
  'Other'
];

const AccountManager = () => {
  // Auth state
  const [instanceUrl, setInstanceUrl] = useState('');
  const [token, setToken] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [accountForm, setAccountForm] = useState(initialAccountState);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentAccountId, setCurrentAccountId] = useState('');

  useEffect(() => {
    const savedAuthData = localStorage.getItem('sfAuthData');
    if (savedAuthData) {
      const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
      setToken(accessToken);
      setInstanceUrl(instanceUrl);
    }
  }, []);

  useEffect(() => {
    if (token && instanceUrl) {
      fetchAccounts();
    }
  }, [token, instanceUrl]);

  const executeQuery = async (query) => {
    try {
      const response = await fetch('/api/salescloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, instanceUrl, query }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Query execution failed');
      return result.records || [];
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  };

  const executeDML = async (operation, objectType, data, id) => {
    try {
      const response = await fetch('/api/salescloud/dml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          instanceUrl,
          operation,
          objectType,
          data,
          id
        }),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Operation failed');
      return result;
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  };

  const fetchAccounts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const records = await executeQuery(
        'SELECT Id, Name, Industry, Phone, Website, Type FROM Account ORDER BY Name ASC LIMIT 50'
      );
      setAccounts(records);
    } catch (err) {
      setError(`Failed to fetch accounts: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const createAccountRecord = async (data) => {
    setIsLoading(true);
    try {
      await executeDML('create', 'Account', data);
      alert("Account created successfully");
      fetchAccounts();
      setAccountForm(initialAccountState);
      setIsAccountDialogOpen(false);
    } catch (err) {
      setError(`Failed to create account: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAccount = async (id, data) => {
    setIsLoading(true);
    try {
      await executeDML('update', 'Account', data, id);
      alert("Account updated successfully");
      fetchAccounts();
      setAccountForm(initialAccountState);
      setIsAccountDialogOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(`Failed to update account: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (id) => {
    if (!confirm("Are you sure you want to delete this account?")) return;

    setIsLoading(true);
    try {
      await executeDML('delete', 'Account', {}, id);
      alert("Account deleted successfully");
      fetchAccounts();
    } catch (err) {
      setError(`Failed to delete account: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountFormChange = (field, value) => {
    setAccountForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAccountSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && currentAccountId) {
      updateAccount(currentAccountId, accountForm);
    } else {
      createAccountRecord(accountForm);
    }
  };

  const editAccount = (acc) => {
    setAccountForm({
      Name: acc.Name || '',
      Industry: acc.Industry || '',
      Phone: acc.Phone || '',
      Website: acc.Website || '',
      Type: acc.Type || 'Prospect'
    });
    setCurrentAccountId(acc.Id);
    setIsEditMode(true);
    setIsAccountDialogOpen(true);
  };

  const resetAccountForm = () => {
    setAccountForm(initialAccountState);
    setCurrentAccountId('');
    setIsEditMode(false);
  };

  if (!token || !instanceUrl) {
    return <div className="p-5">Please connect to Salesforce first.</div>;
  }

  return (
    <div className="p-5 bg-white border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-6">Accounts Manager</h2>
      
      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold"></h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchAccounts} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Refresh</span>
              </Button>
              <Dialog open={isAccountDialogOpen} onOpenChange={(open) => {
                setIsAccountDialogOpen(open);
                if (!open) resetAccountForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsAccountDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Account
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Account' : 'Create New Account'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAccountSubmit}>
                    <div className="grid gap-4 py-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
                        <Input
                          id="name"
                          value={accountForm.Name}
                          onChange={(e) => handleAccountFormChange('Name', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="industry" className="block text-sm font-medium mb-1">Industry</label>
                        <Select 
                          value={accountForm.Industry} 
                          onValueChange={(value) => handleAccountFormChange('Industry', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountIndustryOptions.map(industry => (
                              <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium mb-1">Type</label>
                        <Select 
                          value={accountForm.Type} 
                          onValueChange={(value) => handleAccountFormChange('Type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            {accountTypeOptions.map(type => (
                              <SelectItem key={type} value={type}>{type}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                          id="phone"
                          value={accountForm.Phone}
                          onChange={(e) => handleAccountFormChange('Phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="website" className="block text-sm font-medium mb-1">Website</label>
                        <Input
                          id="website"
                          value={accountForm.Website}
                          onChange={(e) => handleAccountFormChange('Website', e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setIsAccountDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditMode ? 'Update' : 'Create'}
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : accounts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No accounts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Industry</th>
                    <th className="border px-4 py-2 text-left">Type</th>
                    <th className="border px-4 py-2 text-left">Phone</th>
                    <th className="border px-4 py-2 text-left">Website</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((acc) => (
                    <tr key={acc.Id}>
                      <td className="border px-4 py-2">{acc.Name}</td>
                      <td className="border px-4 py-2">{acc.Industry || 'N/A'}</td>
                      <td className="border px-4 py-2">{acc.Type || 'N/A'}</td>
                      <td className="border px-4 py-2">{acc.Phone || 'N/A'}</td>
                      <td className="border px-4 py-2">{acc.Website || 'N/A'}</td>
                      <td className="border px-4 py-2">
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => editAccount(acc)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteAccount(acc.Id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};



export default AccountManager;









// 'use client';

// import React, { useEffect, useState, useCallback } from 'react';
// import { useToast } from "../ui/use-toast";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
// import { Input } from "../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue
// } from "../ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle
// } from "../ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow
// } from "../ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger
// } from "../ui/dropdown-menu";
// import { Badge } from "../ui/badge";
// import { Loader2, RefreshCw, Plus, MoreHorizontal, ExternalLink } from "lucide-react";
// import { cn } from "../../lib/utils";

// // Constants for form and data
// const ACCOUNT_TYPES = {
//   PROSPECT: 'Prospect',
//   CUSTOMER: 'Customer',
//   PARTNER: 'Partner',
//   RESELLER: 'Reseller',
//   COMPETITOR: 'Competitor',
//   INVESTOR: 'Investor',
//   ANALYST: 'Analyst',
//   PRESS: 'Press',
//   INTEGRATOR: 'Integrator',
//   OTHER: 'Other'
// };

// const INDUSTRY_OPTIONS = [
//   'Agriculture',
//   'Apparel',
//   'Banking',
//   'Biotechnology',
//   'Chemicals',
//   'Communications',
//   'Construction',
//   'Consulting',
//   'Education',
//   'Electronics',
//   'Energy',
//   'Engineering',
//   'Entertainment',
//   'Environmental',
//   'Finance',
//   'Food & Beverage',
//   'Government',
//   'Healthcare',
//   'Hospitality',
//   'Insurance',
//   'Machinery',
//   'Manufacturing',
//   'Media',
//   'Not For Profit',
//   'Recreation',
//   'Retail',
//   'Shipping',
//   'Technology',
//   'Telecommunications',
//   'Transportation',
//   'Utilities',
//   'Other'
// ];

// // Initial state for account form
// const INITIAL_ACCOUNT_STATE = {
//   Name: '',
//   Industry: '',
//   Phone: '',
//   Website: '',
//   Type: ACCOUNT_TYPES.PROSPECT
// };

// const AccountManager = () => {
//   // State management
//   const { toast } = useToast();
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');
//   const [accounts, setAccounts] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [accountForm, setAccountForm] = useState(INITIAL_ACCOUNT_STATE);
//   const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentAccountId, setCurrentAccountId] = useState('');
//   const [isConnected, setIsConnected] = useState(false);

//   // Load saved authentication data on component mount
//   useEffect(() => {
//     const loadAuthData = () => {
//       try {
//         const savedAuthData = localStorage.getItem('sfAuthData');
//         if (savedAuthData) {
//           const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//           if (accessToken && instanceUrl) {
//             setToken(accessToken);
//             setInstanceUrl(instanceUrl);
//             setIsConnected(true);
//             return true;
//           }
//         }
//         return false;
//       } catch (err) {
//         console.error('Failed to load auth data:', err);
//         return false;
//       }
//     };

//     loadAuthData();
//   }, []);

//   // Fetch accounts when authentication is available
//   useEffect(() => {
//     if (token && instanceUrl) {
//       fetchAccounts();
//     }
//   }, [token, instanceUrl]);

//   // API functions
//   const executeQuery = useCallback(async (query) => {
//     try {
//       const response = await fetch('/api/salescloud', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ accessToken: token, instanceUrl, query }),
//       });
      
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Query execution failed');
//       return result.records || [];
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   }, [token, instanceUrl]);

//   const executeDML = useCallback(async (operation, objectType, data, id) => {
//     try {
//       const response = await fetch('/api/salescloud/dml', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           accessToken: token,
//           instanceUrl,
//           operation,
//           objectType,
//           data,
//           id
//         }),
//       });
      
//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Operation failed');
//       return result;
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   }, [token, instanceUrl]);

//   // Data fetching function
//   const fetchAccounts = useCallback(async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name, Industry, Phone, Website, Type FROM Account ORDER BY Name ASC LIMIT 50'
//       );
//       setAccounts(records);
//     } catch (err) {
//       setError(`Failed to fetch accounts: ${err.message}`);
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: `Failed to fetch accounts: ${err.message}`,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeQuery, toast]);

//   // CRUD operations
//   const createAccountRecord = useCallback(async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Account', data);
//       toast(
//      "Account created successfully",
//       );
//       fetchAccounts();
//       setAccountForm(INITIAL_ACCOUNT_STATE);
//       setIsAccountDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create account: ${err.message}`);
//       toast( `Failed to create account: ${err.message}`,
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeDML, fetchAccounts, toast]);

//   const updateAccount = useCallback(async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Account', data, id);
//       toast( "Account updated successfully",
//       );
//       fetchAccounts();
//       setAccountForm(INITIAL_ACCOUNT_STATE);
//       setIsAccountDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update account: ${err.message}`);
//       toast(`Failed to update account: ${err.message}`,
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeDML, fetchAccounts, toast]);

//   const deleteAccount = useCallback(async (id) => {
//     setIsLoading(true);
//     try {
//       await executeDML('delete', 'Account', {}, id);
//       toast(
//         "Account deleted successfully",
//       );
//       fetchAccounts();
//     } catch (err) {
//       setError(`Failed to delete account: ${err.message}`);
//       toast(`Failed to delete account: ${err.message}`,
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeDML, fetchAccounts, toast]);

//   // Form handling
//   const handleAccountFormChange = (field, value) => {
//     setAccountForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleAccountSubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentAccountId) {
//       updateAccount(currentAccountId, accountForm);
//     } else {
//       createAccountRecord(accountForm);
//     }
//   };

//   const editAccount = (acc) => {
//     setAccountForm({
//       Name: acc.Name || '',
//       Industry: acc.Industry || '',
//       Phone: acc.Phone || '',
//       Website: acc.Website || '',
//       Type: acc.Type || ACCOUNT_TYPES.PROSPECT
//     });
//     setCurrentAccountId(acc.Id);
//     setIsEditMode(true);
//     setIsAccountDialogOpen(true);
//   };

//   const confirmDelete = (id) => {
//     if (window.confirm("Are you sure you want to delete this account?")) {
//       deleteAccount(id);
//     }
//   };

//   const resetAccountForm = () => {
//     setAccountForm(INITIAL_ACCOUNT_STATE);
//     setCurrentAccountId('');
//     setIsEditMode(false);
//   };

//   // Format website URL for display and linking
//   const formatWebsite = (url) => {
//     if (!url) return 'N/A';
    
//     // Add https:// if not present
//     const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
    
//     // Display just the domain name without protocol
//     const displayUrl = url.replace(/^(https?:\/\/)?(www\.)?/, '');
    
//     return (
//       <a 
//         href={formattedUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="flex items-center text-blue-600 dark:text-blue-400 hover:underline"
//       >
//         {displayUrl}
//         <ExternalLink className="ml-1 h-3 w-3" />
//       </a>
//     );
//   };

//   // Render badge for account type
//   const renderTypeBadge = (type) => {
//     if (!type) return 'N/A';
    
//     const badgeVariants = {
//       [ACCOUNT_TYPES.PROSPECT]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
//       [ACCOUNT_TYPES.CUSTOMER]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//       [ACCOUNT_TYPES.PARTNER]: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
//       [ACCOUNT_TYPES.COMPETITOR]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
//       default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
//     };
    
//     const badgeClass = badgeVariants[type] || badgeVariants.default;
    
//     return (
//       <Badge className={cn("font-medium", badgeClass)}>
//         {type}
//       </Badge>
//     );
//   };

//   if (!isConnected) {
//     return (
//       <Card className="max-w-md mx-auto mt-10">
//         <CardHeader>
//           <CardTitle>Salesforce Connection Required</CardTitle>
//           <CardDescription>
//             Please connect to Salesforce before accessing the Accounts Manager.
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button variant="outline" className="w-full">
//             Connect to Salesforce
//           </Button>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="container py-6 mx-auto">
//       <Card className="border border-border shadow-sm dark:border-slate-800">
//         <CardHeader className="bg-card">
//           <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
//             <div>
//               <CardTitle className="text-2xl font-bold text-foreground">Accounts Manager</CardTitle>
//               <CardDescription className="text-muted-foreground mt-1">
//                 Manage your Salesforce accounts
//               </CardDescription>
//             </div>
//             <div className="flex gap-2">
//               <Button 
//                 variant="outline" 
//                 onClick={fetchAccounts} 
//                 disabled={isLoading}
//                 className="h-9"
//               >
//                 {isLoading ? 
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" /> : 
//                   <RefreshCw className="h-4 w-4 mr-2" />
//                 }
//                 Refresh
//               </Button>
//               <Button 
//                 onClick={() => { 
//                   resetAccountForm();
//                   setIsAccountDialogOpen(true);
//                 }}
//                 className="h-9"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 New Account
//               </Button>
//             </div>
//           </div>
//         </CardHeader>
        
//         <CardContent className="p-5">
//           {error && (
//             <div className="bg-destructive/10 text-destructive rounded-md p-3 mb-5">
//               {error}
//             </div>
//           )}
          
//           {isLoading && accounts.length === 0 ? (
//             <div className="flex justify-center items-center py-16">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <div className="text-center py-16 text-muted-foreground">
//               <p className="text-lg">No accounts found</p>
//               <p className="text-sm mt-2">Create a new account to get started</p>
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   <TableRow className="bg-muted/50">
//                     <TableHead className="font-medium">Name</TableHead>
//                     <TableHead className="font-medium">Industry</TableHead>
//                     <TableHead className="font-medium">Type</TableHead>
//                     <TableHead className="font-medium">Phone</TableHead>
//                     <TableHead className="font-medium">Website</TableHead>
//                     <TableHead className="w-[80px]"></TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {accounts.map((acc) => (
//                     <TableRow 
//                       key={acc.Id} 
//                       className="hover:bg-muted/50 transition-colors"
//                     >
//                       <TableCell className="font-medium">{acc.Name}</TableCell>
//                       <TableCell>{acc.Industry || 'N/A'}</TableCell>
//                       <TableCell>{renderTypeBadge(acc.Type)}</TableCell>
//                       <TableCell>{acc.Phone || 'N/A'}</TableCell>
//                       <TableCell>{formatWebsite(acc.Website)}</TableCell>
//                       <TableCell>
//                         <DropdownMenu>
//                           <DropdownMenuTrigger asChild>
//                             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
//                               <span className="sr-only">Open menu</span>
//                               <MoreHorizontal className="h-4 w-4" />
//                             </Button>
//                           </DropdownMenuTrigger>
//                           <DropdownMenuContent align="end">
//                             <DropdownMenuItem onClick={() => editAccount(acc)}>
//                               Edit
//                             </DropdownMenuItem>
//                             <DropdownMenuItem 
//                               className="text-destructive focus:text-destructive"
//                               onClick={() => confirmDelete(acc.Id)}
//                             >
//                               Delete
//                             </DropdownMenuItem>
//                           </DropdownMenuContent>
//                         </DropdownMenu>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Account Form Dialog */}
//       <Dialog 
//         open={isAccountDialogOpen} 
//         onOpenChange={(open) => {
//           setIsAccountDialogOpen(open);
//           if (!open) resetAccountForm();
//         }}
//       >
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>{isEditMode ? 'Edit Account' : 'Create New Account'}</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleAccountSubmit}>
//             <div className="grid gap-5 py-4">
//               <div className="space-y-2">
//                 <label htmlFor="name" className="text-sm font-medium">
//                   Account Name <span className="text-destructive">*</span>
//                 </label>
//                 <Input
//                   id="name"
//                   value={accountForm.Name}
//                   onChange={(e) => handleAccountFormChange('Name', e.target.value)}
//                   placeholder="Enter account name"
//                   required
//                 />
//               </div>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                 <div className="space-y-2">
//                   <label htmlFor="type" className="text-sm font-medium">
//                     Account Type
//                   </label>
//                   <Select 
//                     value={accountForm.Type} 
//                     onValueChange={(value) => handleAccountFormChange('Type', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select account type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {Object.values(ACCOUNT_TYPES).map(type => (
//                         <SelectItem key={type} value={type}>{type}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
                
//                 <div className="space-y-2">
//                   <label htmlFor="industry" className="text-sm font-medium">
//                     Industry
//                   </label>
//                   <Select 
//                     value={accountForm.Industry} 
//                     onValueChange={(value) => handleAccountFormChange('Industry', value)}
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Select industry" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {INDUSTRY_OPTIONS.map(industry => (
//                         <SelectItem key={industry} value={industry}>{industry}</SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
              
//               <div className="space-y-2">
//                 <label htmlFor="phone" className="text-sm font-medium">
//                   Phone Number
//                 </label>
//                 <Input
//                   id="phone"
//                   type="tel"
//                   value={accountForm.Phone}
//                   onChange={(e) => handleAccountFormChange('Phone', e.target.value)}
//                   placeholder="Enter phone number"
//                 />
//               </div>
              
//               <div className="space-y-2">
//                 <label htmlFor="website" className="text-sm font-medium">
//                   Website
//                 </label>
//                 <Input
//                   id="website"
//                   type="url"
//                   value={accountForm.Website}
//                   onChange={(e) => handleAccountFormChange('Website', e.target.value)}
//                   placeholder="Enter website URL"
//                 />
//               </div>
//             </div>
            
//             <DialogFooter>
//               <Button 
//                 variant="outline" 
//                 type="button" 
//                 onClick={() => setIsAccountDialogOpen(false)}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {isEditMode ? 'Update Account' : 'Create Account'}
//               </Button>
//             </DialogFooter>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default AccountManager;






























// "use client";

// import React, { useEffect, useState, useMemo, useCallback } from 'react';
// import {
//   flexRender,
//   getCoreRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { Button } from "../ui/button";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardFooter,
// } from "../ui/card";
// import { Input } from "../ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../ui/select";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "../ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import { Badge } from "../ui/badge";
// import { Alert, AlertDescription } from "../ui/alert";
// import {
//   Loader2,
//   RefreshCw,
//   Plus,
//   Edit,
//   Trash,
//   ArrowUpDown,
//   AlertCircle,
//   Globe,
//   Phone,
//   Building,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { toast } from 'sonner';

// // Initial form state
// const initialAccountState = {
//   Name: '',
//   Industry: '',
//   Phone: '',
//   Website: '',
//   Type: 'Prospect'
// };

// // Account industry options
// const accountIndustryOptions = [
//   'Agriculture',
//   'Apparel',
//   'Banking',
//   'Biotechnology',
//   'Chemicals',
//   'Communications',
//   'Construction',
//   'Consulting',
//   'Education',
//   'Electronics',
//   'Energy',
//   'Engineering',
//   'Entertainment',
//   'Environmental',
//   'Finance',
//   'Food & Beverage',
//   'Government',
//   'Healthcare',
//   'Hospitality',
//   'Insurance',
//   'Machinery',
//   'Manufacturing',
//   'Media',
//   'Not For Profit',
//   'Recreation',
//   'Retail',
//   'Shipping',
//   'Technology',
//   'Telecommunications',
//   'Transportation',
//   'Utilities',
//   'Other'
// ];

// // Account type options
// const accountTypeOptions = [
//   'Analyst',
//   'Competitor',
//   'Customer',
//   'Integrator',
//   'Investor',
//   'Partner',
//   'Press',
//   'Prospect',
//   'Reseller',
//   'Other'
// ];

// // Get badge variant based on account type
// const getTypeVariant = (type) => {
//   const variantMap = {
//     'Customer': 'success',
//     'Prospect': 'default',
//     'Partner': 'secondary',
//     'Competitor': 'destructive',
//     'Investor': 'outline'
//   };
  
//   return variantMap[type] || 'outline';
// };

// const AccountManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');

//   // Data state
//   const [accounts, setAccounts] = useState([]);

//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [sorting, setSorting] = useState([]);

//   // Form state
//   const [accountForm, setAccountForm] = useState(initialAccountState);
//   const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentAccountId, setCurrentAccountId] = useState('');

//   // Define columns for TanStack Table
//   const columns = useMemo(
//     () => [
//       {
//         accessorKey: 'Name',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Name
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-1 p-0 h-7 w-7"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               <ArrowUpDown className="h-3 w-3" />
//             </Button>
//           </div>
//         ),
//       },
//       {
//         accessorKey: 'Industry',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Industry
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-1 p-0 h-7 w-7"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               <ArrowUpDown className="h-3 w-3" />
//             </Button>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const industry = row.getValue('Industry');
//           return industry ? (
//             <div className="flex items-center">
//               <Building className="h-4 w-4 text-muted-foreground mr-2" />
//               <span>{industry}</span>
//             </div>
//           ) : (
//             <span className="text-muted-foreground">N/A</span>
//           );
//         },
//       },
//       {
//         accessorKey: 'Type',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Type
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-1 p-0 h-7 w-7"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               <ArrowUpDown className="h-3 w-3" />
//             </Button>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const type = row.getValue('Type');
//           return type ? (
//             <Badge variant={getTypeVariant(type)}>{type}</Badge>
//           ) : (
//             <Badge variant="outline">Unknown</Badge>
//           );
//         },
//       },
//       {
//         accessorKey: 'Phone',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Phone
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-1 p-0 h-7 w-7"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               <ArrowUpDown className="h-3 w-3" />
//             </Button>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const phone = row.getValue('Phone');
//           return phone ? (
//             <div className="flex items-center">
//               <Phone className="h-4 w-4 text-muted-foreground mr-2" />
//               <span>{phone}</span>
//             </div>
//           ) : (
//             <span className="text-muted-foreground">N/A</span>
//           );
//         },
//       },
//       {
//         accessorKey: 'Website',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Website
//             <Button
//               variant="ghost"
//               size="sm"
//               className="ml-1 p-0 h-7 w-7"
//               onClick={() =>
//                 column.toggleSorting(column.getIsSorted() === "asc")
//               }
//             >
//               <ArrowUpDown className="h-3 w-3" />
//             </Button>
//           </div>
//         ),
//         cell: ({ row }) => {
//           const website = row.getValue('Website');
//           return website ? (
//             <div className="flex items-center">
//               <Globe className="h-4 w-4 text-muted-foreground mr-2" />
//               <span>{website}</span>
//             </div>
//           ) : (
//             <span className="text-muted-foreground">N/A</span>
//           );
//         },
//       },
//       {
//         id: 'actions',
//         cell: ({ row }) => {
//           const account = row.original;

//           return (
//             <div className="flex items-center justify-end space-x-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => editAccount(account)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Edit account</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => deleteAccount(account.Id)}
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete account</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//           );
//         },
//       },
//     ],
//     []
//   );

//   // Initialize TanStack Table
//   const table = useReactTable({
//     data: accounts,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     state: {
//       sorting,
//     },
//     onSortingChange: setSorting,
//     initialState: {
//       pagination: {
//         pageSize: 10,
//       },
//     },
//   });

//   // Load auth data from local storage
//   useEffect(() => {
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (savedAuthData) {
//       const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//       setToken(accessToken);
//       setInstanceUrl(instanceUrl);
//     }
//   }, []);

//   // Load data when auth is available
//   useEffect(() => {
//     if (token && instanceUrl) {
//       fetchAccounts();
//     }
//   }, [token, instanceUrl]);

//   // Query execution helper
//   // const executeQuery = async (query) => {
//   //   try {
//   //     const response = await fetch('/api/salescloud', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ accessToken: token, instanceUrl, query }),
//   //     });

//   //     const result = await response.json();
//   //     if (!response.ok)
//   //       throw new Error(result.error || 'Query execution failed');
//   //     return result.records || [];
//   //   } catch (err) {
//   //     throw new Error(err.message || 'Unknown error');
//   //   }
//   // };

//   const executeQuery = useCallback(async (query) => {
//     if (!token || !instanceUrl) {
//       throw new Error("Authentication data is missing");
//     }
    
//     try {
//       const response = await fetch('/api/salescloud', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ accessToken: token, instanceUrl, query }),
//       });
  
//       const result = await response.json();
//       if (!response.ok)
//         throw new Error(result.error || 'Query execution failed');
//       return result.records || [];
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   }, [token, instanceUrl]);
  

//   // Execute DML operation
//   // const executeDML = async (operation, objectType, data, id) => {
//   //   try {
//   //     const response = await fetch('/api/salescloud/dml', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({
//   //         accessToken: token,
//   //         instanceUrl,
//   //         operation,
//   //         objectType,
//   //         data,
//   //         id,
//   //       }),
//   //     });

//   //     const result = await response.json();
//   //     if (!response.ok) throw new Error(result.error || 'Operation failed');
//   //     return result;
//   //   } catch (err) {
//   //     throw new Error(err.message || 'Unknown error');
//   //   }
//   // };
// // Execute DML operation - memoized with useCallback
// const executeDML = useCallback(async (operation, objectType, data, id) => {
//   if (!token || !instanceUrl) {
//     throw new Error("Authentication data is missing");
//   }
  
//   try {
//     const response = await fetch('/api/salescloud/dml', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         accessToken: token,
//         instanceUrl: instanceUrl,
//         operation,
//         objectType,
//         data,
//         id,
//       }),
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.error || 'Operation failed');
//     return result;
//   } catch (err) {
//     throw new Error(err.message || 'Unknown error');
//   }
// }, [token, instanceUrl]);

//   // Data fetching functions
//   // const fetchAccounts = async () => {
//   //   setIsLoading(true);
//   //   setError('');
//   //   try {
//   //     const records = await executeQuery(
//   //       'SELECT Id, Name, Industry, Phone, Website, Type FROM Account ORDER BY Name ASC LIMIT 50'
//   //     );
//   //     setAccounts(records);
//   //     toast(`Successfully loaded ${records.length} accounts.`);
//   //   } catch (err) {
//   //     setError(`Failed to fetch accounts: ${err.message}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   const fetchAccounts = useCallback(async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name, Industry, Phone, Website, Type FROM Account ORDER BY Name ASC LIMIT 50'
//       );
//       setAccounts(records);
//       toast.success(`Successfully loaded ${records.length} accounts.`);
//     } catch (err) {
//       setError(`Failed to fetch accounts: ${err.message}`);
//       toast.error(`Failed to fetch accounts: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeQuery]);

//   // CRUD operations for Account
//   const createAccountRecord = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Account', data);
//       toast("Account created successfully");
//       fetchAccounts();
//       setAccountForm(initialAccountState);
//       setIsAccountDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create account: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateAccount = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Account', data, id);
//       toast("Account updated successfully");
//       fetchAccounts();
//       setAccountForm(initialAccountState);
//       setIsAccountDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update account: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };


  
//   const deleteAccount = async (id) => {
//     if (!confirm("Are you sure you want to delete this account?")) return;

//     setIsLoading(true);
//     setError('');
    
//     try {
//       // console.log("Attempting to delete account with ID:", id);
      
//       if (!token || !instanceUrl) {
//         throw new Error("Authentication data is missing");
//       }
      
//       const response = await fetch('/api/salescloud/dml', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           accessToken: token,
//           instanceUrl: instanceUrl,
//           operation: 'delete',
//           objectType: 'Account',
//           id: id
//         }),
//       });

//       const result = await response.json();
//       // console.log("Delete response:", result);
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Delete operation failed');
//       }
      
//       toast("Account deleted successfully");
//       fetchAccounts();
//     } catch (err) {
//       console.error("Delete operation failed:", err);
//       setError(`Failed to delete account: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Form handling
  

  
//   // const deleteAccount = useCallback(async (id) => {
//   //   if (!confirm("Are you sure you want to delete this account?")) return;
    
//   //   // Check authentication before proceeding
//   //   if (!token || !instanceUrl) {
//   //     toast.error("Authentication data is missing. Please reconnect to Salesforce.");
//   //     setError("Authentication data is missing. Please reconnect to Salesforce.");
//   //     return;
//   //   }
  
//   //   setIsLoading(true);
//   //   setError('');
    
//   //   try {
//   //     console.log("Attempting to delete account with ID:", id);
      
//   //     // Use the executeDML helper with correct auth data
//   //     await executeDML('delete', 'Account', {}, id);
      
//   //     toast.success("Account deleted successfully");
//   //     fetchAccounts();
//   //   } catch (err) {
//   //     console.error("Delete operation failed:", err);
//   //     setError(`Failed to delete account: ${err.message}`);
//   //     toast.error(`Failed to delete account: ${err.message}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // }, [token, instanceUrl, executeDML, fetchAccounts]);



// //   const deleteAccount = useCallback(async (id) => {
// //   // First check if we have valid authentication data before proceeding
// //   if (!token || !instanceUrl) {
// //     toast.error("Authentication data is missing. Please reconnect to Salesforce.");
// //     setError("Authentication data is missing. Please reconnect to Salesforce.");
// //     return;
// //   }

// //   // Confirm deletion with the user
// //   if (!confirm("Are you sure you want to delete this account?")) return;
  
// //   setIsLoading(true);
// //   setError('');
  
// //   try {
// //     console.log("Attempting to delete account with ID:", id);
    
// //     // Use the executeDML helper with correct parameters
// //     await executeDML('delete', 'Account', null, id);
    
// //     toast.success("Account deleted successfully");
// //     await fetchAccounts(); // Make sure to await the fetch to prevent race conditions
// //   } catch (err) {
// //     console.error("Delete operation failed:", err);
// //     setError(`Failed to delete account: ${err.message}`);
// //     toast.error(`Failed to delete account: ${err.message}`);
// //   } finally {
// //     setIsLoading(false);
// //   }
// // }, [token, instanceUrl, executeDML, fetchAccounts]);


//   const handleAccountFormChange = (field, value) => {
//     setAccountForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleAccountSubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentAccountId) {
//       updateAccount(currentAccountId, accountForm);
//     } else {
//       createAccountRecord(accountForm);
//     }
//   };

//   const editAccount = (acc) => {
//     setAccountForm({
//       Name: acc.Name || '',
//       Industry: acc.Industry || '',
//       Phone: acc.Phone || '',
//       Website: acc.Website || '',
//       Type: acc.Type || 'Prospect'
//     });
//     setCurrentAccountId(acc.Id);
//     setIsEditMode(true);
//     setIsAccountDialogOpen(true);
//   };

//   // Reset forms
//   const resetAccountForm = () => {
//     setAccountForm(initialAccountState);
//     setCurrentAccountId('');
//     setIsEditMode(false);
//   };

//   if (!token || !instanceUrl) {
//     return (
//       <Card className="mx-auto max-w-md mt-10">
//         <CardHeader>
//           <CardTitle>Connection Required</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground">
//             Please connect to Salesforce to use the Account Manager.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-5 rounded-lg transition-colors">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Account Manager
//         </h2>
//         <p className="text-muted-foreground mt-2">
//           Organize, track, and manage your business accounts in one place.
//         </p>
//       </div>

//       {error && (
//         <Alert variant="destructive" className="mb-6">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription className="ml-2">{error}</AlertDescription>
//         </Alert>
//       )}

//       <Card className="shadow-sm">
//         <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
//           <CardTitle className="text-xl">Accounts</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchAccounts}
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <Loader2 className="h-4 w-4 animate-spin mr-2" />
//               ) : (
//                 <RefreshCw className="h-4 w-4 mr-2" />
//               )}
//               Refresh
//             </Button>

//             <Dialog
//               open={isAccountDialogOpen}
//               onOpenChange={(open) => {
//                 setIsAccountDialogOpen(open);
//                 if (!open) resetAccountForm();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Account
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {isEditMode ? 'Edit Account' : 'Create New Account'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleAccountSubmit}>
//                   <div className="grid gap-4 py-4">
//                     <div>
//                       <label
//                         htmlFor="name"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Name *
//                       </label>
//                       <Input
//                         id="name"
//                         value={accountForm.Name}
//                         onChange={(e) =>
//                           handleAccountFormChange('Name', e.target.value)
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="industry"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Industry
//                       </label>
//                       <Select
//                         value={accountForm.Industry}
//                         onValueChange={(value) =>
//                           handleAccountFormChange('Industry', value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select industry" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {accountIndustryOptions.map((industry) => (
//                             <SelectItem key={industry} value={industry}>
//                               {industry}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="type"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Type
//                       </label>
//                       <Select
//                         value={accountForm.Type}
//                         onValueChange={(value) =>
//                           handleAccountFormChange('Type', value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select account type" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {accountTypeOptions.map((type) => (
//                             <SelectItem key={type} value={type}>
//                               {type}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="phone"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Phone
//                       </label>
//                       <Input
//                         id="phone"
//                         value={accountForm.Phone}
//                         onChange={(e) =>
//                           handleAccountFormChange('Phone', e.target.value)
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="website"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Website
//                       </label>
//                       <Input
//                         id="website"
//                         value={accountForm.Website}
//                         onChange={(e) =>
//                           handleAccountFormChange('Website', e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => setIsAccountDialogOpen(false)}
//                     >
//                       Cancel
//                     </Button>
//                     <Button type="submit" disabled={isLoading}>
//                       {isLoading && (
//                         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       )}
//                       {isEditMode ? 'Update' : 'Create'}
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading && accounts.length === 0 ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : accounts.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <div className="mb-3">No accounts found.</div>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsAccountDialogOpen(true)}
//                 className="mt-2"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create your first account
//               </Button>
//             </div>
//           ) : (
//             <div className="rounded-md border">
//               <Table>
//                 <TableHeader>
//                   {table.getHeaderGroups().map((headerGroup) => (
//                     <TableRow key={headerGroup.id}>
//                       {headerGroup.headers.map((header) => (
//                         <TableHead key={header.id}>
//                           {header.isPlaceholder
//                             ? null
//                             : flexRender(
//                                 header.column.columnDef.header,
//                                 header.getContext()
//                               )}
//                         </TableHead>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableHeader>
//                 <TableBody>
//                   {table.getRowModel().rows?.length ? (
//                     table.getRowModel().rows.map((row) => (
//                       <TableRow
//                         key={row.id}
//                         data-state={row.getIsSelected() && "selected"}
//                         className={
//                           row.original.Type === 'Customer'
//                             ? "bg-green-50 dark:bg-green-950/20"
//                             : row.original.Type === 'Competitor'
//                             ? "bg-red-50 dark:bg-red-950/20"
//                             : ""
//                         }
//                       >
//                         {row.getVisibleCells().map((cell) => (
//                           <TableCell key={cell.id}>
//                             {flexRender(
//                               cell.column.columnDef.cell,
//                               cell.getContext()
//                             )}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     ))
//                   ) : (
//                     <TableRow>
//                       <TableCell
//                         colSpan={columns.length}
//                         className="h-24 text-center"
//                       >
//                         No results.
//                       </TableCell>
//                     </TableRow>
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//         {accounts.length > 0 && (
//           <CardFooter className="flex items-center justify-between pt-4 border-t">
//             <div className="flex-1 text-sm text-muted-foreground">
//               Showing{" "}
//               {table.getState().pagination.pageIndex *
//                 table.getState().pagination.pageSize +
//                 1}{" "}
//               to{" "}
//               {Math.min(
//                 (table.getState().pagination.pageIndex + 1) *
//                   table.getState().pagination.pageSize,
//                 accounts.length
//               )}{" "}
//               of {accounts.length} accounts
//             </div>
//             <div className="flex items-center space-x-6 lg:space-x-8">
//               <div className="flex items-center space-x-2">
//                 <p className="text-sm font-medium">Rows per page</p>
//                 <Select
//                   value={`${table.getState().pagination.pageSize}`}
//                   onValueChange={(value) => {
//                     table.setPageSize(Number(value));
//                   }}
//                 >
//                   <SelectTrigger className="h-8 w-[70px]">
//                     <SelectValue
//                       placeholder={table.getState().pagination.pageSize}
//                     />
//                   </SelectTrigger>
//                   <SelectContent side="top">
//                     {[5, 10, 20, 30, 40, 50].map((pageSize) => (
//                       <SelectItem key={pageSize} value={`${pageSize}`}>
//                         {pageSize}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.setPageIndex(0)}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   <span className="sr-only">Go to first page</span>
//                   <ChevronsLeft className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.previousPage()}
//                   disabled={!table.getCanPreviousPage()}
//                 >
//                   <span className="sr-only">Go to previous page</span>
//                   <ChevronLeft className="h-4 w-4" />
//                 </Button>
//                 <div className="flex items-center gap-1">
//                   <span className="text-sm">Page</span>
//                   <strong className="text-sm">
//                     {table.getState().pagination.pageIndex + 1} of{" "}
//                     {table.getPageCount()}
//                   </strong>
//                 </div>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.nextPage()}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   <span className="sr-only">Go to next page</span>
//                   <ChevronRight className="h-4 w-4" />
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   className="h-8 w-8 p-0"
//                   onClick={() => table.setPageIndex(table.getPageCount() - 1)}
//                   disabled={!table.getCanNextPage()}
//                 >
//                   <span className="sr-only">Go to last page</span>
//                   <ChevronsRight className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </CardFooter>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default AccountManager;