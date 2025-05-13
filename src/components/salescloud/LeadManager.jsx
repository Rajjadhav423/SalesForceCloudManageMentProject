
"use client";
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
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
import { Checkbox } from "../ui/checkbox";
import {
  Loader2,
  RefreshCw,
  Plus,
  Edit,
  Trash,
  ArrowRightLeft,
} from "lucide-react";

// Initial form states
const initialLeadState = {
  FirstName: '',
  LastName: '',
  Company: '',
  Email: '',
  Phone: '',
  Status: 'Open - Not Contacted',
};

// Lead status options
const leadStatusOptions = [
  'Open - Not Contacted',
  'Working - Contacted',
  'Closed - Converted',
  'Closed - Not Converted',
];

const LeadManager = () => {
  // Auth state
  const [instanceUrl, setInstanceUrl] = useState('');
  const [token, setToken] = useState('');

  // Data state
  const [leads, setLeads] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('leads');

  // Form state
  const [leadForm, setLeadForm] = useState(initialLeadState);
  const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentLeadId, setCurrentLeadId] = useState('');

  // Convert lead state
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [convertLeadId, setConvertLeadId] = useState('');
  const [convertLeadData, setConvertLeadData] = useState(null);
  const [createOpportunity, setCreateOpportunity] = useState(true);

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
      fetchLeads();
    }
  }, [token, instanceUrl]);

  // Query execution helper
  const executeQuery = async (query) => {
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
  };

  // Execute DML operation
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
          id,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Operation failed');
      return result;
    } catch (err) {
      throw new Error(err.message || 'Unknown error');
    }
  };

  // Data fetching functions
  const fetchLeads = async () => {
    setIsLoading(true);
    setError('');
    try {
      const records = await executeQuery(
        'SELECT Id, FirstName, LastName, Company, Email, Phone, Status, IsConverted FROM Lead'
      );
      setLeads(records);
    } catch (err) {
      setError(`Failed to fetch leads: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // CRUD operations for Lead
  const createLead = async (data) => {
    setIsLoading(true);
    try {
      await executeDML('create', 'Lead', data);
      alert("Lead created successfully");
      fetchLeads();
      setLeadForm(initialLeadState);
      setIsLeadDialogOpen(false);
    } catch (err) {
      setError(`Failed to create lead: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const updateLead = async (id, data) => {
    setIsLoading(true);
    try {
      await executeDML('update', 'Lead', data, id);
      alert("Lead updated successfully");
      fetchLeads();
      setLeadForm(initialLeadState);
      setIsLeadDialogOpen(false);
      setIsEditMode(false);
    } catch (err) {
      setError(`Failed to update lead: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteLead = async (id) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    setIsLoading(true);
    try {
      await executeDML('delete', 'Lead', {}, id);
      alert("Lead deleted successfully");
      fetchLeads();
    } catch (err) {
      setError(`Failed to delete lead: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Lead conversion
  const openConvertLeadDialog = (lead) => {
    setConvertLeadId(lead.Id);
    setConvertLeadData(lead);
    setIsConvertDialogOpen(true);
  };

  const convertLead = async () => {
    if (!convertLeadId || !convertLeadData) return;

    setIsLoading(true);
    try {
      const result = await fetch('/api/salescloud/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accessToken: token,
          instanceUrl,
          leadId: convertLeadId,
          createOpportunity,
        }),
      });

      const data = await result.json();
      if (!result.ok) throw new Error(data.error || 'Lead conversion failed');

      alert("Lead converted successfully");

      fetchLeads();
      setIsConvertDialogOpen(false);
    } catch (err) {
      setError(`Failed to convert lead: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Form handling
  const handleLeadFormChange = (field, value) => {
    setLeadForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLeadSubmit = (e) => {
    e.preventDefault();
    if (isEditMode && currentLeadId) {
      updateLead(currentLeadId, leadForm);
    } else {
      createLead(leadForm);
    }
  };

  const editLead = (lead) => {
    // Check if lead is already converted
    if (lead.IsConverted) {
      alert("Cannot edit a converted lead.");
      return;
    }

    setLeadForm({
      FirstName: lead.FirstName || '',
      LastName: lead.LastName || '',
      Company: lead.Company || '',
      Email: lead.Email || '',
      Phone: lead.Phone || '',
      Status: lead.Status || 'Open - Not Contacted',
    });
    setCurrentLeadId(lead.Id);
    setIsEditMode(true);
    setIsLeadDialogOpen(true);
  };

  // Reset forms
  const resetLeadForm = () => {
    setLeadForm(initialLeadState);
    setCurrentLeadId('');
    setIsEditMode(false);
  };

  if (!token || !instanceUrl) {
    return <div className="p-5">Please connect to Salesforce first.</div>;
  }

  return (
    <div className="p-5 bg-white border rounded-md shadow">
      <h2 className="text-2xl font-bold mb-6">Sales Cloud Manager</h2>

      {error && (
        <div className="text-red-500 mb-4 p-3 bg-red-50 rounded flex justify-between items-center">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError('')}>
            &times;
          </Button>
        </div>
      )}

      <Tabs defaultValue="leads" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="leads">Leads</TabsTrigger>
        </TabsList>

        {/* Leads Tab */}
        <TabsContent value="leads">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Leads</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={fetchLeads}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="ml-2">Refresh</span>
                  </Button>
                  <Dialog
                    open={isLeadDialogOpen}
                    onOpenChange={(open) => {
                      setIsLeadDialogOpen(open);
                      if (!open) resetLeadForm();
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => setIsLeadDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        New Lead
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>
                          {isEditMode ? 'Edit Lead' : 'Create New Lead'}
                        </DialogTitle>
                      </DialogHeader>
                      <form onSubmit={handleLeadSubmit}>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="firstName"
                                className="block text-sm font-medium mb-1"
                              >
                                First Name
                              </label>
                              <Input
                                id="firstName"
                                value={leadForm.FirstName}
                                onChange={(e) =>
                                  handleLeadFormChange(
                                    'FirstName',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="lastName"
                                className="block text-sm font-medium mb-1"
                              >
                                Last Name *
                              </label>
                              <Input
                                id="lastName"
                                value={leadForm.LastName}
                                onChange={(e) =>
                                  handleLeadFormChange(
                                    'LastName',
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              htmlFor="company"
                              className="block text-sm font-medium mb-1"
                            >
                              Company *
                            </label>
                            <Input
                              id="company"
                              value={leadForm.Company}
                              onChange={(e) =>
                                handleLeadFormChange('Company', e.target.value)
                              }
                              required
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium mb-1"
                            >
                              Email
                            </label>
                            <Input
                              id="email"
                              type="email"
                              value={leadForm.Email}
                              onChange={(e) =>
                                handleLeadFormChange('Email', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium mb-1"
                            >
                              Phone
                            </label>
                            <Input
                              id="phone"
                              value={leadForm.Phone}
                              onChange={(e) =>
                                handleLeadFormChange('Phone', e.target.value)
                              }
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="status"
                              className="block text-sm font-medium mb-1"
                            >
                              Status
                            </label>
                            <Select
                              value={leadForm.Status}
                              onValueChange={(value) =>
                                handleLeadFormChange('Status', value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                {leadStatusOptions.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {status}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button
                            variant="outline"
                            type="button"
                            onClick={() => setIsLeadDialogOpen(false)}
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
              </div>

              {isLoading && activeTab === 'leads' ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : leads.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No leads found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-4 py-2 text-left">Name</th>
                        <th className="border px-4 py-2 text-left">Company</th>
                        <th className="border px-4 py-2 text-left">Email</th>
                        <th className="border px-4 py-2 text-left">Phone</th>
                        <th className="border px-4 py-2 text-left">Status</th>
                        <th className="border px-4 py-2 text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((lead) => (
                        <tr
                          key={lead.Id}
                          className={lead.IsConverted ? "bg-blue-50" : ""}
                        >
                          <td className="border px-4 py-2">
                            {lead.FirstName} {lead.LastName}
                            {lead.IsConverted && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Converted
                              </span>
                            )}
                          </td>
                          <td className="border px-4 py-2">{lead.Company}</td>
                          <td className="border px-4 py-2">{lead.Email}</td>
                          <td className="border px-4 py-2">{lead.Phone}</td>
                          <td className="border px-4 py-2">{lead.Status}</td>
                          <td className="border px-4 py-2">
                            <div className="flex justify-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => editLead(lead)}
                                disabled={lead.IsConverted}
                                title={
                                  lead.IsConverted
                                    ? "Cannot edit converted lead"
                                    : "Edit lead"
                                }
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteLead(lead.Id)}
                                title="Delete lead"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                onClick={() => openConvertLeadDialog(lead)}
                                disabled={lead.IsConverted}
                                title={
                                  lead.IsConverted
                                    ? "Lead already converted"
                                    : "Convert lead"
                                }
                              >
                                <ArrowRightLeft className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Lead Conversion Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Lead</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {convertLeadData && (
              <div className="mb-4">
                <p className="font-medium">
                  Converting lead: {convertLeadData.FirstName}{" "}
                  {convertLeadData.LastName}, {convertLeadData.Company}
                </p>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-4">
              This will convert the lead into an account, contact, and
              optionally an opportunity.
            </p>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="createOpportunity"
                checked={createOpportunity}
                onCheckedChange={setCreateOpportunity}
              />
              <label
                htmlFor="createOpportunity"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Create Opportunity
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConvertDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={convertLead} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Convert Lead
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManager;



// "use client";

// import React, { useEffect, useState, useCallback } from 'react';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
// import { Checkbox } from "../ui/checkbox";

// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "../ui/alert-dialog";
// import {
//   TooltipProvider,
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "../ui/alert";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "../ui/table";
// import { Badge } from "../ui/badge";
// import {
//   Loader2,
//   RefreshCw,
//   Plus,
//   MoreHorizontal,
//   Edit,
//   Trash,
//   ArrowRightLeft,
//   AlertCircle,
//   X,
// } from "lucide-react";

// // Constants
// const LEAD_STATUS_OPTIONS = [
//   'Open - Not Contacted',
//   'Working - Contacted',
//   'Closed - Converted',
//   'Closed - Not Converted',
// ];

// const INITIAL_LEAD_STATE = {
//   FirstName: '',
//   LastName: '',
//   Company: '',
//   Email: '',
//   Phone: '',
//   Status: 'Open - Not Contacted',
// };

// const LeadManager = () => {
//   // Auth state
//   const [authData, setAuthData] = useState({
//     instanceUrl: '',
//     token: '',
//   });

//   // Data state
//   const [leads, setLeads] = useState([]);

//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [activeTab, setActiveTab] = useState('leads');
//   const [alertDialogOpen, setAlertDialogOpen] = useState(false);
//   const [leadToDelete, setLeadToDelete] = useState(null);

//   // Form state
//   const [leadForm, setLeadForm] = useState(INITIAL_LEAD_STATE);
//   const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentLeadId, setCurrentLeadId] = useState('');

//   // Convert lead state
//   const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
//   const [convertLeadData, setConvertLeadData] = useState(null);
//   const [createOpportunity, setCreateOpportunity] = useState(true);

//   // Load auth data from local storage
//   useEffect(() => {
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (savedAuthData) {
//       const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//       setAuthData({
//         token: accessToken,
//         instanceUrl,
//       });
//     }
//   }, []);

//   // Load data when auth is available
//   useEffect(() => {
//     if (authData.token && authData.instanceUrl) {
//       fetchLeads();
//     }
//   }, [authData.token, authData.instanceUrl]);

//   // API Helpers
//   const executeQuery = useCallback(async (query) => {
//     try {
//       const response = await fetch('/api/salescloud', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           accessToken: authData.token, 
//           instanceUrl: authData.instanceUrl, 
//           query 
//         }),
//       });

//       const result = await response.json();
//       if (!response.ok)
//         throw new Error(result.error || 'Query execution failed');
//       return result.records || [];
//     } catch (err) {
//       throw new Error(err.message || 'Unknown error');
//     }
//   }, [authData]);

//   const executeDML = useCallback(async (operation, objectType, data, id) => {
//     try {
//       const response = await fetch('/api/salescloud/dml', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           accessToken: authData.token,
//           instanceUrl: authData.instanceUrl,
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
//   }, [authData]);

//   // Data fetching functions
//   const fetchLeads = useCallback(async () => {
//     setIsLoading(true);
//     setError('');
//     try {
//       const records = await executeQuery(
//         'SELECT Id, FirstName, LastName, Company, Email, Phone, Status, IsConverted FROM Lead'
//       );
//       setLeads(records);
//     } catch (err) {
//       setError(`Failed to fetch leads: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   }, [executeQuery]);

//   // CRUD operations for Lead
//   const createLead = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Lead', data);
//       showToast("Lead created successfully");
//       fetchLeads();
//       resetLeadForm();
//       setIsLeadDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to create lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateLead = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Lead', data, id);
//       showToast("Lead updated successfully");
//       fetchLeads();
//       resetLeadForm();
//       setIsLeadDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to update lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const deleteLead = async () => {
//     if (!leadToDelete) return;
    
//     setIsLoading(true);
//     try {
//       await executeDML('delete', 'Lead', {}, leadToDelete);
//       showToast("Lead deleted successfully");
//       fetchLeads();
//       setAlertDialogOpen(false);
//       setLeadToDelete(null);
//     } catch (err) {
//       setError(`Failed to delete lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Confirmation for deletion
//   const confirmDelete = (id) => {
//     setLeadToDelete(id);
//     setAlertDialogOpen(true);
//   };

//   // Lead conversion
//   const openConvertLeadDialog = (lead) => {
//     setConvertLeadData(lead);
//     setIsConvertDialogOpen(true);
//   };

//   const convertLead = async () => {
//     if (!convertLeadData) return;

//     setIsLoading(true);
//     try {
//       const result = await fetch('/api/salescloud/convert', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           accessToken: authData.token,
//           instanceUrl: authData.instanceUrl,
//           leadId: convertLeadData.Id,
//           createOpportunity,
//         }),
//       });

//       const data = await result.json();
//       if (!result.ok) throw new Error(data.error || 'Lead conversion failed');

//       showToast("Lead converted successfully");
//       fetchLeads();
//       setIsConvertDialogOpen(false);
//       setConvertLeadData(null);
//     } catch (err) {
//       setError(`Failed to convert lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Form handling
//   const handleLeadFormChange = (field, value) => {
//     setLeadForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleLeadSubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentLeadId) {
//       updateLead(currentLeadId, leadForm);
//     } else {
//       createLead(leadForm);
//     }
//   };

//   const editLead = (lead) => {
//     // Check if lead is already converted
//     if (lead.IsConverted) {
//       showToast("Cannot edit a converted lead.", "error");
//       return;
//     }

//     setLeadForm({
//       FirstName: lead.FirstName || '',
//       LastName: lead.LastName || '',
//       Company: lead.Company || '',
//       Email: lead.Email || '',
//       Phone: lead.Phone || '',
//       Status: lead.Status || 'Open - Not Contacted',
//     });
//     setCurrentLeadId(lead.Id);
//     setIsEditMode(true);
//     setIsLeadDialogOpen(true);
//   };

//   // Reset form
//   const resetLeadForm = () => {
//     setLeadForm(INITIAL_LEAD_STATE);
//     setCurrentLeadId('');
//     setIsEditMode(false);
//   };

//   // Helper functions
//   const showToast = (message, type = "success") => {
//     // In a real implementation, you would use a toast notification system
//     // For simplicity, we're using a basic alert
//     alert(message);
//   };

//   if (!authData.token || !authData.instanceUrl) {
//     return (
//       <Card className="p-6">
//         <CardHeader>
//           <CardTitle>Sales Cloud Manager</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertTitle>Authentication Required</AlertTitle>
//             <AlertDescription>
//               Please connect to Salesforce first to access the Sales Cloud Manager.
//             </AlertDescription>
//           </Alert>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="w-full">
//       <Card className="border shadow-sm dark:bg-gray-900 dark:border-gray-800">
//         <CardHeader>
//           <div className="flex justify-between items-center">
//             <CardTitle className="text-2xl font-bold">Sales Cloud Manager</CardTitle>
//           </div>
//         </CardHeader>
//         <CardContent>
//           {error && (
//             <Alert variant="destructive" className="mb-6">
//               <div className="flex justify-between items-center w-full">
//                 <div className="flex items-center">
//                   <AlertCircle className="h-4 w-4 mr-2" />
//                   <AlertDescription>{error}</AlertDescription>
//                 </div>
//                 <Button 
//                   variant="ghost" 
//                   size="icon" 
//                   onClick={() => setError('')}
//                   className="h-6 w-6"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </Alert>
//           )}

//           <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//             <TabsList className="mb-4">
//               <TabsTrigger value="leads">Leads</TabsTrigger>
//             </TabsList>

//             <TabsContent value="leads" className="w-full">
//               <Card>
//                 <CardHeader className="pb-2">
//                   <div className="flex justify-between items-center">
//                     <CardTitle className="text-lg font-semibold">Leads</CardTitle>
//                     <div className="flex gap-2">
//                       <TooltipProvider>
//                         <Tooltip>
//                           <TooltipTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={fetchLeads}
//                               disabled={isLoading}
//                               className="flex items-center gap-1"
//                             >
//                               {isLoading ? (
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                               ) : (
//                                 <RefreshCw className="h-4 w-4" />
//                               )}
//                               <span className="hidden sm:inline ml-1">Refresh</span>
//                             </Button>
//                           </TooltipTrigger>
//                           <TooltipContent>Refresh Leads</TooltipContent>
//                         </Tooltip>
//                       </TooltipProvider>
                      
//                       <Dialog
//                         open={isLeadDialogOpen}
//                         onOpenChange={(open) => {
//                           setIsLeadDialogOpen(open);
//                           if (!open) resetLeadForm();
//                         }}
//                       >
//                         <DialogTrigger asChild>
//                           <Button size="sm" className="flex items-center gap-1">
//                             <Plus className="h-4 w-4" />
//                             <span className="hidden sm:inline ml-1">New Lead</span>
//                           </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-md">
//                           <DialogHeader>
//                             <DialogTitle>
//                               {isEditMode ? 'Edit Lead' : 'Create New Lead'}
//                             </DialogTitle>
//                           </DialogHeader>
//                           <form onSubmit={handleLeadSubmit}>
//                             <div className="grid gap-4 py-4">
//                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 <div>
//                                   <label
//                                     htmlFor="firstName"
//                                     className="text-sm font-medium mb-1 block"
//                                   >
//                                     First Name
//                                   </label>
//                                   <Input
//                                     id="firstName"
//                                     value={leadForm.FirstName}
//                                     onChange={(e) =>
//                                       handleLeadFormChange(
//                                         'FirstName',
//                                         e.target.value
//                                       )
//                                     }
//                                     placeholder="First name"
//                                     className="w-full"
//                                   />
//                                 </div>
//                                 <div>
//                                   <label
//                                     htmlFor="lastName"
//                                     className="text-sm font-medium mb-1 block"
//                                   >
//                                     Last Name *
//                                   </label>
//                                   <Input
//                                     id="lastName"
//                                     value={leadForm.LastName}
//                                     onChange={(e) =>
//                                       handleLeadFormChange(
//                                         'LastName',
//                                         e.target.value
//                                       )
//                                     }
//                                     required
//                                     placeholder="Last name"
//                                     className="w-full"
//                                   />
//                                 </div>
//                               </div>
//                               <div>
//                                 <label
//                                   htmlFor="company"
//                                   className="text-sm font-medium mb-1 block"
//                                 >
//                                   Company *
//                                 </label>
//                                 <Input
//                                   id="company"
//                                   value={leadForm.Company}
//                                   onChange={(e) =>
//                                     handleLeadFormChange('Company', e.target.value)
//                                   }
//                                   required
//                                   placeholder="Company name"
//                                   className="w-full"
//                                 />
//                               </div>
//                               <div>
//                                 <label
//                                   htmlFor="email"
//                                   className="text-sm font-medium mb-1 block"
//                                 >
//                                   Email
//                                 </label>
//                                 <Input
//                                   id="email"
//                                   type="email"
//                                   value={leadForm.Email}
//                                   onChange={(e) =>
//                                     handleLeadFormChange('Email', e.target.value)
//                                   }
//                                   placeholder="email@example.com"
//                                   className="w-full"
//                                 />
//                               </div>
//                               <div>
//                                 <label
//                                   htmlFor="phone"
//                                   className="text-sm font-medium mb-1 block"
//                                 >
//                                   Phone
//                                 </label>
//                                 <Input
//                                   id="phone"
//                                   value={leadForm.Phone}
//                                   onChange={(e) =>
//                                     handleLeadFormChange('Phone', e.target.value)
//                                   }
//                                   placeholder="Phone number"
//                                   className="w-full"
//                                 />
//                               </div>
//                               <div>
//                                 <label
//                                   htmlFor="status"
//                                   className="text-sm font-medium mb-1 block"
//                                 >
//                                   Status
//                                 </label>
//                                 <Select
//                                   value={leadForm.Status}
//                                   onValueChange={(value) =>
//                                     handleLeadFormChange('Status', value)
//                                   }
//                                 >
//                                   <SelectTrigger id="status" className="w-full">
//                                     <SelectValue placeholder="Select status" />
//                                   </SelectTrigger>
//                                   <SelectContent>
//                                     {LEAD_STATUS_OPTIONS.map((status) => (
//                                       <SelectItem key={status} value={status}>
//                                         {status}
//                                       </SelectItem>
//                                     ))}
//                                   </SelectContent>
//                                 </Select>
//                               </div>
//                             </div>
//                             <DialogFooter>
//                               <Button
//                                 variant="outline"
//                                 type="button"
//                                 onClick={() => setIsLeadDialogOpen(false)}
//                               >
//                                 Cancel
//                               </Button>
//                               <Button type="submit" disabled={isLoading}>
//                                 {isLoading && (
//                                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                 )}
//                                 {isEditMode ? 'Update' : 'Create'}
//                               </Button>
//                             </DialogFooter>
//                           </form>
//                         </DialogContent>
//                       </Dialog>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   {isLoading && activeTab === 'leads' ? (
//                     <div className="flex justify-center items-center py-12">
//                       <Loader2 className="h-8 w-8 animate-spin text-primary" />
//                     </div>
//                   ) : leads.length === 0 ? (
//                     <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//                       No leads found.
//                     </div>
//                   ) : (
//                     <div className="overflow-x-auto">
//                       <Table>
//                         <TableHeader>
//                           <TableRow className="bg-gray-50 dark:bg-gray-800">
//                             <TableHead>Name</TableHead>
//                             <TableHead>Company</TableHead>
//                             <TableHead className="hidden md:table-cell">Email</TableHead>
//                             <TableHead className="hidden lg:table-cell">Phone</TableHead>
//                             <TableHead>Status</TableHead>
//                             <TableHead className="text-right">Actions</TableHead>
//                           </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                           {leads.map((lead) => (
//                             <TableRow 
//                               key={lead.Id} 
//                               className={lead.IsConverted ? "bg-blue-50 dark:bg-blue-900/20" : ""}
//                             >
//                               <TableCell className="font-medium">
//                                 <div className="flex flex-col sm:flex-row sm:items-center gap-1">
//                                   <span>
//                                     {lead.FirstName} {lead.LastName}
//                                   </span>
//                                   {lead.IsConverted && (
//                                     <Badge variant="secondary" className="ml-0 sm:ml-2 w-fit">
//                                       Converted
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </TableCell>
//                               <TableCell>{lead.Company}</TableCell>
//                               <TableCell className="hidden md:table-cell">{lead.Email}</TableCell>
//                               <TableCell className="hidden lg:table-cell">{lead.Phone}</TableCell>
//                               <TableCell>
//                                 <Badge 
//                                   variant={lead.Status.includes("Closed") ? "outline" : "default"}
//                                   className={
//                                     lead.Status.includes("Converted") 
//                                       ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" 
//                                       : lead.Status.includes("Not Converted") 
//                                         ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
//                                         : ""
//                                   }
//                                 >
//                                   {lead.Status.split(' - ')[0]}
//                                 </Badge>
//                               </TableCell>
//                               <TableCell className="text-right">
//                                 <TooltipProvider>
//                                   <div className="flex justify-end gap-2">
//                                     <Tooltip>
//                                       <TooltipTrigger asChild>
//                                         <Button
//                                           size="icon"
//                                           variant="ghost"
//                                           onClick={() => editLead(lead)}
//                                           disabled={lead.IsConverted}
//                                           className="h-8 w-8"
//                                         >
//                                           <Edit className="h-4 w-4" />
//                                           <span className="sr-only">Edit</span>
//                                         </Button>
//                                       </TooltipTrigger>
//                                       <TooltipContent>
//                                         {lead.IsConverted ? "Cannot edit converted lead" : "Edit lead"}
//                                       </TooltipContent>
//                                     </Tooltip>

//                                     <Tooltip>
//                                       <TooltipTrigger asChild>
//                                         <Button
//                                           size="icon"
//                                           variant="ghost"
//                                           onClick={() => confirmDelete(lead.Id)}
//                                           className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
//                                         >
//                                           <Trash className="h-4 w-4" />
//                                           <span className="sr-only">Delete</span>
//                                         </Button>
//                                       </TooltipTrigger>
//                                       <TooltipContent>Delete lead</TooltipContent>
//                                     </Tooltip>

//                                     <Tooltip>
//                                       <TooltipTrigger asChild>
//                                         <Button
//                                           size="icon"
//                                           variant="ghost"
//                                           onClick={() => openConvertLeadDialog(lead)}
//                                           disabled={lead.IsConverted}
//                                           className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
//                                         >
//                                           <ArrowRightLeft className="h-4 w-4" />
//                                           <span className="sr-only">Convert</span>
//                                         </Button>
//                                       </TooltipTrigger>
//                                       <TooltipContent>
//                                         {lead.IsConverted ? "Lead already converted" : "Convert lead"}
//                                       </TooltipContent>
//                                     </Tooltip>
//                                   </div>
//                                 </TooltipProvider>
//                               </TableCell>
//                             </TableRow>
//                           ))}
//                         </TableBody>
//                       </Table>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>

//           {/* Lead Conversion Dialog */}
//           <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
//             <DialogContent className="sm:max-w-md">
//               <DialogHeader>
//                 <DialogTitle>Convert Lead</DialogTitle>
//               </DialogHeader>
//               <div className="py-4">
//                 {convertLeadData && (
//                   <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
//                     <p className="font-medium">
//                       Converting lead: {convertLeadData.FirstName}{" "}
//                       {convertLeadData.LastName}, {convertLeadData.Company}
//                     </p>
//                   </div>
//                 )}

//                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
//                   This will convert the lead into an account, contact, and
//                   optionally an opportunity.
//                 </p>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox
//                     id="createOpportunity"
//                     checked={createOpportunity}
//                     onCheckedChange={setCreateOpportunity}
//                   />
//                   <label
//                     htmlFor="createOpportunity"
//                     className="text-sm font-medium cursor-pointer"
//                   >
//                     Create Opportunity
//                   </label>
//                 </div>
//               </div>
//               <DialogFooter>
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsConvertDialogOpen(false)}
//                 >
//                   Cancel
//                 </Button>
//                 <Button onClick={convertLead} disabled={isLoading}>
//                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                   Convert Lead
//                 </Button>
//               </DialogFooter>
//             </DialogContent>
//           </Dialog>

//           {/* Delete Confirmation Dialog */}
//           <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
//             <AlertDialogContent>
//               <AlertDialogHeader>
//                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                 <AlertDialogDescription>
//                   This action cannot be undone. This will permanently delete the lead
//                   and remove it from the Salesforce database.
//                 </AlertDialogDescription>
//               </AlertDialogHeader>
//               <AlertDialogFooter>
//                 <AlertDialogCancel>Cancel</AlertDialogCancel>
//                 <AlertDialogAction 
//                   onClick={deleteLead}
//                   className="bg-red-500 hover:bg-red-600 text-white"
//                 >
//                   {isLoading ? (
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
//                   ) : (
//                     <Trash className="mr-2 h-4 w-4" />
//                   )}
//                   Delete
//                 </AlertDialogAction>
//               </AlertDialogFooter>
//             </AlertDialogContent>
//           </AlertDialog>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default LeadManager;






















































































































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
// import { Checkbox } from "../ui/checkbox";
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
//   ArrowRightLeft,
//   ChevronLeft,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   ArrowUpDown,
//   AlertCircle,
// } from "lucide-react";

// // Initial form states
// const initialLeadState = {
//   FirstName: '',
//   LastName: '',
//   Company: '',
//   Email: '',
//   Phone: '',
//   Status: 'Open - Not Contacted',
// };

// // Lead status options
// const leadStatusOptions = [
//   'Open - Not Contacted',
//   'Working - Contacted',
//   'Closed - Converted',
//   'Closed - Not Converted',
// ];

// // Status badge variants
// const getStatusVariant = (status) => {
//   switch (status) {
//     case 'Open - Not Contacted':
//       return 'default';
//     case 'Working - Contacted':
//       return 'secondary';
//     case 'Closed - Converted':
//       return 'success';
//     case 'Closed - Not Converted':
//       return 'destructive';
//     default:
//       return 'outline';
//   }
// };

// const LeadManager = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');

//   // Data state
//   const [leads, setLeads] = useState([]);

//   // UI state
//   const [isLoading, setIsLoading] = useState(false);
//   const { toast } = useToast();
//   const [error, setError] = useState('');
//   const [sorting, setSorting] = useState([]);

//   // Form state
//   const [leadForm, setLeadForm] = useState(initialLeadState);
//   const [isLeadDialogOpen, setIsLeadDialogOpen] = useState(false);
//   const [isEditMode, setIsEditMode] = useState(false);
//   const [currentLeadId, setCurrentLeadId] = useState('');

//   // Convert lead state
//   const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
//   const [convertLeadId, setConvertLeadId] = useState('');
//   const [convertLeadData, setConvertLeadData] = useState(null);
//   const [createOpportunity, setCreateOpportunity] = useState(true);

//   // Define columns for TanStack Table
//   const columns = useMemo(
//     () => [
//       {
//         accessorFn: (row) => `${row.FirstName || ''} ${row.LastName || ''}`,
//         id: 'name',
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
//           const isConverted = row.original.IsConverted;
//           return (
//             <div className="flex items-center gap-2">
//               <span>{row.getValue('name')}</span>
//               {isConverted && (
//                 <Badge variant="secondary" className="text-xs">
//                   Converted
//                 </Badge>
//               )}
//             </div>
//           );
//         },
//       },
//       {
//         accessorKey: 'Company',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Company
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
//         accessorKey: 'Email',
//         header: 'Email',
//       },
//       {
//         accessorKey: 'Phone',
//         header: 'Phone',
//       },
//       {
//         accessorKey: 'Status',
//         header: ({ column }) => (
//           <div className="flex items-center">
//             Status
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
//           const status = row.getValue('Status');
//           return <Badge variant={getStatusVariant(status)}>{status}</Badge>;
//         },
//       },
//       {
//         id: 'actions',
//         cell: ({ row }) => {
//           const lead = row.original;
//           const isConverted = lead.IsConverted;

//           return (
//             <div className="flex items-center justify-end space-x-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => editLead(lead)}
//                       disabled={isConverted}
//                     >
//                       <Edit className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {isConverted ? "Cannot edit converted lead" : "Edit lead"}
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="ghost"
//                       onClick={() => deleteLead(lead.Id)}
//                     >
//                       <Trash className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Delete lead</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button
//                       size="icon"
//                       variant="primary"
//                       className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//                       onClick={() => openConvertLeadDialog(lead)}
//                       disabled={isConverted}
//                     >
//                       <ArrowRightLeft className="h-4 w-4" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     {isConverted ? "Lead already converted" : "Convert lead"}
//                   </TooltipContent>
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
//     data: leads,
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
//       fetchLeads();
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
//   // const fetchLeads = async () => {
//   //   setIsLoading(true);
//   //   // setError('');
//   //   try {
//   //     const records = await executeQuery(
//   //       'SELECT Id, FirstName, LastName, Company, Email, Phone, Status, IsConverted FROM Lead ORDER BY CreatedDate DESC LIMIT 50'
//   //     );
//   //     setLeads(records);
//   //     toast(`Successfully loaded ${records.length} leads.`);
//   //   } catch (err) {
//   //     setError(`Failed to fetch leads: ${err.message}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };
// const fetchLeads = async () => {
//   setIsLoading(true);
//   setError('');
//   try {
//     // Get auth data from state or localStorage
//     const authToken = token || JSON.parse(localStorage.getItem('sfAuthData'))?.accessToken;
//     const authInstanceUrl = instanceUrl || JSON.parse(localStorage.getItem('sfAuthData'))?.instanceUrl;

//     if (!authToken || !authInstanceUrl) {
//       throw new Error('Authentication data is missing');
//     }

//     const response = await fetch('/api/salescloud', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         accessToken: authToken,
//         instanceUrl: authInstanceUrl,
//         query: 'SELECT Id, FirstName, LastName, Company, Email, Phone, Status, IsConverted FROM Lead'
//       }),
//     });

//     const result = await response.json();
//     if (!response.ok) throw new Error(result.error || 'Query execution failed');
    
//     setLeads(result.records || []);
//     toast(`Successfully loaded ${result.records?.length || 0} leads.`);
//   } catch (err) {
//     setError(`Failed to fetch leads: ${err.message}`);
//   } finally {
//     setIsLoading(false);
//   }
// };

//   // CRUD operations for Lead
//   const createLead = async (data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('create', 'Lead', data);
//       setLeadForm(initialLeadState);
//       setIsLeadDialogOpen(false);
//       fetchLeads();
//       toast("Lead created successfully");
//     } catch (err) {
//       setError(`Failed to create lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateLead = async (id, data) => {
//     setIsLoading(true);
//     try {
//       await executeDML('update', 'Lead', data, id);
//       setLeadForm(initialLeadState);
//       setIsLeadDialogOpen(false);
//       setIsEditMode(false);
//       fetchLeads();
//       toast("Lead updated successfully");
//     } catch (err) {
//       setError(`Failed to update lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // const deleteLead = async (id) => {
//   //   if (!confirm("Are you sure you want to delete this lead?")) return;

//   //   setIsLoading(true);
//   //   try {
//   //     await executeDML('delete', 'Lead', {}, id);
//   //     fetchLeads();
//   //   } catch (err) {
//   //     setError(`Failed to delete lead: ${err.message}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

//   // const deleteLead = async (id) => {
//   //   if (!confirm("Are you sure you want to delete this lead?")) return;

//   //   setIsLoading(true);
//   //   try {
//   //     await executeDML('delete', 'Lead', {}, id);
//   //    toast("Lead deleted successfully");
//   //     fetchLeads();
//   //   } catch (err) {
//   //     setError(`Failed to delete lead: ${err.message}`);
//   //   } finally {
//   //     setIsLoading(false);
//   //   }
//   // };

  
// // const deleteLead = async (id) => {
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
// //         objectType: 'Lead',
// //         data: {},
// //         id: id
// //       }),
// //     });

// //     const result = await response.json();
// //     console.log("Delete response:", result);
    
// //     if (!response.ok) {
// //       throw new Error(result.error || 'Delete operation failed');
// //     }
// //     toast("Lead deleted successfully")
// //     fetchLeads();
// //   } catch (err) {
// //     console.error("Delete operation failed:", err);
// //     setError(`Failed to delete Lead: ${err.message}`);
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };
// const deleteLead = async (id) => {
//   if (!confirm("Are you sure you want to delete this lead?")) return;

//   setIsLoading(true);
//   setError('');
  
//   try {
//     // Get auth data directly from localStorage as a fallback
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (!savedAuthData) {
//       throw new Error("Authentication data not found");
//     }
    
//     const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
    
//     // Use the current state values if available, otherwise use from localStorage
//     const authToken = token || accessToken;
//     const authInstanceUrl = instanceUrl || instanceUrl;
    
//     if (!authToken || !authInstanceUrl) {
//       throw new Error("Authentication data is missing");
//     }

//     const response = await fetch('/api/salescloud/dml', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         accessToken: authToken,
//         instanceUrl: authInstanceUrl,
//         operation: 'delete',
//         objectType: 'Lead',
//         data: {},
//         id: id
//       }),
//     });

//     const result = await response.json();
    
//     if (!response.ok) {
//       throw new Error(result.error || 'Delete operation failed');
//     }
    
//     toast("Lead deleted successfully");
//     fetchLeads();
//   } catch (err) {
//     console.error("Delete operation failed:", err);
//     setError(`Failed to delete Lead: ${err.message}`);
//   } finally {
//     setIsLoading(false);
//   }
// };
  
//   // Lead conversion
//   const openConvertLeadDialog = (lead) => {
//     setConvertLeadId(lead.Id);
//     setConvertLeadData(lead);
//     setIsConvertDialogOpen(true);
//   };

//   const convertLead = async () => {
//     if (!convertLeadId || !convertLeadData) return;

//     setIsLoading(true);
//     try {
//       const result = await fetch('/api/salescloud/convert', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           accessToken: token,
//           instanceUrl,
//           leadId: convertLeadId,
//           createOpportunity,
//         }),
//       });

//       const data = await result.json();
//       if (!result.ok) throw new Error(data.error || 'Lead conversion failed');

//       fetchLeads();
//       setIsConvertDialogOpen(false);
//     } catch (err) {
//       setError(`Failed to convert lead: ${err.message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Form handling
//   const handleLeadFormChange = (field, value) => {
//     setLeadForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleLeadSubmit = (e) => {
//     e.preventDefault();
//     if (isEditMode && currentLeadId) {
//       updateLead(currentLeadId, leadForm);
//     } else {
//       createLead(leadForm);
//     }
//   };

//   const editLead = (lead) => {
//     // Check if lead is already converted
//     if (lead.IsConverted) {
//       setError("Cannot edit a converted lead.");
//       return;
//     }

//     setLeadForm({
//       FirstName: lead.FirstName || '',
//       LastName: lead.LastName || '',
//       Company: lead.Company || '',
//       Email: lead.Email || '',
//       Phone: lead.Phone || '',
//       Status: lead.Status || 'Open - Not Contacted',
//     });
//     setCurrentLeadId(lead.Id);
//     setIsEditMode(true);
//     setIsLeadDialogOpen(true);
//   };

//   // Reset forms
//   const resetLeadForm = () => {
//     setLeadForm(initialLeadState);
//     setCurrentLeadId('');
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
//             Please connect to Salesforce to use the Lead Manager.
//           </p>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="p-5 rounded-lg transition-colors">
//       <div className="mb-8">
//         <h2 className="text-3xl font-bold tracking-tight">Lead Manager</h2>
//         <p className="text-muted-foreground mt-2">
//           Create, manage and convert your sales leads in one place.
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
//           <CardTitle className="text-xl">Leads</CardTitle>
//           <div className="flex gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={fetchLeads}
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
//               open={isLeadDialogOpen}
//               onOpenChange={(open) => {
//                 setIsLeadDialogOpen(open);
//                 if (!open) resetLeadForm();
//               }}
//             >
//               <DialogTrigger asChild>
//                 <Button size="sm">
//                   <Plus className="h-4 w-4 mr-2" />
//                   New Lead
//                 </Button>
//               </DialogTrigger>
//               <DialogContent className="sm:max-w-md">
//                 <DialogHeader>
//                   <DialogTitle>
//                     {isEditMode ? 'Edit Lead' : 'Create New Lead'}
//                   </DialogTitle>
//                 </DialogHeader>
//                 <form onSubmit={handleLeadSubmit}>
//                   <div className="grid gap-4 py-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <label
//                           htmlFor="firstName"
//                           className="block text-sm font-medium mb-1"
//                         >
//                           First Name
//                         </label>
//                         <Input
//                           id="firstName"
//                           value={leadForm.FirstName}
//                           onChange={(e) =>
//                             handleLeadFormChange('FirstName', e.target.value)
//                           }
//                         />
//                       </div>
//                       <div>
//                         <label
//                           htmlFor="lastName"
//                           className="block text-sm font-medium mb-1"
//                         >
//                           Last Name *
//                         </label>
//                         <Input
//                           id="lastName"
//                           value={leadForm.LastName}
//                           onChange={(e) =>
//                             handleLeadFormChange('LastName', e.target.value)
//                           }
//                           required
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="company"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Company *
//                       </label>
//                       <Input
//                         id="company"
//                         value={leadForm.Company}
//                         onChange={(e) =>
//                           handleLeadFormChange('Company', e.target.value)
//                         }
//                         required
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="email"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Email
//                       </label>
//                       <Input
//                         id="email"
//                         type="email"
//                         value={leadForm.Email}
//                         onChange={(e) =>
//                           handleLeadFormChange('Email', e.target.value)
//                         }
//                       />
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
//                         value={leadForm.Phone}
//                         onChange={(e) =>
//                           handleLeadFormChange('Phone', e.target.value)
//                         }
//                       />
//                     </div>
//                     <div>
//                       <label
//                         htmlFor="status"
//                         className="block text-sm font-medium mb-1"
//                       >
//                         Status
//                       </label>
//                       <Select
//                         value={leadForm.Status}
//                         onValueChange={(value) =>
//                           handleLeadFormChange('Status', value)
//                         }
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {leadStatusOptions.map((status) => (
//                             <SelectItem key={status} value={status}>
//                               {status}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </div>
//                   </div>
//                   <DialogFooter>
//                     <Button
//                       variant="outline"
//                       type="button"
//                       onClick={() => setIsLeadDialogOpen(false)}
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
//           {isLoading && leads.length === 0 ? (
//             <div className="flex justify-center items-center py-12">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : leads.length === 0 ? (
//             <div className="text-center py-12 text-muted-foreground">
//               <div className="mb-3">No leads found.</div>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsLeadDialogOpen(true)}
//                 className="mt-2"
//               >
//                 <Plus className="h-4 w-4 mr-2" />
//                 Create your first lead
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
//                           row.original.IsConverted
//                             ? "bg-blue-50/50 dark:bg-blue-950/20"
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
//         {leads.length > 0 && (
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
//                 leads.length
//               )}{" "}
//               of {leads.length} leads
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

//       {/* Lead Conversion Dialog */}
//       <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Convert Lead</DialogTitle>
//           </DialogHeader>
//           <div className="py-4">
//             {convertLeadData && (
//               <div className="mb-6">
//                 <div className="flex flex-col space-y-1">
//                   <div className="text-lg font-semibold">
//                     {convertLeadData.FirstName} {convertLeadData.LastName}
//                   </div>
//                   <div className="text-sm text-muted-foreground">
//                     {convertLeadData.Company}
//                   </div>
//                 </div>
//               </div>
//             )}

//             <p className="text-sm text-muted-foreground mb-6">
//               This will convert the lead into an account, contact, and
//               optionally an opportunity.
//             </p>

//             <div className="flex items-center space-x-2 bg-muted/50 p-3 rounded-md">
//               <Checkbox
//                 id="createOpportunity"
//                 checked={createOpportunity}
//                 onCheckedChange={setCreateOpportunity}
//               />
//               <label
//                 htmlFor="createOpportunity"
//                 className="text-sm font-medium leading-none"
//               >
//                 Create Opportunity
//               </label>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsConvertDialogOpen(false)}
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={convertLead}
//               disabled={isLoading}
//               className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
//             >
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Convert Lead
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

// export default LeadManager;
