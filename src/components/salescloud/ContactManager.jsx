'use client';
import React, { useEffect, useState } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Loader2, RefreshCw, Plus, Edit, Trash } from "lucide-react";

const initialContactState = {
  FirstName: '',
  LastName: '',
  Email: '',
  Phone: '',
  Title: '',
  AccountId: ''
};

// Contact salutation options
const salutationOptions = [
  'Mr.',
  'Ms.',
  'Mrs.',
  'Dr.',
  'Prof.'
];

const ContactManager = () => {
  // Auth state
  const [instanceUrl, setInstanceUrl] = useState('');
  const [token, setToken] = useState('');
  const [contacts, setContacts] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [contactForm, setContactForm] = useState(initialContactState);
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentContactId, setCurrentContactId] = useState('');
  const [salutation, setSalutation] = useState('');

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
      fetchContacts();
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

  const fetchContacts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const records = await executeQuery(
        'SELECT Id, FirstName, LastName, Email, Phone, Title, AccountId, Account.Name, Salutation FROM Contact ORDER BY LastName, FirstName ASC LIMIT 50'
      );
      setContacts(records);
    } catch (err) {
      setError(`Failed to fetch contacts: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccounts = async () => {
    try {
      const records = await executeQuery(
        'SELECT Id, Name FROM Account ORDER BY Name ASC LIMIT 100'
      );
      setAccounts(records);
    } catch (err) {
      setError(`Failed to fetch accounts: ${err.message}`);
    }
  };

  const createContactRecord = async (data) => {
    setIsLoading(true);
    try {
      // Add salutation if it was selected
      const contactData = { ...data };
      if (salutation) {
        contactData.Salutation = salutation;
      }
      
      await executeDML('create', 'Contact', contactData);
      alert("Contact created successfully");
      fetchContacts();
      setContactForm(initialContactState);
      setSalutation('');
      setIsContactDialogOpen(false);
    } catch (err) {
      setError(`Failed to create contact: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateContact = async (id, data) => {
    setIsLoading(true);
    try {
      // Add salutation if it was selected
      const contactData = { ...data };
      if (salutation) {
        contactData.Salutation = salutation;
      }
      
      await executeDML('update', 'Contact', contactData, id);
      alert("Contact updated successfully");
      fetchContacts();
      setContactForm(initialContactState);
      setSalutation('');
      setIsContactDialogOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(`Failed to update contact: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (id) => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    setIsLoading(true);
    try {
      await executeDML('delete', 'Contact', {}, id);
      alert("Contact deleted successfully");
      fetchContacts();
    } catch (err) {
      setError(`Failed to delete contact: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactFormChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && currentContactId) {
      updateContact(currentContactId, contactForm);
    } else {
      createContactRecord(contactForm);
    }
  };

  const editContact = (contact) => {
    setContactForm({
      FirstName: contact.FirstName || '',
      LastName: contact.LastName || '',
      Email: contact.Email || '',
      Phone: contact.Phone || '',
      Title: contact.Title || '',
      AccountId: contact.AccountId || ''
    });
    setSalutation(contact.Salutation || '');
    setCurrentContactId(contact.Id);
    setIsEditMode(true);
    setIsContactDialogOpen(true);
  };

  const resetContactForm = () => {
    setContactForm(initialContactState);
    setSalutation('');
    setCurrentContactId('');
    setIsEditMode(false);
  };

  const getFullName = (contact) => {
    const prefix = contact.Salutation ? `${contact.Salutation} ` : '';
    const firstName = contact.FirstName || '';
    const lastName = contact.LastName || '';
    return `${prefix}${firstName} ${lastName}`.trim();
  };

  if (!token || !instanceUrl) {
    return <div className="p-5">Please connect to Salesforce first.</div>;
  }

  return (
    <div className="p-5 bg-white border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-6">Contacts Manager</h2>
      
      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded">{error}</div>}
      
      <Card>
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold"></h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchContacts} 
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Refresh</span>
              </Button>
              <Dialog open={isContactDialogOpen} onOpenChange={(open) => {
                setIsContactDialogOpen(open);
                if (!open) resetContactForm();
              }}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsContactDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? 'Edit Contact' : 'Create New Contact'}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleContactSubmit}>
                    <div className="grid gap-4 py-4">
                      <div>
                        <label htmlFor="salutation" className="block text-sm font-medium mb-1">Salutation</label>
                        <Select 
                          value={salutation} 
                          onValueChange={(value) => setSalutation(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select salutation" />
                          </SelectTrigger>
                          <SelectContent>
                            {salutationOptions.map(option => (
                              <SelectItem key={option} value={option}>{option}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
                        <Input
                          id="firstName"
                          value={contactForm.FirstName}
                          onChange={(e) => handleContactFormChange('FirstName', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name *</label>
                        <Input
                          id="lastName"
                          value={contactForm.LastName}
                          onChange={(e) => handleContactFormChange('LastName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
                        <Input
                          id="title"
                          value={contactForm.Title}
                          onChange={(e) => handleContactFormChange('Title', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="account" className="block text-sm font-medium mb-1">Account</label>
                        <Select 
                          value={contactForm.AccountId} 
                          onValueChange={(value) => handleContactFormChange('AccountId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">-- None --</SelectItem>
                            {accounts.map(acc => (
                              <SelectItem key={acc.Id} value={acc.Id}>{acc.Name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                        <Input
                          id="email"
                          type="email"
                          value={contactForm.Email}
                          onChange={(e) => handleContactFormChange('Email', e.target.value)}
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                        <Input
                          id="phone"
                          value={contactForm.Phone}
                          onChange={(e) => handleContactFormChange('Phone', e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" type="button" onClick={() => setIsContactDialogOpen(false)}>
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
          ) : contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No contacts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-4 py-2 text-left">Name</th>
                    <th className="border px-4 py-2 text-left">Title</th>
                    <th className="border px-4 py-2 text-left">Account</th>
                    <th className="border px-4 py-2 text-left">Email</th>
                    <th className="border px-4 py-2 text-left">Phone</th>
                    <th className="border px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((contact) => (
                    <tr key={contact.Id}>
                      <td className="border px-4 py-2">{getFullName(contact)}</td>
                      <td className="border px-4 py-2">{contact.Title || 'N/A'}</td>
                      <td className="border px-4 py-2">{contact.Account?.Name || 'N/A'}</td>
                      <td className="border px-4 py-2">{contact.Email || 'N/A'}</td>
                      <td className="border px-4 py-2">{contact.Phone || 'N/A'}</td>
                      <td className="border px-4 py-2">
                        <div className="flex justify-center gap-2">
                          <Button size="sm" variant="outline" onClick={() => editContact(contact)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => deleteContact(contact.Id)}>
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

export default ContactManager;



// 'use client';
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
// import { Alert, AlertDescription } from "../ui/alert";
// import { Badge } from "../ui/badge";
// import {
//   Loader2,
//   RefreshCw,
//   Plus,
//   Edit,
//   Trash,
//   ArrowUpDown,
//   AlertCircle,
//   Phone,
//   Mail,
//   Building,
//   User,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
// } from "lucide-react";
// import { toast } from 'sonner';

// const initialContactState = {
//   FirstName: '',
//   LastName: '',
//   Email: '',
//   Phone: '',
//   Title: '',
//   AccountId: null // Changed from empty string to null
// };

// // Contact salutation options
// const salutationOptions = [
//   'Mr.',
//   'Ms.',
//   'Mrs.',
//   'Dr.',
//   'Prof.'
// ];

// const getTitleVariant = (title) => {
//   if (!title) return 'outline';
//   if (title.toLowerCase().includes('director') || title.toLowerCase().includes('vp') || title.toLowerCase().includes('chief')) return 'secondary';
//   if (title.toLowerCase().includes('manager')) return 'default';
//   if (title.toLowerCase().includes('executive') || title.toLowerCase().includes('president')) return 'success';
//   return 'outline';
// };

// const ContactManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');
  
//   // Data state
//   const [contacts, setContacts] = useState([]);
//   const [accounts, setAccounts] = useState([]);
  
//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [sorting, setSorting] = useState([]);
  
//   // Form state
//   const [contactForm, setContactForm] = useState(initialContactState);
//   const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentContactId, setCurrentContactId] = useState('');
//   const [salutation, setSalutation] = useState(null); // Changed from empty string to null

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
//       fetchContacts();
//       fetchAccounts();
//     }
//   }, [token, instanceUrl]);

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
//       if (!response.ok) throw new Error(result.error || 'Query execution failed');
//       return result.records || [];
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   }, [token, instanceUrl]);

//   const executeDML = useCallback(async (operation, objectType, data, id) => {
//     if (!token || !instanceUrl) {
//       throw new Error("Authentication data is missing");
//     }
    
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

//   const fetchContacts = useCallback(async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, FirstName, LastName, Email, Phone, Title, AccountId, Account.Name, Salutation FROM Contact ORDER BY LastName, FirstName ASC LIMIT 50'
//       );
//       setContacts(records);
//       toast.success(`Successfully loaded ${records.length} contacts.`);
//     } catch (err) {
//       setError(`Failed to fetch contacts: ${err.message}`);
//       toast.error(`Failed to fetch contacts: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeQuery]);

//   const fetchAccounts = useCallback(async () => {
//     try {
//       const records = await executeQuery(
//         'SELECT Id, Name FROM Account ORDER BY Name ASC LIMIT 100'
//       );
//       setAccounts(records);
//     } catch (err) {
//       setError(`Failed to fetch accounts: ${err.message}`);
//       toast.error(`Failed to fetch accounts: ${err.message}`);
//     }
//   }, [executeQuery]);

//   const createContactRecord = useCallback(async (data) => {
//     setIsLoading(true);
//     try {
//       // Add salutation if it was selected
//       const contactData = { ...data };
//       if (salutation) {
//         contactData.Salutation = salutation;
//       }
      
//       // Remove null values before sending to API
//       Object.keys(contactData).forEach(key => {
//         if (contactData[key] === null) {
//           delete contactData[key];
//         }
//       });
      
//       await executeDML('create', 'Contact', contactData);
//       toast.success("Contact created successfully");
//       fetchContacts();
//       setContactForm(initialContactState);
//       setSalutation(null);
//       setIsContactDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create contact: ${err.message}`);
//       toast.error(`Failed to create contact: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeDML, fetchContacts, salutation]);

//   const updateContact = useCallback(async (id, data) => {
//     setIsLoading(true);
//     try {
//       // Add salutation if it was selected
//       const contactData = { ...data };
//       if (salutation) {
//         contactData.Salutation = salutation;
//       }
      
//       // Remove null values before sending to API
//       Object.keys(contactData).forEach(key => {
//         if (contactData[key] === null) {
//           delete contactData[key];
//         }
//       });
      
//       await executeDML('update', 'Contact', contactData, id);
//       toast.success("Contact updated successfully");
//       fetchContacts();
//       setContactForm(initialContactState);
//       setSalutation(null);
//       setIsContactDialogOpen(false);
//       setIsEditMode(false);
//     } catch (err) {
//       setError(`Failed to update contact: ${err.message}`);
//       toast.error(`Failed to update contact: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeDML, fetchContacts, salutation]);

//   const deleteContact = useCallback(async (id) => {
//     if (!confirm("Are you sure you want to delete this contact?")) return;
    
//     if (!token || !instanceUrl) {
//       toast.error("Authentication data is missing. Please reconnect to Salesforce.");
//       setError("Authentication data is missing. Please reconnect to Salesforce.");
//       return;
//     }

//     setIsLoading(true);
//     setError('');
    
//     try {
//       await executeDML('delete', 'Contact', {}, id);
//       toast.success("Contact deleted successfully");
//       fetchContacts();
//     } catch (err) {
//       setError(`Failed to delete contact: ${err.message}`);
//       toast.error(`Failed to delete contact: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [token, instanceUrl, executeDML, fetchContacts]);

//   const handleContactFormChange = (field, value) => {
//     setContactForm(prev => ({ ...prev, [field]: value }));
//   };

//   const handleContactSubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentContactId) {
//       updateContact(currentContactId, contactForm);
//     } else {
//       createContactRecord(contactForm);
//     }
//   };

//   const editContact = useCallback((contact) => {
//     setContactForm({
//       FirstName: contact.FirstName || '',
//       LastName: contact.LastName || '',
//       Email: contact.Email || '',
//       Phone: contact.Phone || '',
//       Title: contact.Title || '',
//       AccountId: contact.AccountId || null
//     });
//     setSalutation(contact.Salutation || null);
//     setCurrentContactId(contact.Id);
//     setIsEditMode(true);
//     setIsContactDialogOpen(true);
//   }, []);

//   const resetContactForm = () => {
//     setContactForm(initialContactState);
//     setSalutation(null);
//     setCurrentContactId('');
//     setIsEditMode(false);
//   };

//   const getFullName = (contact) => {
//     const prefix = contact.Salutation ? `${contact.Salutation} ` : '';
//     const firstName = contact.FirstName || '';
//     const lastName = contact.LastName || '';
//     return `${prefix}${firstName} ${lastName}`.trim();
//   };

//   // Define columns for TanStack Table
//   const columns = useMemo(
//     () => [
//       {
//         accessorFn: (row) => getFullName(row),
//         id: 'fullName',
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
//         cell: ({ row }) => {
//           const contact = row.original;
//           return (
//             <div className="flex items-center gap-2">
//               <User className="h-4 w-4 text-muted-foreground" />
//               <span className="font-medium">{getFullName(contact)}</span>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'Title',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Title
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
//           const title = row.getValue('Title');
//           return title ? (
//             <Badge variant={getTitleVariant(title)}>{title}</Badge>
//           ) : (
//             <span className="text-muted-foreground">N/A</span>
//           );
//         },
//       },
//       {
//         accessorFn: (row) => row.Account?.Name,
//         id: 'Account',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Account
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
//           const contact = row.original;
//           return (
//             <div className="flex items-center gap-2">
//               <Building className="h-4 w-4 text-muted-foreground" />
//               <span>{contact.Account?.Name || 'N/A'}</span>
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'Email',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Email
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
//           const email = row.getValue('Email');
//           return (
//             <div className="flex items-center gap-2">
//               <Mail className="h-4 w-4 text-muted-foreground" />
//               <span>{email || 'N/A'}</span>
//             </div>
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
//           return (
//             <div className="flex items-center gap-2">
//               <Phone className="h-4 w-4 text-muted-foreground" />
//               <span>{phone || 'N/A'}</span>
//             </div>
//           );
//         },
//       },
//       {
//         id: 'actions',
//         cell: ({ row }) => {
//           const contact = row.original;

//           return (
//             <div className="flex items-center justify-end space-x-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => editContact(contact)}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Edit contact</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => deleteContact(contact.Id)}
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete contact</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//           );
//         },
//       },
//     ],
//     [editContact, deleteContact]
//   );

//   // Initialize TanStack Table
//   const table = useReactTable({
//     data: contacts,
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

//   if (!token || !instanceUrl) {
//     return (
//       <Card className="mx-auto max-w-md mt-10">
//         <CardHeader>
//           <CardTitle>Connection Required</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground">
//             Please connect to Salesforce to use the Contact Manager.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-5 rounded-lg transition-colors">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight">
//           Contacts Manager
//         </h2>
//         <p className="text-muted-foreground mt-2">
//           Manage and maintain your Salesforce contacts in one place.
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
//           <CardTitle className="text-xl">Contacts</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchContacts}
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
//               open={isContactDialogOpen}
//               onOpenChange={(open) => {
//                 setIsContactDialogOpen(open);
//                 if (!open) resetContactForm();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Contact
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {isEditMode ? 'Edit Contact' : 'Create New Contact'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleContactSubmit}>
//                   <div className="grid gap-4 py-4">
//                     <div>
//                       <label htmlFor="salutation" className="block text-sm font-medium mb-1">Salutation</label>
//                       <Select 
//                         value={salutation || "none"} 
//                         onValueChange={(value) => setSalutation(value === "none" ? null : value)}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select salutation" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="none">-- None --</SelectItem>
//                           {salutationOptions.map(option => (
//                             <SelectItem key={option} value={option}>{option}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label htmlFor="firstName" className="block text-sm font-medium mb-1">First Name</label>
//                       <Input
//                         id="firstName"
//                         value={contactForm.FirstName}
//                         onChange={(e) => handleContactFormChange('FirstName', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="lastName" className="block text-sm font-medium mb-1">Last Name *</label>
//                       <Input
//                         id="lastName"
//                         value={contactForm.LastName}
//                         onChange={(e) => handleContactFormChange('LastName', e.target.value)}
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
//                       <Input
//                         id="title"
//                         value={contactForm.Title}
//                         onChange={(e) => handleContactFormChange('Title', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="account" className="block text-sm font-medium mb-1">Account</label>
//                       <Select 
//                         value={contactForm.AccountId || "none"} 
//                         onValueChange={(value) => handleContactFormChange('AccountId', value === "none" ? null : value)}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select account" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="none">-- None --</SelectItem>
//                           {accounts.map(acc => (
//                             <SelectItem key={acc.Id} value={acc.Id}>{acc.Name}</SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div>
//                       <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={contactForm.Email}
//                         onChange={(e) => handleContactFormChange('Email', e.target.value)}
//                       />
//                     </div>
//                     <div>
//                       <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
//                       <Input
//                         id="phone"
//                         value={contactForm.Phone}
//                         onChange={(e) => handleContactFormChange('Phone', e.target.value)}
//                       />
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button variant="outline" type="button" onClick={() => setIsContactDialogOpen(false)}>
//                       Cancel
//                     </Button>
//                     <Button type="submit" disabled={isLoading}>
//                       {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                       {isEditMode ? 'Update' : 'Create'}
//                     </Button>
//                   </DialogFooter>
//                 </form>
//               </DialogContent>
//             </Dialog>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {isLoading && contacts.length === 0 ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : contacts.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <div className="mb-3">No contacts found.</div>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsContactDialogOpen(true)}
//                 className="mt-2"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create your first contact
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
//         {contacts.length > 0 && (
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
//                 contacts.length
//               )}{" "}
//               of {contacts.length} contacts
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

// export default ContactManager;