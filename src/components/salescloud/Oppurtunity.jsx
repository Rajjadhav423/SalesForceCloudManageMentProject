// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Button } from "../ui/button";
// import { Card, CardContent } from "../ui/card";
// import { Input } from "../ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
// import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
// import { Loader2, RefreshCw, Plus, Edit, Trash } from "lucide-react";

// const initialOpportunityState = {
//   Name: '',
//   StageName: 'Prospecting',
//   CloseDate: new Date().toISOString().split('T')[0],
//   Amount: '0'
// };

// // Opportunity stage options
// const opportunityStageOptions = [
//   'Prospecting',
//   'Qualification',
//   'Needs Analysis',
//   'Value Proposition',
//   'Id. Decision Makers',
//   'Perception Analysis',
//   'Proposal/Price Quote',
//   'Negotiation/Review',
//   'Closed Won',
//   'Closed Lost'
// ];

// const SalesCloudManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');
//   const [opportunities, setOpportunities] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [opportunityForm, setOpportunityForm] = useState(initialOpportunityState);
//   const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentOpportunityId, setCurrentOpportunityId] = useState('');
//   useEffect(() => {
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (savedAuthData) {
//       const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//       setToken(accessToken);
//       setInstanceUrl(instanceUrl);
//     }
//   }, []);
//   useEffect(() => {
//     if (token && instanceUrl) {
//       fetchOpportunities();
//     }
//   }, [token, instanceUrl]);

//   const executeQuery = async (query) => {
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
//   };
//   const executeDML = async (operation, objectType, data, id) => {
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
//   };

//   const fetchOpportunities = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity ORDER BY CloseDate DESC LIMIT 50'
//       );
//       setOpportunities(records);
//     } catch (err) {
//       setError(`Failed to fetch opportunities: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const createOpportunityRecord = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Opportunity', data);
//       alert("Opportunity created successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateOpportunity = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Opportunity', data, id);
//       alert("Opportunity updated successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteOpportunity = async (id) => {
//     if (!confirm("Are you sure you want to delete this opportunity?")) return;

//     setIsLoading(true);
//     try {
//       await executeDML('delete', 'Opportunity', {}, id);
//       alert("Opportunity deleted successfully");
//       fetchOpportunities();
//     } catch (err) {
//       setError(`Failed to delete opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleOpportunityFormChange = (field, value) => {
//     setOpportunityForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleOpportunitySubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentOpportunityId) {
//       updateOpportunity(currentOpportunityId, opportunityForm);
//     } else {
//       createOpportunityRecord(opportunityForm);
//     }
//   };

//   const editOpportunity = (opp) => {
//     setOpportunityForm({
//       Name: opp.Name || '',
//       StageName: opp.StageName || 'Prospecting',
//       CloseDate: opp.CloseDate || new Date().toISOString().split('T')[0],
//       Amount: opp.Amount || '0'
//     });
//     setCurrentOpportunityId(opp.Id);
//     setIsEditMode(true);
//     setIsOpportunityDialogOpen(true);
//   };

//   const resetOpportunityForm = () => {
//     setOpportunityForm(initialOpportunityState);
//     setCurrentOpportunityId('');
//     setIsEditMode(false);
//   };

//   if (!token || !instanceUrl) {
//     return <div className="p-5">Please connect to Salesforce first.</div>;
//   }

//   return (
//     <div className="p-5 bg-white border rounded-md shadow">
//       <h2 className="text-2xl font-bold mb-6">Opportunities Manager</h2>

//       {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}

//       <Card>
//         <CardContent className="p-4">
//           <div className="flex justify-between items-center mb-6">
//             <h3 className="text-xl font-semibold"></h3>
//             <div className="flex gap-2">
//               <Button
//                 variant="outline"
//                 onClick={fetchOpportunities}
//                 disabled={isLoading}
//               >
//                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
//                 <span className="ml-2">Refresh</span>
//               </Button>
//               <Dialog open={isOpportunityDialogOpen} onOpenChange={(open) => {
//                 setIsOpportunityDialogOpen(open);
//                 if (!open) resetOpportunityForm();
//               }}>
//                 <DialogTrigger asChild>
//                   <Button onClick={() => setIsOpportunityDialogOpen(true)}>
//                     <Plus className="h-4 w-4 mr-2" />
//                     New Opportunity
//                   </Button>
//                 </DialogTrigger>
//                 <DialogContent>
//                   <DialogHeader>
//                     <DialogTitle>{isEditMode ? 'Edit Opportunity' : 'Create New Opportunity'}</DialogTitle>
//                   </DialogHeader>
//                   <form onSubmit={handleOpportunitySubmit}>
//                     <div className="grid gap-4 py-4">
//                       <div>
//                         <label htmlFor="name" className="block text-sm font-medium mb-1">Name *</label>
//                         <Input
//                           id="name"
//                           value={opportunityForm.Name}
//                           onChange={(e) => handleOpportunityFormChange('Name', e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="stage" className="block text-sm font-medium mb-1">Stage</label>
//                         <Select
//                           value={opportunityForm.StageName}
//                           onValueChange={(value) => handleOpportunityFormChange('StageName', value)}
//                         >
//                           <SelectTrigger>
//                             <SelectValue placeholder="Select stage" />
//                           </SelectTrigger>
//                           <SelectContent>
//                             {opportunityStageOptions.map(stage => (
//                               <SelectItem key={stage} value={stage}>{stage}</SelectItem>
//                             ))}
//                           </SelectContent>
//                         </Select>
//                       </div>
//                       <div>
//                         <label htmlFor="closeDate" className="block text-sm font-medium mb-1">Close Date</label>
//                         <Input
//                           id="closeDate"
//                           type="date"
//                           value={opportunityForm.CloseDate}
//                           onChange={(e) => handleOpportunityFormChange('CloseDate', e.target.value)}
//                           required
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="amount" className="block text-sm font-medium mb-1">Amount</label>
//                         <Input
//                           id="amount"
//                           type="number"
//                           value={opportunityForm.Amount}
//                           onChange={(e) => handleOpportunityFormChange('Amount', e.target.value)}
//                         />
//                       </div>
//                     </div>
//                     <DialogFooter>
//                       <Button variant="outline" type="button" onClick={() => setIsOpportunityDialogOpen(false)}>
//                         Cancel
//                       </Button>
//                       <Button type="submit" disabled={isLoading}>
//                         {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                         {isEditMode ? 'Update' : 'Create'}
//                       </Button>
//                     </DialogFooter>
//                   </form>
//                 </DialogContent>
//               </Dialog>
//             </div>
//           </div>

//           {isLoading ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : opportunities.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">No opportunities found.</div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full table-auto border-collapse">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="border px-4 py-2 text-left">Name</th>
//                     <th className="border px-4 py-2 text-left">Stage</th>
//                     <th className="border px-4 py-2 text-left">Close Date</th>
//                     <th className="border px-4 py-2 text-left">Amount</th>
//                     <th className="border px-4 py-2 text-center">Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {opportunities.map((opp) => (
//                     <tr key={opp.Id}>
//                       <td className="border px-4 py-2">{opp.Name}</td>
//                       <td className="border px-4 py-2">{opp.StageName}</td>
//                       <td className="border px-4 py-2">{opp.CloseDate}</td>
//                       <td className="border px-4 py-2">${parseFloat(opp.Amount || '0').toLocaleString()}</td>
//                       <td className="border px-4 py-2">
//                         <div className="flex justify-center gap-2">
//                           <Button size="sm" variant="outline" onClick={() => editOpportunity(opp)}>
//                             <Edit className="h-4 w-4" />
//                           </Button>
//                           <Button size="sm" variant="outline" onClick={() => deleteOpportunity(opp.Id)}>
//                             <Trash className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SalesCloudManager;



// "use client";

// import React, { useEffect, useState, useMemo } from 'react';
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
// import { useToast } from '../ui/use-toast';
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
//   DollarSign,
//   Calendar,
// } from "lucide-react";

// // Initial form states
// const initialOpportunityState = {
//   Name: '',
//   StageName: 'Prospecting',
//   CloseDate: new Date().toISOString().split('T')[0],
//   Amount: '0',
// };

// // Opportunity stage options
// const opportunityStageOptions = [
//   'Prospecting',
//   'Qualification',
//   'Needs Analysis',
//   'Value Proposition',
//   'Id. Decision Makers',
//   'Perception Analysis',
//   'Proposal/Price Quote',
//   'Negotiation/Review',
//   'Closed Won',
//   'Closed Lost',
// ];

// // Status badge variants
// const getStageVariant = (stage) => {
//   if (stage === 'Closed Won') return 'success';
//   if (stage === 'Closed Lost') return 'destructive';
//   if (['Negotiation/Review', 'Proposal/Price Quote'].includes(stage))
//     return 'secondary';
//   if (['Prospecting', 'Qualification'].includes(stage)) return 'default';
//   return 'outline';
// };

// const SalesCloudManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');

//   // Data state
//   const [opportunities, setOpportunities] = useState([]);

//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const [error, setError] = useState('');
//   const [sorting, setSorting] = useState([]);

//   // Form state
//   const [opportunityForm, setOpportunityForm] = useState(
//     initialOpportunityState
//   );
//   const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentOpportunityId, setCurrentOpportunityId] = useState('');

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
//         accessorKey: 'StageName',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Stage
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
//           const stage = row.getValue('StageName');
//           return <Badge variant={getStageVariant(stage)}>{stage}</Badge>;
//         },
//       },
//       {
//         accessorKey: 'CloseDate',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Close Date
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
//           const closeDate = new Date(row.getValue('CloseDate'));
//           const today = new Date();

//           // Calculate days difference
//           const diffTime = closeDate - today;
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//           // Format date
//           const formattedDate = closeDate.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//           });

//           return (
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//               <span>{formattedDate}</span>
//               {diffDays < 0 ? (
//                 <Badge variant="destructive" className="ml-2 text-xs">
//                   Overdue
//                 </Badge>
//               ) : diffDays < 7 ? (
//                 <Badge variant="secondary" className="ml-2 text-xs">
//                   Soon
//                 </Badge>
//               ) : null}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'Amount',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Amount
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
//           const amount = parseFloat(row.getValue('Amount') || '0');
//           const formatted = new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'USD',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//           }).format(amount);

//           return (
//             <div className="flex items-center">
//               <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
//               <span
//                 className={
//                   amount > 50000
//                     ? "font-medium text-green-600 dark:text-green-400"
//                     : ""
//                 }
//               >
//                 {formatted}
//               </span>
//             </div>
//           );
//         },
//       },
//       {
//         id: 'actions',
//         cell: ({ row }) => {
//           const opportunity = row.original;
//           const isClosed = opportunity.StageName.startsWith('Closed');

//           return (
//             <div className="flex items-center justify-end space-x-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => editOpportunity(opportunity)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Edit opportunity</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => deleteOpportunity(opportunity.Id)}
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete opportunity</TooltipContent>
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
//     data: opportunities,
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
//       fetchOpportunities();
//     }
//   }, [token, instanceUrl]);

//   // Query execution helper
//   const executeQuery = async (query) => {
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
//   };

//   // Execute DML operation
//   const executeDML = async (operation, objectType, data, id) => {
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
//           id,
//         }),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Operation failed');
//       return result;
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   };

//   // Data fetching functions
//   const fetchOpportunities = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity ORDER BY CloseDate DESC LIMIT 50'
//       );
//       setOpportunities(records);
//       toast(`Successfully loaded ${records.length} opportunities.`);
//     } catch (err) {
//       setError(`Failed to fetch opportunities: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // CRUD operations for Opportunity
//   const createOpportunityRecord = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Opportunity', data);
//       toast("Opportunity created successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateOpportunity = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Opportunity', data, id);
//       toast("Opportunity updated successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const deleteOpportunity = async (id) => {
//   //   if (!confirm("Are you sure you want to delete this opportunity?")) return;

//   //   setIsLoading(true);
//   //   try {
//   //     await executeDML('delete', 'Opportunity', {}, id);
//   //     toast("Opportunity deleted successfully");
//   //     fetchOpportunities();
//   //   } catch (err) {
//   //     setError(`Failed to delete opportunity: ${err.message}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
//   const deleteOpportunity = async (id) => {
//     if (!confirm("Are you sure you want to delete this opportunity?")) return;

//     setIsLoading(true);
//     try {
//       await executeDML('delete', 'Opportunity', {}, id);
//       alert("Opportunity deleted successfully");
//       fetchOpportunities();
//     } catch (err) {
//       setError(`Failed to delete opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Form handling
//   const handleOpportunityFormChange = (field, value) => {
//     setOpportunityForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleOpportunitySubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentOpportunityId) {
//       updateOpportunity(currentOpportunityId, opportunityForm);
//     } else {
//       createOpportunityRecord(opportunityForm);
//     }
//   };

//   const editOpportunity = (opp) => {
//     setOpportunityForm({
//       Name: opp.Name || '',
//       StageName: opp.StageName || 'Prospecting',
//       CloseDate: opp.CloseDate || new Date().toISOString().split('T')[0],
//       Amount: opp.Amount || '0',
//     });
//     setCurrentOpportunityId(opp.Id);
//     setIsEditMode(true);
//     setIsOpportunityDialogOpen(true);
//   };

//   // Reset forms
//   const resetOpportunityForm = () => {
//     setOpportunityForm(initialOpportunityState);
//     setCurrentOpportunityId('');
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
//             Please connect to Salesforce to use the Opportunity Manager.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-5 rounded-lg transition-colors">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Opportunity Manager
//         </h2>
//         <p className="text-muted-foreground mt-2">
//           Track, manage and update your sales opportunities in one place.
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
//           <CardTitle className="text-xl">Opportunities</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchOpportunities}
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
//               open={isOpportunityDialogOpen}
//               onOpenChange={(open) => {
//                 setIsOpportunityDialogOpen(open);
//                 if (!open) resetOpportunityForm();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Opportunity
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {isEditMode ? 'Edit Opportunity' : 'Create New Opportunity'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleOpportunitySubmit}>
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
//                         value={opportunityForm.Name}
//                         onChange={(e) =>
//                           handleOpportunityFormChange('Name', e.target.value)
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="stage"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Stage
//                       </label>
//                       <Select
//                         value={opportunityForm.StageName}
//                         onValueChange={(value) =>
//                           handleOpportunityFormChange('StageName', value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select stage" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {opportunityStageOptions.map((stage) => (
//                             <SelectItem key={stage} value={stage}>
//                               {stage}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="closeDate"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Close Date
//                       </label>
//                       <Input
//                         id="closeDate"
//                         type="date"
//                         value={opportunityForm.CloseDate}
//                         onChange={(e) =>
//                           handleOpportunityFormChange(
//                             'CloseDate',
//                             e.target.value
//                           )
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="amount"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Amount
//                       </label>
//                       <Input
//                         id="amount"
//                         type="number"
//                         value={opportunityForm.Amount}
//                         onChange={(e) =>
//                           handleOpportunityFormChange('Amount', e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => setIsOpportunityDialogOpen(false)}
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
//           {isLoading && opportunities.length === 0 ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : opportunities.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <div className="mb-3">No opportunities found.</div>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsOpportunityDialogOpen(true)}
//                 className="mt-2"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create your first opportunity
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
//                           row.original.StageName === 'Closed Won'
//                             ? "bg-green-50/50 dark:bg-green-950/20"
//                             : row.original.StageName === 'Closed Lost'
//                             ? "bg-red-50/50 dark:bg-red-950/20"
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
//         {opportunities.length > 0 && (
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
//                 opportunities.length
//               )}{" "}
//               of {opportunities.length} opportunities
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 Previous
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 Next
//               </Button>
//             </div>
//           </CardFooter>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default SalesCloudManager;



// "use client";

// import React, { useEffect, useState, useMemo } from 'react';
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
//   DollarSign,
//   Calendar,
// } from "lucide-react";

// // Initial form states
// const initialOpportunityState = {
//   Name: '',
//   StageName: 'Prospecting',
//   CloseDate: new Date().toISOString().split('T')[0],
//   Amount: '0',
// };

// // Opportunity stage options
// const opportunityStageOptions = [
//   'Prospecting',
//   'Qualification',
//   'Needs Analysis',
//   'Value Proposition',
//   'Id. Decision Makers',
//   'Perception Analysis',
//   'Proposal/Price Quote',
//   'Negotiation/Review',
//   'Closed Won',
//   'Closed Lost',
// ];

// // Status badge variants
// const getStageVariant = (stage) => {
//   if (stage === 'Closed Won') return 'success';
//   if (stage === 'Closed Lost') return 'destructive';
//   if (['Negotiation/Review', 'Proposal/Price Quote'].includes(stage))
//     return 'secondary';
//   if (['Prospecting', 'Qualification'].includes(stage)) return 'default';
//   return 'outline';
// };

// const SalesCloudManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');

//   // Data state
//   const [opportunities, setOpportunities] = useState([]);

//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [sorting, setSorting] = useState([]);

//   // Form state
//   const [opportunityForm, setOpportunityForm] = useState(
//     initialOpportunityState
//   );
//   const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentOpportunityId, setCurrentOpportunityId] = useState('');

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
//         accessorKey: 'StageName',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Stage
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
//           const stage = row.getValue('StageName');
//           return <Badge variant={getStageVariant(stage)}>{stage}</Badge>;
//         },
//       },
//       {
//         accessorKey: 'CloseDate',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Close Date
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
//           const closeDate = new Date(row.getValue('CloseDate'));
//           const today = new Date();

//           // Calculate days difference
//           const diffTime = closeDate - today;
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//           // Format date
//           const formattedDate = closeDate.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//           });

//           return (
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//               <span>{formattedDate}</span>
//               {diffDays < 0 ? (
//                 <Badge variant="destructive" className="ml-2 text-xs">
//                   Overdue
//                 </Badge>
//               ) : diffDays < 7 ? (
//                 <Badge variant="secondary" className="ml-2 text-xs">
//                   Soon
//                 </Badge>
//               ) : null}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'Amount',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Amount
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
//           const amount = parseFloat(row.getValue('Amount') || '0');
//           const formatted = new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'USD',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//           }).format(amount);

//           return (
//             <div className="flex items-center">
//               <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
//               <span
//                 className={
//                   amount > 50000
//                     ? "font-medium text-green-600 dark:text-green-400"
//                     : ""
//                 }
//               >
//                 {formatted}
//               </span>
//             </div>
//           );
//         },
//       },
//       {
//         id: 'actions',
//         cell: ({ row }) => {
//           const opportunity = row.original;

//           return (
//             <div className="flex items-center justify-end space-x-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => editOpportunity(opportunity)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Edit opportunity</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => deleteOpportunity(opportunity.Id)}
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete opportunity</TooltipContent>
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
//     data: opportunities,
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
//       fetchOpportunities();
//     }
//   }, [token, instanceUrl]);

//   // Query execution helper
//   const executeQuery = async (query) => {
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
//   };

//   // Execute DML operation
//   const executeDML = async (operation, objectType, data, id) => {
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
//           id,
//         }),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Operation failed');
//       return result;
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   };

//   // Data fetching functions
//   const fetchOpportunities = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity ORDER BY CloseDate DESC LIMIT 50'
//       );
//       setOpportunities(records);
//       // Using alert instead of toast as in the original code
//       alert(`Successfully loaded ${records.length} opportunities.`);
//     } catch (err) {
//       setError(`Failed to fetch opportunities: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // CRUD operations for Opportunity
//   const createOpportunityRecord = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Opportunity', data);
//       alert("Opportunity created successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateOpportunity = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Opportunity', data, id);
//       alert("Opportunity updated successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteOpportunity = async (id) => {
//     if (!confirm("Are you sure you want to delete this opportunity?")) return;

//     setIsLoading(true);
//     try {
//       await executeDML('delete', 'Opportunity', {}, id);
//       alert("Opportunity deleted successfully");
//       fetchOpportunities();
//     } catch (err) {
//       setError(`Failed to delete opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };
  

//   // Form handling
//   const handleOpportunityFormChange = (field, value) => {
//     setOpportunityForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleOpportunitySubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentOpportunityId) {
//       updateOpportunity(currentOpportunityId, opportunityForm);
//     } else {
//       createOpportunityRecord(opportunityForm);
//     }
//   };

//   const editOpportunity = (opp) => {
//     setOpportunityForm({
//       Name: opp.Name || '',
//       StageName: opp.StageName || 'Prospecting',
//       CloseDate: opp.CloseDate || new Date().toISOString().split('T')[0],
//       Amount: opp.Amount || '0',
//     });
//     setCurrentOpportunityId(opp.Id);
//     setIsEditMode(true);
//     setIsOpportunityDialogOpen(true);
//   };

//   // Reset forms
//   const resetOpportunityForm = () => {
//     setOpportunityForm(initialOpportunityState);
//     setCurrentOpportunityId('');
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
//             Please connect to Salesforce to use the Opportunity Manager.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-5 rounded-lg transition-colors">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Opportunity Manager
//         </h2>
//         <p className="text-muted-foreground mt-2">
//           Track, manage and update your sales opportunities in one place.
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
//           <CardTitle className="text-xl">Opportunities</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchOpportunities}
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
//               open={isOpportunityDialogOpen}
//               onOpenChange={(open) => {
//                 setIsOpportunityDialogOpen(open);
//                 if (!open) resetOpportunityForm();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Opportunity
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {isEditMode ? 'Edit Opportunity' : 'Create New Opportunity'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleOpportunitySubmit}>
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
//                         value={opportunityForm.Name}
//                         onChange={(e) =>
//                           handleOpportunityFormChange('Name', e.target.value)
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="stage"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Stage
//                       </label>
//                       <Select
//                         value={opportunityForm.StageName}
//                         onValueChange={(value) =>
//                           handleOpportunityFormChange('StageName', value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select stage" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {opportunityStageOptions.map((stage) => (
//                             <SelectItem key={stage} value={stage}>
//                               {stage}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="closeDate"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Close Date
//                       </label>
//                       <Input
//                         id="closeDate"
//                         type="date"
//                         value={opportunityForm.CloseDate}
//                         onChange={(e) =>
//                           handleOpportunityFormChange(
//                             'CloseDate',
//                             e.target.value
//                           )
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="amount"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Amount
//                       </label>
//                       <Input
//                         id="amount"
//                         type="number"
//                         value={opportunityForm.Amount}
//                         onChange={(e) =>
//                           handleOpportunityFormChange('Amount', e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => setIsOpportunityDialogOpen(false)}
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
//           {isLoading && opportunities.length === 0 ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : opportunities.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <div className="mb-3">No opportunities found.</div>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsOpportunityDialogOpen(true)}
//                 className="mt-2"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create your first opportunity
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
//                           row.original.StageName === 'Closed Won'
//                             ? "bg-green-50 dark:bg-green-950/20"
//                             : row.original.StageName === 'Closed Lost'
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
//         {opportunities.length > 0 && (
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
//                 opportunities.length
//               )}{" "}
//               of {opportunities.length} opportunities
//             </div>
//             <div className="flex items-center space-x-2">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.previousPage()}
//                 disabled={!table.getCanPreviousPage()}
//               >
//                 Previous
//               </Button>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={() => table.nextPage()}
//                 disabled={!table.getCanNextPage()}
//               >
//                 Next
//               </Button>
//             </div>
//           </CardFooter>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default SalesCloudManager;



// "use client";

// import React, { useEffect, useState, useMemo } from 'react';
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
//   DollarSign,
//   Calendar,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { toast } from 'sonner';

// // Initial form states
// const initialOpportunityState = {
//   Name: '',
//   StageName: 'Prospecting',
//   CloseDate: new Date().toISOString().split('T')[0],
//   Amount: '0',
// };

// // Opportunity stage options
// const opportunityStageOptions = [
//   'Prospecting',
//   'Qualification',
//   'Needs Analysis',
//   'Value Proposition',
//   'Id. Decision Makers',
//   'Perception Analysis',
//   'Proposal/Price Quote',
//   'Negotiation/Review',
//   'Closed Won',
//   'Closed Lost',
// ];

// // Status badge variants
// const getStageVariant = (stage) => {
//   if (stage === 'Closed Won') return 'success';
//   if (stage === 'Closed Lost') return 'destructive';
//   if (['Negotiation/Review', 'Proposal/Price Quote'].includes(stage))
//     return 'secondary';
//   if (['Prospecting', 'Qualification'].includes(stage)) return 'default';
//   return 'outline';
// };

// const SalesCloudManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');

//   // Data state
//   const [opportunities, setOpportunities] = useState([]);

//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [sorting, setSorting] = useState([]);

//   // Form state
//   const [opportunityForm, setOpportunityForm] = useState(
//     initialOpportunityState
//   );
//   const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentOpportunityId, setCurrentOpportunityId] = useState('');

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
//         accessorKey: 'StageName',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Stage
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
//           const stage = row.getValue('StageName');
//           return <Badge variant={getStageVariant(stage)}>{stage}</Badge>;
//         },
//       },
//       {
//         accessorKey: 'CloseDate',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Close Date
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
//           const closeDate = new Date(row.getValue('CloseDate'));
//           const today = new Date();

//           // Calculate days difference
//           const diffTime = closeDate - today;
//           const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

//           // Format date
//           const formattedDate = closeDate.toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//           });

//           return (
//             <div className="flex items-center gap-2">
//               <Calendar className="h-4 w-4 text-muted-foreground" />
//               <span>{formattedDate}</span>
//               {diffDays < 0 ? (
//                 <Badge variant="destructive" className="ml-2 text-xs">
//                   Overdue
//                 </Badge>
//               ) : diffDays < 7 ? (
//                 <Badge variant="secondary" className="ml-2 text-xs">
//                   Soon
//                 </Badge>
//               ) : null}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'Amount',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Amount
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
//           const amount = parseFloat(row.getValue('Amount') || '0');
//           const formatted = new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: 'USD',
//             minimumFractionDigits: 0,
//             maximumFractionDigits: 0,
//           }).format(amount);

//           return (
//             <div className="flex items-center">
//               <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
//               <span
//                 className={
//                   amount > 50000
//                     ? "font-medium text-green-600 dark:text-green-400"
//                     : ""
//                 }
//               >
//                 {formatted}
//               </span>
//             </div>
//           );
//         },
//       },
//       {
//         id: 'actions',
//         cell: ({ row }) => {
//           const opportunity = row.original;

//           return (
//             <div className="flex items-center justify-end space-x-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => editOpportunity(opportunity)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Edit opportunity</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => deleteOpportunity(opportunity.Id)}
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete opportunity</TooltipContent>
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
//     data: opportunities,
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
//       fetchOpportunities();
//     }
//   }, [token, instanceUrl]);

//   // Query execution helper
//   const executeQuery = async (query) => {
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
//   };

//   // Execute DML operation
//   const executeDML = async (operation, objectType, data, id) => {
//     try {

//       const {authData}=localStorage.getItem('sfAuthData')
//       const { accessToken, instanceUrl } = JSON.parse(authData);
//       if (!accessToken || !instanceUrl) { 
//         console.error("Authentication data is missing");
//         return; 
//       }
//       const response = await fetch('/api/salescloud/dml', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//            accessToken,
//           instanceUrl,
//           operation,
//           objectType,
//           data,
//           id,
//         }),
//       });

//       const result = await response.json();
//       if (!response.ok) throw new Error(result.error || 'Operation failed');
//       return result;
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   };

//   // Data fetching functions
//   const fetchOpportunities = async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity ORDER BY CloseDate DESC LIMIT 50'
//       );
//       setOpportunities(records);
//       toast(`Successfully loaded ${records.length} opportunities.`);
//     } catch (err) {
//       setError(`Failed to fetch opportunities: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // CRUD operations for Opportunity
//   const createOpportunityRecord = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Opportunity', data);
//       alert("Opportunity created successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateOpportunity = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Opportunity', data, id);
//       alert("Opportunity updated successfully");
//       fetchOpportunities();
//       setOpportunityForm(initialOpportunityState);
//       setIsOpportunityDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteOpportunity = async (id) => {
//     if (!confirm("Are you sure you want to delete this opportunity?")) return;

//     setIsLoading(true);
//     try {
//       await executeDML('delete', 'Opportunity', {}, id);
//       alert("Opportunity deleted successfully");
//       fetchOpportunities();
//     } catch (err) {
//       setError(`Failed to delete opportunity: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // REPLACE your existing deleteOpportunity function with this implementation
// // Don't create a new function declaration - modify the existing one



// // const deleteOpportunity = async (id) => {
// //   if (!confirm("Are you sure you want to delete this opportunity?")) return;

// //   setIsLoading(true);
// //   setError('');
  
// //   try {
// //     console.log("Attempting to delete opportunity with ID:", id);
    
// //     // Check if auth tokens are available
// //     if (!token || !instanceUrl) {
// //       throw new Error("Authentication data is missing");
// //     }
    
// //     // Direct API call instead of using executeDML helper
// //     const response = await fetch('/api/salescloud/dml', {
// //       method: 'POST',
// //       headers: { 'Content-Type': 'application/json' },
// //       body: JSON.stringify({
// //         accessToken: token,
// //         instanceUrl: instanceUrl,
// //         operation: 'delete',
// //         objectType: 'Opportunity',
// //         id: id
// //       }),
// //     });

// //     const result = await response.json();
// //     console.log("Delete response:", result);
    
// //     if (!response.ok) {
// //       throw new Error(result.error || 'Delete operation failed');
// //     }
// //     toast("Opportunity deleted successfully")
// //     fetchOpportunities();
// //   } catch (err) {
// //     console.error("Delete operation failed:", err);
// //     setError(`Failed to delete opportunity: ${err.message}`);
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };

//   // Form handling
//   const handleOpportunityFormChange = (field, value) => {
//     setOpportunityForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleOpportunitySubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentOpportunityId) {
//       updateOpportunity(currentOpportunityId, opportunityForm);
//     } else {
//       createOpportunityRecord(opportunityForm);
//     }
//   };

//   const editOpportunity = (opp) => {
//     setOpportunityForm({
//       Name: opp.Name || '',
//       StageName: opp.StageName || 'Prospecting',
//       CloseDate: opp.CloseDate || new Date().toISOString().split('T')[0],
//       Amount: opp.Amount || '0',
//     });
//     setCurrentOpportunityId(opp.Id);
//     setIsEditMode(true);
//     setIsOpportunityDialogOpen(true);
//   };

//   // Reset forms
//   const resetOpportunityForm = () => {
//     setOpportunityForm(initialOpportunityState);
//     setCurrentOpportunityId('');
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
//             Please connect to Salesforce to use the Opportunity Manager.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-5 rounded-lg transition-colors">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Opportunity Manager
//         </h2>
//         <p className="text-muted-foreground mt-2">
//           Track, manage and update your sales opportunities in one place.
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
//           <CardTitle className="text-xl">Opportunities</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchOpportunities}
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
//               open={isOpportunityDialogOpen}
//               onOpenChange={(open) => {
//                 setIsOpportunityDialogOpen(open);
//                 if (!open) resetOpportunityForm();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Opportunity
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {isEditMode ? 'Edit Opportunity' : 'Create New Opportunity'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleOpportunitySubmit}>
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
//                         value={opportunityForm.Name}
//                         onChange={(e) =>
//                           handleOpportunityFormChange('Name', e.target.value)
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="stage"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Stage
//                       </label>
//                       <Select
//                         value={opportunityForm.StageName}
//                         onValueChange={(value) =>
//                           handleOpportunityFormChange('StageName', value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select stage" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {opportunityStageOptions.map((stage) => (
//                             <SelectItem key={stage} value={stage}>
//                               {stage}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="closeDate"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Close Date
//                       </label>
//                       <Input
//                         id="closeDate"
//                         type="date"
//                         value={opportunityForm.CloseDate}
//                         onChange={(e) =>
//                           handleOpportunityFormChange(
//                             'CloseDate',
//                             e.target.value
//                           )
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="amount"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Amount
//                       </label>
//                       <Input
//                         id="amount"
//                         type="number"
//                         value={opportunityForm.Amount}
//                         onChange={(e) =>
//                           handleOpportunityFormChange('Amount', e.target.value)
//                         }
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => setIsOpportunityDialogOpen(false)}
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
//           {isLoading && opportunities.length === 0 ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : opportunities.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <div className="mb-3">No opportunities found.</div>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsOpportunityDialogOpen(true)}
//                 className="mt-2"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create your first opportunity
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
//                           row.original.StageName === 'Closed Won'
//                             ? "bg-green-50 dark:bg-green-950/20"
//                             : row.original.StageName === 'Closed Lost'
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
//         {opportunities.length > 0 && (
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
//                 opportunities.length
//               )}{" "}
//               of {opportunities.length} opportunities
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

// export default SalesCloudManager;














"use client";

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import {
  Loader2,
  RefreshCw,
  Plus,
  Edit,
  Trash,
  ArrowUpDown,
  AlertCircle,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { toast } from 'sonner';

// Initial form states
const initialOpportunityState = {
  Name: '',
  StageName: 'Prospecting',
  CloseDate: new Date().toISOString().split('T')[0],
  Amount: '0',
};

// Opportunity stage options
const opportunityStageOptions = [
  'Prospecting',
  'Qualification',
  'Needs Analysis',
  'Value Proposition',
  'Id. Decision Makers',
  'Perception Analysis',
  'Proposal/Price Quote',
  'Negotiation/Review',
  'Closed Won',
  'Closed Lost',
];

// Status badge variants
const getStageVariant = (stage) => {
  if (stage === 'Closed Won') return 'success';
  if (stage === 'Closed Lost') return 'destructive';
  if (['Negotiation/Review', 'Proposal/Price Quote'].includes(stage))
    return 'secondary';
  if (['Prospecting', 'Qualification'].includes(stage)) return 'default';
  return 'outline';
};

const SalesCloudManager = () => {
  // Auth state
  const [instanceUrl, setInstanceUrl] = useState('');
  const [token, setToken] = useState('');

  // Data state
  const [opportunities, setOpportunities] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sorting, setSorting] = useState([]);

  // Form state
  const [opportunityForm, setOpportunityForm] = useState(
    initialOpportunityState
  );
  const [isOpportunityDialogOpen, setIsOpportunityDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentOpportunityId, setCurrentOpportunityId] = useState('');

  // Load auth data from local storage
  useEffect(() => {
    const savedAuthData = localStorage.getItem('sfAuthData');
    if (savedAuthData) {
      const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
      setToken(accessToken);
      setInstanceUrl(instanceUrl);
    }
  }, []);

  // Load data when auth is available
  useEffect(() => {
    if (token && instanceUrl) {
      fetchOpportunities();
    }
  }, [token, instanceUrl]);

  // Query execution helper - memoized with useCallback
  const executeQuery = useCallback(async (query) => {
    if (!token || !instanceUrl) {
      throw new Error("Authentication data is missing");
    }
    
    try {
      const response = await fetch('/api/salescloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: token, instanceUrl, query }),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || 'Query execution failed');
      return result.records || [];
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  }, [token, instanceUrl]);

  // Execute DML operation - memoized with useCallback
  const executeDML = useCallback(async (operation, objectType, data, id) => {
    if (!token || !instanceUrl) {
      throw new Error("Authentication data is missing");
    }
    
    try {
      const response = await fetch('/api/salescloud/dml', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          instanceUrl: instanceUrl,
          operation,
          objectType,
          data,
          id,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Operation failed');
      return result;
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  }, [token, instanceUrl]);

  // Data fetching functions
  const fetchOpportunities = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const records = await executeQuery(
        'SELECT Id, Name, StageName, CloseDate, Amount FROM Opportunity ORDER BY CloseDate DESC LIMIT 50'
      );
      setOpportunities(records);
      toast.success(`Successfully loaded ${records.length} opportunities.`);
    } catch (err) {
      setError(`Failed to fetch opportunities: ${err.message}`);
      toast.error(`Failed to fetch opportunities: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [executeQuery]);

  // CRUD operations for Opportunity
  const createOpportunityRecord = useCallback(async (data) => {
    setIsLoading(true);
    try {
      await executeDML('create', 'Opportunity', data);
      toast.success("Opportunity created successfully");
      fetchOpportunities();
      setOpportunityForm(initialOpportunityState);
      setIsOpportunityDialogOpen(false);
    } catch (err) {
      setError(`Failed to create opportunity: ${err.message}`);
      toast.error(`Failed to create opportunity: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [executeDML, fetchOpportunities]);

  const updateOpportunity = useCallback(async (id, data) => {
    setIsLoading(true);
    try {
      await executeDML('update', 'Opportunity', data, id);
      toast.success("Opportunity updated successfully");
      fetchOpportunities();
      setOpportunityForm(initialOpportunityState);
      setIsOpportunityDialogOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(`Failed to update opportunity: ${err.message}`);
      toast.error(`Failed to update opportunity: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [executeDML, fetchOpportunities]);

  // This is a critical function that was previously failing
  const deleteOpportunity = useCallback(async (id) => {
    if (!confirm("Are you sure you want to delete this opportunity?")) return;
    
    // Check authentication before proceeding
    if (!token || !instanceUrl) {
      toast.error("Authentication data is missing. Please reconnect to Salesforce.");
      setError("Authentication data is missing. Please reconnect to Salesforce.");
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log("Attempting to delete opportunity with ID:", id);
      
      // Use the executeDML helper with correct auth data
      await executeDML('delete', 'Opportunity', {}, id);
      
      toast.success("Opportunity deleted successfully");
      fetchOpportunities();
    } catch (err) {
      console.error("Delete operation failed:", err);
      setError(`Failed to delete opportunity: ${err.message}`);
      toast.error(`Failed to delete opportunity: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [token, instanceUrl, executeDML, fetchOpportunities]);

  // Form handling
  const handleOpportunityFormChange = (field, value) => {
    setOpportunityForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpportunitySubmit = (e) => {
    e.preventDefault();
    if (isEditMode && currentOpportunityId) {
      updateOpportunity(currentOpportunityId, opportunityForm);
    } else {
      createOpportunityRecord(opportunityForm);
    }
  };

  const editOpportunity = useCallback((opp) => {
    setOpportunityForm({
      Name: opp.Name || '',
      StageName: opp.StageName || 'Prospecting',
      CloseDate: opp.CloseDate || new Date().toISOString().split('T')[0],
      Amount: opp.Amount || '0',
    });
    setCurrentOpportunityId(opp.Id);
    setIsEditMode(true);
    setIsOpportunityDialogOpen(true);
  }, []);

  // Reset forms
  const resetOpportunityForm = () => {
    setOpportunityForm(initialOpportunityState);
    setCurrentOpportunityId('');
    setIsEditMode(false);
  };

  // Define columns for TanStack Table
  const columns = useMemo(
    () => [
      {
        accessorKey: 'Name',
        header: ({ column }) => (
          <div className="flex items-center">
            Name
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-7 w-7"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>
        ),
      },
      {
        accessorKey: 'StageName',
        header: ({ column }) => (
          <div className="flex items-center">
            Stage
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-7 w-7"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const stage = row.getValue('StageName');
          return <Badge variant={getStageVariant(stage)}>{stage}</Badge>;
        },
      },
      {
        accessorKey: 'CloseDate',
        header: ({ column }) => (
          <div className="flex items-center">
            Close Date
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-7 w-7"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const closeDate = new Date(row.getValue('CloseDate'));
          const today = new Date();

          // Calculate days difference
          const diffTime = closeDate - today;
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          // Format date
          const formattedDate = closeDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formattedDate}</span>
              {diffDays < 0 ? (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Overdue
                </Badge>
              ) : diffDays < 7 ? (
                <Badge variant="secondary" className="ml-2 text-xs">
                  Soon
                </Badge>
              ) : null}
            </div>
          );
        },
      },
      {
        accessorKey: 'Amount',
        header: ({ column }) => (
          <div className="flex items-center">
            Amount
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 p-0 h-7 w-7"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              <ArrowUpDown className="h-3 w-3" />
            </Button>
          </div>
        ),
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue('Amount') || '0');
          const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(amount);

          return (
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-1" />
              <span
                className={
                  amount > 50000
                    ? "font-medium text-green-600 dark:text-green-400"
                    : ""
                }
              >
                {formatted}
              </span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => {
          const opportunity = row.original;

          return (
            <div className="flex items-center justify-end space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => editOpportunity(opportunity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit opportunity</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteOpportunity(opportunity.Id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete opportunity</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        },
      },
    ],
    [editOpportunity, deleteOpportunity]
  );

  // Initialize TanStack Table
  const table = useReactTable({
    data: opportunities,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  if (!token || !instanceUrl) {
    return (
      <Card className="mx-auto max-w-md mt-10">
        <CardHeader>
          <CardTitle>Connection Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please connect to Salesforce to use the Opportunity Manager.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="p-5 rounded-lg transition-colors">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">
          Opportunity Manager
        </h2>
        <p className="text-muted-foreground mt-2">
          Track, manage and update your sales opportunities in one place.
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="ml-2">{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4 space-y-0">
          <CardTitle className="text-xl">Opportunities</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOpportunities}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>

            <Dialog
              open={isOpportunityDialogOpen}
              onOpenChange={(open) => {
                setIsOpportunityDialogOpen(open);
                if (!open) resetOpportunityForm();
              }}
            >
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Opportunity
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {isEditMode ? 'Edit Opportunity' : 'Create New Opportunity'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOpportunitySubmit}>
                  <div className="grid gap-4 py-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-1"
                      >
                        Name *
                      </label>
                      <Input
                        id="name"
                        value={opportunityForm.Name}
                        onChange={(e) =>
                          handleOpportunityFormChange('Name', e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="stage"
                        className="block text-sm font-medium mb-1"
                      >
                        Stage
                      </label>
                      <Select
                        value={opportunityForm.StageName}
                        onValueChange={(value) =>
                          handleOpportunityFormChange('StageName', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {opportunityStageOptions.map((stage) => (
                            <SelectItem key={stage} value={stage}>
                              {stage}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label
                        htmlFor="closeDate"
                        className="block text-sm font-medium mb-1"
                      >
                        Close Date
                      </label>
                      <Input
                        id="closeDate"
                        type="date"
                        value={opportunityForm.CloseDate}
                        onChange={(e) =>
                          handleOpportunityFormChange(
                            'CloseDate',
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="amount"
                        className="block text-sm font-medium mb-1"
                      >
                        Amount
                      </label>
                      <Input
                        id="amount"
                        type="number"
                        value={opportunityForm.Amount}
                        onChange={(e) =>
                          handleOpportunityFormChange('Amount', e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsOpportunityDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isEditMode ? 'Update' : 'Create'}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && opportunities.length === 0 ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : opportunities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="mb-3">No opportunities found.</div>
              <Button
                variant="outline"
                onClick={() => setIsOpportunityDialogOpen(true)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first opportunity
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className={
                          row.original.StageName === 'Closed Won'
                            ? "bg-green-50 dark:bg-green-950/20"
                            : row.original.StageName === 'Closed Lost'
                            ? "bg-red-50 dark:bg-red-950/20"
                            : ""
                        }
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {opportunities.length > 0 && (
          <CardFooter className="flex items-center justify-between pt-4 border-t">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing{" "}
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}{" "}
              to{" "}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                opportunities.length
              )}{" "}
              of {opportunities.length} opportunities
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium">Rows per page</p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  <span className="text-sm">Page</span>
                  <strong className="text-sm">
                    {table.getState().pagination.pageIndex + 1} of{" "}
                    {table.getPageCount()}
                  </strong>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SalesCloudManager;