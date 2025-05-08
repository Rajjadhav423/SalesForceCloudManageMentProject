// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Button } from "../components/ui/badge";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/card";
// import { Input } from "../components/ui/input";
// import { Textarea } from "../components/ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
// import { Loader2, Wand2, Play, Save, Copy, Sparkles } from "lucide-react";
// import { toast } from "sonner";

// const AIQueryAssistant = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');
  
//   // Query state
//   const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
//   const [generatedQuery, setGeneratedQuery] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [queryResults, setQueryResults] = useState([]);
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [error, setError] = useState('');
//   const [queryHistory, setQueryHistory] = useState([]);
//   const [activeTab, setActiveTab] = useState('generate');

//   // Load auth data from localStorage on component mount
//   useEffect(() => {
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (savedAuthData) {
//       const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//       setToken(accessToken);
//       setInstanceUrl(instanceUrl);
//     }
//   }, []);

//   // Generate SOQL query using Gemini API
//   const generateQuery = async () => {
//     if (!naturalLanguagePrompt.trim()) {
//       toast.error('Please enter a prompt to generate a query');
//       return;
//     }

//     setIsGenerating(true);
//     setError('');

//     try {
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: naturalLanguagePrompt }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to generate query');
//       }

//       setGeneratedQuery(result.query);
//       setActiveTab('execute');
//       toast.success('Query generated successfully!');
      
//     } catch (err) {
//       setError(err.message || 'Error generating query');
//       toast.error('Failed to generate query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Execute the generated SOQL query
//   const executeQuery = async () => {
//     if (!generatedQuery.trim()) {
//       toast.error('No query to execute');
//       return;
//     }

//     if (!token || !instanceUrl) {
//       toast.error('Salesforce authentication required');
//       return;
//     }

//     setIsExecuting(true);
//     setError('');

//     try {
//       const response = await fetch('/api/salescloud', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           accessToken: token, 
//           instanceUrl, 
//           query: generatedQuery 
//         }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Query execution failed');
//       }

//       setQueryResults(result.records || []);
      
//       // Save to query history
//       const newHistoryItem = {
//         id: Date.now(),
//         prompt: naturalLanguagePrompt,
//         query: generatedQuery,
//         timestamp: new Date().toISOString()
//       };
      
//       setQueryHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10 queries
//       localStorage.setItem('queryHistory', JSON.stringify([newHistoryItem, ...queryHistory].slice(0, 10)));
      
//       setActiveTab('results');
//       toast.success(`Query executed successfully! Found ${result.records?.length || 0} records.`);
      
//     } catch (err) {
//       setError(err.message || 'Error executing query');
//       toast.error('Failed to execute query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   // Improve the query with AI
//   const improveQuery = async () => {
//     if (!generatedQuery.trim()) {
//       toast.error('No query to improve');
//       return;
//     }

//     setIsGenerating(true);
//     setError('');

//     try {
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           prompt: `Improve this SOQL query for better performance and clarity, keeping the same functionality: ${generatedQuery}` 
//         }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to improve query');
//       }

//       setGeneratedQuery(result.query);
//       toast.success('Query improved!');
      
//     } catch (err) {
//       setError(err.message || 'Error improving query');
//       toast.error('Failed to improve query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Copy query to clipboard
//   const copyQuery = () => {
//     navigator.clipboard.writeText(generatedQuery);
//     toast.success('Query copied to clipboard');
//   };

//   // Load a query from history
//   const loadQueryFromHistory = (historyItem) => {
//     setNaturalLanguagePrompt(historyItem.prompt);
//     setGeneratedQuery(historyItem.query);
//     setActiveTab('execute');
//   };

//   // Render query results as a table
//   const renderQueryResults = () => {
//     if (queryResults.length === 0) {
//       return <div className="text-center py-4 text-gray-500">No records found</div>;
//     }

//     // Extract field names from the first record
//     const fields = Object.keys(queryResults[0]).filter(key => key !== 'attributes');

//     return (
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               {fields.map(field => (
//                 <th key={field} className="p-2 text-left border border-gray-300">{field}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {queryResults.map((record, index) => (
//               <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                 {fields.map(field => (
//                   <td key={`${index}-${field}`} className="p-2 border border-gray-300">
//                     {typeof record[field] === 'object' ? 
//                       JSON.stringify(record[field]) : String(record[field] || '')}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Wand2 className="h-6 w-6 text-blue-500" />
//           AI Query Assistant
//         </CardTitle>
//         <CardDescription>
//           Generate and execute Salesforce SOQL queries using natural language
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid grid-cols-4 mb-4">
//             <TabsTrigger value="generate">Generate</TabsTrigger>
//             <TabsTrigger value="execute">Execute</TabsTrigger>
//             <TabsTrigger value="results">Results</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="generate" className="space-y-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">What would you like to query?</label>
//               <Textarea
//                 placeholder="Example: Show me the top 10 accounts by revenue created this month"
//                 value={naturalLanguagePrompt}
//                 onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
//                 className="min-h-[100px]"
//               />
//             </div>
            
//             <div className="flex justify-end">
//               <Button 
//                 onClick={generateQuery} 
//                 disabled={isGenerating || !naturalLanguagePrompt.trim()}
//                 className="gap-2"
//               >
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Wand2 className="h-4 w-4" />
//                     Generate Query
//                   </>
//                 )}
//               </Button>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="execute" className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-medium">Generated SOQL Query</label>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" onClick={copyQuery} className="gap-1">
//                     <Copy className="h-3 w-3" />
//                     Copy
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={improveQuery} disabled={isGenerating} className="gap-1">
//                     {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
//                     Improve
//                   </Button>
//                 </div>
//               </div>
//               <Textarea
//                 value={generatedQuery}
//                 onChange={(e) => setGeneratedQuery(e.target.value)}
//                 className="font-mono text-sm min-h-[150px]"
//               />
//             </div>
            
//             <div className="flex justify-end">
//               <Button 
//                 onClick={executeQuery} 
//                 disabled={isExecuting || !generatedQuery.trim() || !token}
//                 className="gap-2"
//               >
//                 {isExecuting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Executing...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-4 w-4" />
//                     Execute Query
//                   </>
//                 )}
//               </Button>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="results" className="space-y-4">
//             <h3 className="text-sm font-medium">Query Results</h3>
//             {error ? (
//               <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
//             ) : queryResults.length > 0 ? (
//               renderQueryResults()
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No results yet. Generate and execute a query first.
//               </div>
//             )}
//           </TabsContent>
          
//           <TabsContent value="history" className="space-y-4">
//             <h3 className="text-sm font-medium">Query History</h3>
//             {queryHistory.length > 0 ? (
//               <div className="space-y-3">
//                 {queryHistory.map((item) => (
//                   <Card key={item.id} className="bg-gray-50">
//                     <CardContent className="p-4">
//                       <div className="font-medium">{item.prompt}</div>
//                       <div className="text-xs text-gray-500 font-mono mt-1 line-clamp-1">{item.query}</div>
//                       <div className="flex justify-between items-center mt-2">
//                         <div className="text-xs text-gray-500">
//                           {new Date(item.timestamp).toLocaleString()}
//                         </div>
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           onClick={() => loadQueryFromHistory(item)}
//                         >
//                           Use Again
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No query history yet.
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
      
//       {error && (
//         <CardFooter className="bg-red-50 text-red-700 p-3 text-sm">
//           Error: {error}
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export default AIQueryAssistant;


// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Button } from "../ui/button"; // Fixed import from ui/button instead of ui/badge
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { Loader2, Wand2, Play, Save, Copy, Sparkles } from "lucide-react";
// import { toast } from "sonner";

// const AIQueryAssistant = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');
  
//   // Query state
//   const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
//   const [generatedQuery, setGeneratedQuery] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [queryResults, setQueryResults] = useState([]);
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [error, setError] = useState('');
//   const [queryHistory, setQueryHistory] = useState([]);
//   const [activeTab, setActiveTab] = useState('generate');

//   // Load auth data from localStorage on component mount
//   useEffect(() => {
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (savedAuthData) {
//       const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//       setToken(accessToken);
//       setInstanceUrl(instanceUrl);
//     }
//   }, []);

//   // Generate SOQL query using Gemini API
//   const generateQuery = async () => {
//     if (!naturalLanguagePrompt.trim()) {
//       toast.error('Please enter a prompt to generate a query');
//       return;
//     }

//     setIsGenerating(true);
//     setError('');

//     try {
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: naturalLanguagePrompt }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to generate query');
//       }

//       setGeneratedQuery(result.query);
//       setActiveTab('execute');
//       toast.success('Query generated successfully!');
      
//     } catch (err) {
//       setError(err.message || 'Error generating query');
//       toast.error('Failed to generate query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Execute the generated SOQL query
//   const executeQuery = async () => {
//     if (!generatedQuery.trim()) {
//       toast.error('No query to execute');
//       return;
//     }

//     if (!token || !instanceUrl) {
//       toast.error('Salesforce authentication required');
//       return;
//     }

//     setIsExecuting(true);
//     setError('');

//     try {
//       const response = await fetch('/api/salescloud', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           accessToken: token, 
//           instanceUrl, 
//           query: generatedQuery 
//         }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Query execution failed');
//       }

//       setQueryResults(result.records || []);
      
//       // Save to query history
//       const newHistoryItem = {
//         id: Date.now(),
//         prompt: naturalLanguagePrompt,
//         query: generatedQuery,
//         timestamp: new Date().toISOString()
//       };
      
//       setQueryHistory(prev => [newHistoryItem, ...prev].slice(0, 10)); // Keep last 10 queries
//       localStorage.setItem('queryHistory', JSON.stringify([newHistoryItem, ...queryHistory].slice(0, 10)));
      
//       setActiveTab('results');
//       toast.success(`Query executed successfully! Found ${result.records?.length || 0} records.`);
      
//     } catch (err) {
//       setError(err.message || 'Error executing query');
//       toast.error('Failed to execute query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   // Improve the query with AI
//   const improveQuery = async () => {
//     if (!generatedQuery.trim()) {
//       toast.error('No query to improve');
//       return;
//     }

//     setIsGenerating(true);
//     setError('');

//     try {
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           prompt: `Improve this SOQL query for better performance and clarity, keeping the same functionality: ${generatedQuery}` 
//         }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to improve query');
//       }

//       setGeneratedQuery(result.query);
//       toast.success('Query improved!');
      
//     } catch (err) {
//       setError(err.message || 'Error improving query');
//       toast.error('Failed to improve query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Copy query to clipboard
//   const copyQuery = () => {
//     navigator.clipboard.writeText(generatedQuery);
//     toast.success('Query copied to clipboard');
//   };

//   // Load a query from history
//   const loadQueryFromHistory = (historyItem) => {
//     setNaturalLanguagePrompt(historyItem.prompt);
//     setGeneratedQuery(historyItem.query);
//     setActiveTab('execute');
//   };

//   // Render query results as a table
//   const renderQueryResults = () => {
//     if (queryResults.length === 0) {
//       return <div className="text-center py-4 text-gray-500">No records found</div>;
//     }

//     // Extract field names from the first record
//     const fields = Object.keys(queryResults[0]).filter(key => key !== 'attributes');

//     return (
//       <div className="overflow-x-auto">
//         <table className="w-full border-collapse">
//           <thead>
//             <tr className="bg-gray-100">
//               {fields.map(field => (
//                 <th key={field} className="p-2 text-left border border-gray-300">{field}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {queryResults.map((record, index) => (
//               <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                 {fields.map(field => (
//                   <td key={`${index}-${field}`} className="p-2 border border-gray-300">
//                     {typeof record[field] === 'object' ? 
//                       JSON.stringify(record[field]) : String(record[field] || '')}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   return (
//     <Card className="w-full">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Wand2 className="h-6 w-6 text-blue-500" />
//           AI Query Assistant
//         </CardTitle>
//         <CardDescription>
//           Generate and execute Salesforce SOQL queries using natural language
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent>
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid grid-cols-4 mb-4">
//             <TabsTrigger value="generate">Generate</TabsTrigger>
//             <TabsTrigger value="execute">Execute</TabsTrigger>
//             <TabsTrigger value="results">Results</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="generate" className="space-y-4">
//             <div className="space-y-2">
//               <label className="text-sm font-medium">What would you like to query?</label>
//               <Textarea
//                 placeholder="Example: Show me the top 10 accounts by revenue created this month"
//                 value={naturalLanguagePrompt}
//                 onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
//                 className="min-h-[100px]"
//               />
//             </div>
            
//             <div className="flex justify-end">
//               <Button 
//                 onClick={generateQuery} 
//                 disabled={isGenerating || !naturalLanguagePrompt.trim()}
//                 className="gap-2"
//               >
//                 {isGenerating ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Generating...
//                   </>
//                 ) : (
//                   <>
//                     <Wand2 className="h-4 w-4" />
//                     Generate Query
//                   </>
//                 )}
//               </Button>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="execute" className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-medium">Generated SOQL Query</label>
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" onClick={copyQuery} className="gap-1">
//                     <Copy className="h-3 w-3" />
//                     Copy
//                   </Button>
//                   <Button variant="outline" size="sm" onClick={improveQuery} disabled={isGenerating} className="gap-1">
//                     {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
//                     Improve
//                   </Button>
//                 </div>
//               </div>
//               <Textarea
//                 value={generatedQuery}
//                 onChange={(e) => setGeneratedQuery(e.target.value)}
//                 className="font-mono text-sm min-h-[150px]"
//               />
//             </div>
            
//             <div className="flex justify-end">
//               <Button 
//                 onClick={executeQuery} 
//                 disabled={isExecuting || !generatedQuery.trim() || !token}
//                 className="gap-2"
//               >
//                 {isExecuting ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Executing...
//                   </>
//                 ) : (
//                   <>
//                     <Play className="h-4 w-4" />
//                     Execute Query
//                   </>
//                 )}
//               </Button>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="results" className="space-y-4">
//             <h3 className="text-sm font-medium">Query Results</h3>
//             {error ? (
//               <div className="p-4 bg-red-50 text-red-700 rounded-md">{error}</div>
//             ) : queryResults.length > 0 ? (
//               renderQueryResults()
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No results yet. Generate and execute a query first.
//               </div>
//             )}
//           </TabsContent>
          
//           <TabsContent value="history" className="space-y-4">
//             <h3 className="text-sm font-medium">Query History</h3>
//             {queryHistory.length > 0 ? (
//               <div className="space-y-3">
//                 {queryHistory.map((item) => (
//                   <Card key={item.id} className="bg-gray-50">
//                     <CardContent className="p-4">
//                       <div className="font-medium">{item.prompt}</div>
//                       <div className="text-xs text-gray-500 font-mono mt-1 line-clamp-1">{item.query}</div>
//                       <div className="flex justify-between items-center mt-2">
//                         <div className="text-xs text-gray-500">
//                           {new Date(item.timestamp).toLocaleString()}
//                         </div>
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           onClick={() => loadQueryFromHistory(item)}
//                         >
//                           Use Again
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No query history yet.
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
      
//       {error && (
//         <CardFooter className="bg-red-50 text-red-700 p-3 text-sm">
//           Error: {error}
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export default AIQueryAssistant;



// 'use client';
// import React, { useState, useEffect } from 'react';
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
// import { 
//   Loader2, 
//   Wand2, 
//   Play, 
//   Save, 
//   Copy, 
//   Sparkles, 
//   History, 
//   Database, 
//   FileText, 
//   AlignLeft, 
//   AlertCircle,
//   X,
//   ChevronRight
// } from "lucide-react";
// import { toast } from "sonner";
// import { motion } from "framer-motion";
// import {
//   Alert,
//   AlertDescription,
//   AlertTitle,
// } from "../ui/alert";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
// import { Badge } from "../ui/badge";
// import { ScrollArea } from "../ui/scroll-area";
// import { Separator } from "../ui/separator";

// const AIQueryAssistant = () => {
//   // Auth state
//   const [instanceUrl, setInstanceUrl] = useState('');
//   const [token, setToken] = useState('');
  
//   // Query state
//   const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
//   const [generatedQuery, setGeneratedQuery] = useState('');
//   const [isGenerating, setIsGenerating] = useState(false);
//   const [queryResults, setQueryResults] = useState([]);
//   const [isExecuting, setIsExecuting] = useState(false);
//   const [error, setError] = useState('');
//   const [queryHistory, setQueryHistory] = useState([]);
//   const [activeTab, setActiveTab] = useState('generate');
//   const [showConnectionStatus, setShowConnectionStatus] = useState(true);

//   // Load auth data from localStorage on component mount
//   useEffect(() => {
//     const savedAuthData = localStorage.getItem('sfAuthData');
//     if (savedAuthData) {
//       const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
//       setToken(accessToken);
//       setInstanceUrl(instanceUrl);
//     }

//     const savedHistory = localStorage.getItem('queryHistory');
//     if (savedHistory) {
//       setQueryHistory(JSON.parse(savedHistory));
//     }
//   }, []);

//   // Generate SOQL query using Gemini API
//   const generateQuery = async () => {
//     if (!naturalLanguagePrompt.trim()) {
//       toast.error('Please enter a prompt to generate a query');
//       return;
//     }

//     setIsGenerating(true);
//     setError('');

//     try {
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: naturalLanguagePrompt }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to generate query');
//       }

//       setGeneratedQuery(result.query);
//       setActiveTab('execute');
//       toast.success('Query generated successfully!');
      
//     } catch (err) {
//       setError(err.message || 'Error generating query');
//       toast.error('Failed to generate query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Execute the generated SOQL query
//   const executeQuery = async () => {
//     if (!generatedQuery.trim()) {
//       toast.error('No query to execute');
//       return;
//     }

//     if (!token || !instanceUrl) {
//       toast.error('Salesforce authentication required');
//       return;
//     }

//     setIsExecuting(true);
//     setError('');

//     try {
//       const response = await fetch('/api/salescloud', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           accessToken: token, 
//           instanceUrl, 
//           query: generatedQuery 
//         }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Query execution failed');
//       }

//       setQueryResults(result.records || []);
      
//       // Save to query history
//       const newHistoryItem = {
//         id: Date.now(),
//         prompt: naturalLanguagePrompt,
//         query: generatedQuery,
//         timestamp: new Date().toISOString(),
//         resultCount: result.records?.length || 0
//       };
      
//       const updatedHistory = [newHistoryItem, ...queryHistory].slice(0, 10);
//       setQueryHistory(updatedHistory);
//       localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      
//       setActiveTab('results');
//       toast.success(`Query executed successfully! Found ${result.records?.length || 0} records.`);
      
//     } catch (err) {
//       setError(err.message || 'Error executing query');
//       toast.error('Failed to execute query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   // Improve the query with AI
//   const improveQuery = async () => {
//     if (!generatedQuery.trim()) {
//       toast.error('No query to improve');
//       return;
//     }

//     setIsGenerating(true);
//     setError('');

//     try {
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           prompt: `Improve this SOQL query for better performance and clarity, keeping the same functionality: ${generatedQuery}` 
//         }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to improve query');
//       }

//       setGeneratedQuery(result.query);
//       toast.success('Query improved!');
      
//     } catch (err) {
//       setError(err.message || 'Error improving query');
//       toast.error('Failed to improve query: ' + (err.message || 'Unknown error'));
//     } finally {
//       setIsGenerating(false);
//     }
//   };

//   // Copy query to clipboard
//   const copyQuery = () => {
//     navigator.clipboard.writeText(generatedQuery);
//     toast.success('Query copied to clipboard');
//   };

//   // Load a query from history
//   const loadQueryFromHistory = (historyItem) => {
//     setNaturalLanguagePrompt(historyItem.prompt);
//     setGeneratedQuery(historyItem.query);
//     setActiveTab('execute');
//   };

//   // Clear all history
//   const clearHistory = () => {
//     setQueryHistory([]);
//     localStorage.removeItem('queryHistory');
//     toast.success('Query history cleared');
//   };

//   // Render query results as a table
//   const renderQueryResults = () => {
//     if (queryResults.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//           <Database className="h-12 w-12 mb-4 opacity-30" />
//           <p>No records found</p>
//         </div>
//       );
//     }

//     // Extract field names from the first record
//     const fields = Object.keys(queryResults[0]).filter(key => key !== 'attributes');

//     return (
//       <ScrollArea className="h-[400px] w-full rounded-md border">
//         <div className="w-full p-0">
//           <table className="w-full border-collapse">
//             <thead className="sticky top-0 bg-slate-50">
//               <tr>
//                 {fields.map(field => (
//                   <th key={field} className="p-3 text-left border-b border-gray-200 font-semibold text-sm text-gray-700">
//                     {field}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {queryResults.map((record, index) => (
//                 <tr key={index} className="hover:bg-slate-50 transition-colors">
//                   {fields.map(field => (
//                     <td key={`${index}-${field}`} className="p-3 border-b border-gray-100 text-sm">
//                       {typeof record[field] === 'object' ? 
//                         JSON.stringify(record[field]) : String(record[field] || '')}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </ScrollArea>
//     );
//   };

//   // Connection status
//   const connectionStatus = token && instanceUrl ? (
//     <Alert className="mb-4 bg-green-50 text-green-800 border-green-100">
//       <Database className="h-4 w-4 text-green-600" />
//       <AlertTitle className="text-green-800">Connected to Salesforce</AlertTitle>
//       <AlertDescription className="text-green-700 text-xs">
//         Instance: {instanceUrl.replace('https://', '')}
//         <Button 
//           variant="link" 
//           size="sm" 
//           className="text-xs p-0 h-4 ml-2 text-green-800" 
//           onClick={() => setShowConnectionStatus(false)}
//         >
//           Dismiss
//         </Button>
//       </AlertDescription>
//     </Alert>
//   ) : (
//     <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-100">
//       <AlertCircle className="h-4 w-4 text-amber-600" />
//       <AlertTitle className="text-amber-800">Not connected to Salesforce</AlertTitle>
//       <AlertDescription className="text-amber-700 text-xs">
//         Please authenticate with Salesforce to execute queries
//       </AlertDescription>
//     </Alert>
//   );

//   const tabIcons = {
//     'generate': <AlignLeft className="h-4 w-4" />,
//     'execute': <FileText className="h-4 w-4" />,
//     'results': <Database className="h-4 w-4" />,
//     'history': <History className="h-4 w-4" />,
//   };

//   return (
//     <Card className="w-full shadow-lg border-slate-200">
//       <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
//         <CardTitle className="flex items-center gap-2 text-blue-700">
//           <Wand2 className="h-6 w-6 text-blue-500" />
//           AI Query Assistant
//         </CardTitle>
//         <CardDescription className="text-slate-600">
//           Generate and execute Salesforce SOQL queries using natural language
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="p-6">
//         {showConnectionStatus && connectionStatus}
        
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className="grid grid-cols-4 mb-6">
//             {Object.entries(tabIcons).map(([key, icon]) => (
//               <TabsTrigger 
//                 key={key} 
//                 value={key}
//                 className="flex items-center gap-2"
//               >
//                 {icon}
//                 <span className="capitalize">{key}</span>
//               </TabsTrigger>
//             ))}
//           </TabsList>
          
//           <TabsContent value="generate" className="space-y-4 mt-2">
//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-2">
//                 <AlignLeft className="h-4 w-4 text-blue-500" />
//                 What would you like to query?
//               </label>
//               <Textarea
//                 placeholder="Example: Show me the top 10 accounts by revenue created this month"
//                 value={naturalLanguagePrompt}
//                 onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
//                 className="min-h-[150px] text-base"
//               />
//               <p className="text-xs text-gray-500 mt-1">
//                 Describe what data you want to retrieve in natural language. Our AI will convert this to a SOQL query.
//               </p>
//             </div>
            
//             <div className="flex justify-end mt-6">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button 
//                       onClick={generateQuery} 
//                       disabled={isGenerating || !naturalLanguagePrompt.trim()}
//                       className="gap-2 bg-blue-600 hover:bg-blue-700"
//                       size="lg"
//                     >
//                       {isGenerating ? (
//                         <>
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                           Generating...
//                         </>
//                       ) : (
//                         <>
//                           <Wand2 className="h-5 w-5" />
//                           Generate Query
//                         </>
//                       )}
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Transform your natural language into a SOQL query</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="execute" className="space-y-6 mt-2">
//             <div className="space-y-2">
//               <div className="flex justify-between items-center">
//                 <label className="text-sm font-medium flex items-center gap-2">
//                   <FileText className="h-4 w-4 text-blue-500" />
//                   Generated SOQL Query
//                 </label>
//                 <div className="flex gap-2">
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button variant="outline" size="sm" onClick={copyQuery} className="gap-1">
//                           <Copy className="h-3.5 w-3.5" />
//                           Copy
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Copy query to clipboard</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
                  
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           onClick={improveQuery} 
//                           disabled={isGenerating} 
//                           className="gap-1"
//                         >
//                           {isGenerating ? (
//                             <Loader2 className="h-3.5 w-3.5 animate-spin" />
//                           ) : (
//                             <Sparkles className="h-3.5 w-3.5 text-amber-500" />
//                           )}
//                           Optimize
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Improve query performance and readability</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
//                 </div>
//               </div>
              
//               <div className="relative">
//                 <Textarea
//                   value={generatedQuery}
//                   onChange={(e) => setGeneratedQuery(e.target.value)}
//                   className="font-mono text-sm min-h-[200px] bg-slate-50 border-slate-200"
//                 />
//                 {!generatedQuery && (
//                   <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
//                     <div className="text-center">
//                       <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
//                       <p>No query generated yet</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               <p className="text-xs text-gray-500 mt-1">
//                 You can edit this query manually or improve it with AI
//               </p>
//             </div>
            
//             <div className="flex justify-end mt-6">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button 
//                       onClick={executeQuery} 
//                       disabled={isExecuting || !generatedQuery.trim() || !token}
//                       className="gap-2 bg-green-600 hover:bg-green-700"
//                       size="lg"
//                     >
//                       {isExecuting ? (
//                         <>
//                           <Loader2 className="h-4 w-4 animate-spin" />
//                           Executing...
//                         </>
//                       ) : (
//                         <>
//                           <Play className="h-5 w-5" />
//                           Execute Query
//                         </>
//                       )}
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>
//                     <p>Run this query against your Salesforce org</p>
//                   </TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>
//             </div>
//           </TabsContent>
          
//           <TabsContent value="results" className="space-y-4 mt-2">
//             <div className="flex justify-between items-center">
//               <h3 className="text-sm font-medium flex items-center gap-2">
//                 <Database className="h-4 w-4 text-blue-500" />
//                 Query Results
//                 {queryResults.length > 0 && (
//                   <Badge variant="secondary" className="ml-2">
//                     {queryResults.length} records
//                   </Badge>
//                 )}
//               </h3>
              
//               {queryResults.length > 0 && (
//                 <div className="flex gap-2">
//                   <Button variant="outline" size="sm" className="gap-1">
//                     <Save className="h-3.5 w-3.5" />
//                     Export CSV
//                   </Button>
//                 </div>
//               )}
//             </div>
            
//             {error ? (
//               <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
//                 <AlertCircle className="h-4 w-4" />
//                 <AlertTitle>Error executing query</AlertTitle>
//                 <AlertDescription className="font-mono text-sm mt-2">
//                   {error}
//                 </AlertDescription>
//               </Alert>
//             ) : (
//               renderQueryResults()
//             )}
//           </TabsContent>
          
//           <TabsContent value="history" className="space-y-4 mt-2">
//             <div className="flex justify-between items-center">
//               <h3 className="text-sm font-medium flex items-center gap-2">
//                 <History className="h-4 w-4 text-blue-500" />
//                 Query History
//               </h3>
              
//               {queryHistory.length > 0 && (
//                 <Button 
//                   variant="outline" 
//                   size="sm" 
//                   onClick={clearHistory}
//                   className="text-red-500 border-red-200 hover:bg-red-50"
//                 >
//                   <X className="h-3.5 w-3.5 mr-1" />
//                   Clear History
//                 </Button>
//               )}
//             </div>
            
//             {queryHistory.length > 0 ? (
//               <div className="space-y-3">
//                 {queryHistory.map((item) => (
//                   <Card key={item.id} className="overflow-hidden border-slate-200 hover:border-blue-200 transition-colors">
//                     <CardContent className="p-4">
//                       <div className="font-medium text-blue-700">{item.prompt}</div>
//                       <div className="text-xs text-gray-500 font-mono mt-2 line-clamp-1 bg-slate-50 p-2 rounded">
//                         {item.query}
//                       </div>
//                       <div className="flex justify-between items-center mt-3">
//                         <div className="flex items-center gap-2">
//                           <Badge variant="outline" className="text-xs">
//                             {new Date(item.timestamp).toLocaleDateString()}
//                           </Badge>
//                           {item.resultCount !== undefined && (
//                             <Badge variant="secondary" className="text-xs">
//                               {item.resultCount} results
//                             </Badge>
//                           )}
//                         </div>
//                         <Button 
//                           variant="ghost" 
//                           size="sm" 
//                           onClick={() => loadQueryFromHistory(item)}
//                           className="text-blue-600 hover:text-blue-700 gap-1"
//                         >
//                           Use Again
//                           <ChevronRight className="h-3.5 w-3.5" />
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             ) : (
//               <div className="flex flex-col items-center justify-center py-12 text-gray-500">
//                 <History className="h-12 w-12 mb-4 opacity-30" />
//                 <p>No query history yet</p>
//               </div>
//             )}
//           </TabsContent>
//         </Tabs>
//       </CardContent>
      
//       {error && (
//         <CardFooter className="bg-red-50 text-red-700 p-4 text-sm flex items-start gap-2 border-t border-red-100">
//           <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
//           <div>
//             <strong className="font-medium">Error:</strong> {error}
//           </div>
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export default AIQueryAssistant;












'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { 
  Loader2, 
  Wand2, 
  Play, 
  Save, 
  Copy, 
  Sparkles, 
  History, 
  Database, 
  FileText, 
  AlignLeft, 
  AlertCircle,
  X,
  ChevronRight,
  Trash2,
  RefreshCw,
  Download,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Checkbox } from "../ui/checkbox";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const AIQueryAssistant = () => {
  // Auth state
  const [instanceUrl, setInstanceUrl] = useState('');
  const [token, setToken] = useState('');
  
  // Query state
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] = useState('');
  const [generatedQuery, setGeneratedQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [queryResults, setQueryResults] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState('');
  const [queryHistory, setQueryHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('generate');
  const [showConnectionStatus, setShowConnectionStatus] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  
  // CRUD state
  const [selectedRows, setSelectedRows] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [objectType, setObjectType] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  // Load auth data from localStorage on component mount
  useEffect(() => {
    const savedAuthData = localStorage.getItem('sfAuthData');
    if (savedAuthData) {
      const { accessToken, instanceUrl } = JSON.parse(savedAuthData);
      setToken(accessToken);
      setInstanceUrl(instanceUrl);
    }

    const savedHistory = localStorage.getItem('queryHistory');
    if (savedHistory) {
      setQueryHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Detect object type from query
  useEffect(() => {
    if (generatedQuery) {
      const match = generatedQuery.match(/FROM\s+(\w+)/i);
      if (match && match[1]) {
        setObjectType(match[1]);
      }
    }
  }, [generatedQuery]);

  // Generate SOQL query using Gemini API
  const generateQuery = async () => {
    if (!naturalLanguagePrompt.trim()) {
      toast.error('Please enter a prompt to generate a query');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: naturalLanguagePrompt }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate query');
      }

      setGeneratedQuery(result.query);
      setActiveTab('execute');
      toast.success('Query generated successfully!');
      
    } catch (err) {
      setError(err.message || 'Error generating query');
      toast.error('Failed to generate query: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Execute the generated SOQL query
  const executeQuery = async (customQuery = null) => {
    const queryToExecute = customQuery || generatedQuery;
    
    if (!queryToExecute.trim()) {
      toast.error('No query to execute');
      return;
    }

    if (!token || !instanceUrl) {
      toast.error('Salesforce authentication required');
      return;
    }

    setIsExecuting(true);
    setError('');
    setSelectedRows([]);

    try {
      const response = await fetch('/api/salescloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accessToken: token, 
          instanceUrl, 
          query: queryToExecute 
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Query execution failed');
      }

      setQueryResults(result.records || []);
      
      // Save to query history if it's not a custom query (e.g., a delete query)
      if (!customQuery) {
        const newHistoryItem = {
          id: Date.now(),
          prompt: naturalLanguagePrompt,
          query: queryToExecute,
          timestamp: new Date().toISOString(),
          resultCount: result.records?.length || 0,
          objectType: objectType
        };
        
        const updatedHistory = [newHistoryItem, ...queryHistory].slice(0, 10);
        setQueryHistory(updatedHistory);
        localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
      }
      
      setActiveTab('results');
      toast.success(`Query executed successfully! Found ${result.records?.length || 0} records.`);
      
    } catch (err) {
      setError(err.message || 'Error executing query');
      toast.error('Failed to execute query: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExecuting(false);
    }
  };

  // Delete selected records
  const deleteSelectedRecords = async () => {
    if (selectedRows.length === 0) {
      toast.error('No records selected for deletion');
      return;
    }

    if (!token || !instanceUrl) {
      toast.error('Salesforce authentication required');
      return;
    }

    setIsDeleting(true);
    setError('');

    try {
      // Extract the IDs of selected records
      const recordIds = selectedRows.map(rowIndex => queryResults[rowIndex].Id);
      
      // Generate DELETE query
      const deleteQuery = `DELETE FROM ${objectType} WHERE Id IN ('${recordIds.join("','")}')`;
      
      // Execute the delete operation
      const response = await fetch('/api/salescloud', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          accessToken: token, 
          instanceUrl, 
          operation: 'delete',
          objectType: objectType,
          ids: recordIds
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Delete operation failed');
      }
      
      // Refresh the records
      const refreshQuery = generatedQuery;
      await executeQuery(refreshQuery);
      
      setSelectedRows([]);
      setShowDeleteConfirm(false);
      toast.success(`Successfully deleted ${recordIds.length} records!`);
      
    } catch (err) {
      setError(err.message || 'Error deleting records');
      toast.error('Failed to delete records: ' + (err.message || 'Unknown error'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Improve the query with AI
  const improveQuery = async () => {
    if (!generatedQuery.trim()) {
      toast.error('No query to improve');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `Improve this SOQL query for better performance and clarity, keeping the same functionality: ${generatedQuery}` 
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to improve query');
      }

      setGeneratedQuery(result.query);
      toast.success('Query improved!');
      
    } catch (err) {
      setError(err.message || 'Error improving query');
      toast.error('Failed to improve query: ' + (err.message || 'Unknown error'));
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy query to clipboard
  const copyQuery = () => {
    navigator.clipboard.writeText(generatedQuery);
    toast.success('Query copied to clipboard');
  };

  // Load a query from history
  const loadQueryFromHistory = (historyItem) => {
    setNaturalLanguagePrompt(historyItem.prompt);
    setGeneratedQuery(historyItem.query);
    setActiveTab('execute');
  };

  // Clear all history
  const clearHistory = () => {
    setQueryHistory([]);
    localStorage.removeItem('queryHistory');
    toast.success('Query history cleared');
  };

  // Export results as CSV
  const exportToCSV = () => {
    if (queryResults.length === 0) {
      toast.error('No data to export');
      return;
    }

    try {
      // Get field names (excluding attributes)
      const fields = Object.keys(queryResults[0]).filter(key => key !== 'attributes');
      
      // Create CSV content
      let csvContent = fields.join(',') + '\n';
      
      queryResults.forEach(record => {
        const row = fields.map(field => {
          const value = record[field];
          // Handle different data types and escape commas
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
          return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvContent += row.join(',') + '\n';
      });
      
      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${objectType}_export_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV export successful!');
    } catch (err) {
      toast.error('Failed to export data: ' + (err.message || 'Unknown error'));
    }
  };

  // Toggle row selection
  const toggleRowSelection = (rowIndex) => {
    setSelectedRows(prev => {
      if (prev.includes(rowIndex)) {
        return prev.filter(i => i !== rowIndex);
      } else {
        return [...prev, rowIndex];
      }
    });
  };

  // Toggle select all rows
  const toggleSelectAll = () => {
    if (selectedRows.length === queryResults.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...Array(queryResults.length).keys()]);
    }
  };

  // Table configuration using TanStack Table
  const columns = useMemo(() => {
    if (queryResults.length === 0) return [];
    
    // Get field names (excluding attributes)
    const fields = Object.keys(queryResults[0]).filter(key => key !== 'attributes');
    
    // Create columns array with checkbox column first
    return [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox 
            checked={selectedRows.length === queryResults.length && queryResults.length > 0}
            onCheckedChange={toggleSelectAll}
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox 
            checked={selectedRows.includes(row.index)}
            onCheckedChange={() => toggleRowSelection(row.index)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableFiltering: false,
        size: 40,
      },
      ...fields.map(field => ({
        accessorKey: field,
        header: field,
        cell: info => {
          const value = info.getValue();
          if (value === null || value === undefined) return '';
          if (typeof value === 'object') return JSON.stringify(value);
          return String(value);
        },
      }))
    ];
  }, [queryResults, selectedRows]);

  const table = useReactTable({
    data: queryResults,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      globalFilter,
      pagination: {
        pageIndex: currentPage,
        pageSize: 10,
      },
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newPagination = updater({
        pageIndex: currentPage,
        pageSize: 10,
      });
      setCurrentPage(newPagination.pageIndex);
    },
  });

  // Connection status
  const connectionStatus = token && instanceUrl ? (
    <Alert className="mb-4 bg-green-50 text-green-800 border-green-100">
      <Database className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Connected to Salesforce</AlertTitle>
      <AlertDescription className="text-green-700 text-xs">
        Instance: {instanceUrl.replace('https://', '')}
        <Button 
          variant="link" 
          size="sm" 
          className="text-xs p-0 h-4 ml-2 text-green-800" 
          onClick={() => setShowConnectionStatus(false)}
        >
          Dismiss
        </Button>
      </AlertDescription>
    </Alert>
  ) : (
    <Alert className="mb-4 bg-amber-50 text-amber-800 border-amber-100">
      <AlertCircle className="h-4 w-4 text-amber-600" />
      <AlertTitle className="text-amber-800">Not connected to Salesforce</AlertTitle>
      <AlertDescription className="text-amber-700 text-xs">
        Please authenticate with Salesforce to execute queries
      </AlertDescription>
    </Alert>
  );

  const tabIcons = {
    'generate': <AlignLeft className="h-4 w-4" />,
    'execute': <FileText className="h-4 w-4" />,
    'results': <Database className="h-4 w-4" />,
    'history': <History className="h-4 w-4" />,
  };

  // Render TanStack table
  const renderTanStackTable = () => {
    if (queryResults.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Database className="h-12 w-12 mb-4 opacity-30" />
          <p>No records found</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search records..."
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              className="max-w-sm"
            />
            <Badge variant="outline" className="ml-2">
              {table.getFilteredRowModel().rows.length} matching records
            </Badge>
          </div>
          
          <div className="flex gap-2">
            {selectedRows.length > 0 && (
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => setShowDeleteConfirm(true)} 
                disabled={isDeleting}
                className="gap-1"
              >
                {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                Delete Selected ({selectedRows.length})
              </Button>
            )}
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => executeQuery(generatedQuery)}
              disabled={isExecuting} 
              className="gap-1"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Refresh
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportToCSV}
              className="gap-1"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </Button>
          </div>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1">
                          {header.column.getCanSort() ? (
                            <div
                              className="flex items-center cursor-pointer select-none"
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {flexRender(header.column.columnDef.header, header.getContext())}
                              {{
                                asc: <SortAsc className="ml-1 h-3 w-3" />,
                                desc: <SortDesc className="ml-1 h-3 w-3" />,
                              }[header.column.getIsSorted()] ?? null}
                            </div>
                          ) : (
                            flexRender(header.column.columnDef.header, header.getContext())
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow 
                    key={row.id}
                    className={selectedRows.includes(row.index) ? "bg-blue-50" : ""}
                  >
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id} className="whitespace-nowrap truncate max-w-xs">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {table.getState().pagination.pageIndex * 10 + 1} to {Math.min((table.getState().pagination.pageIndex + 1) * 10, table.getFilteredRowModel().rows.length)} of {table.getFilteredRowModel().rows.length} records
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-lg border-slate-200">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-slate-100">
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <Wand2 className="h-6 w-6 text-blue-500" />
          AI Query Assistant
        </CardTitle>
        <CardDescription className="text-slate-600">
          Generate, execute, and manage Salesforce SOQL queries using natural language
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        {showConnectionStatus && connectionStatus}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-6">
            {Object.entries(tabIcons).map(([key, icon]) => (
              <TabsTrigger 
                key={key} 
                value={key}
                className="flex items-center gap-2"
              >
                {icon}
                <span className="capitalize">{key}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="generate" className="space-y-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <AlignLeft className="h-4 w-4 text-blue-500" />
                What would you like to query?
              </label>
              <Textarea
                placeholder="Example: Show me the top 10 accounts by revenue created this month"
                value={naturalLanguagePrompt}
                onChange={(e) => setNaturalLanguagePrompt(e.target.value)}
                className="min-h-[150px] text-base"
              />
              <p className="text-xs text-gray-500 mt-1">
                Describe what data you want to retrieve in natural language. Our AI will convert this to a SOQL query.
              </p>
            </div>
            
            <div className="flex justify-end mt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={generateQuery} 
                      disabled={isGenerating || !naturalLanguagePrompt.trim()}
                      className="gap-2 bg-blue-600 hover:bg-blue-700"
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Wand2 className="h-5 w-5" />
                          Generate Query
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Transform your natural language into a SOQL query</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
          
          <TabsContent value="execute" className="space-y-6 mt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  Generated SOQL Query
                </label>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" onClick={copyQuery} className="gap-1">
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy query to clipboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={improveQuery} 
                          disabled={isGenerating} 
                          className="gap-1"
                        >
                          {isGenerating ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                          )}
                          Optimize
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Improve query performance and readability</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
              
              <div className="relative">
                <Textarea
                  value={generatedQuery}
                  onChange={(e) => setGeneratedQuery(e.target.value)}
                  className="font-mono text-sm min-h-[200px] bg-slate-50 border-slate-200"
                />
                {!generatedQuery && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                    <div className="text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-20" />
                      <p>No query generated yet</p>
                    </div>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mt-1">
                You can edit this query manually or improve it with AI
              </p>
            </div>
            
            <div className="flex justify-end mt-6">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => executeQuery()} 
                      disabled={isExecuting || !generatedQuery.trim() || !token}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                      size="lg"
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5" />
                          Execute Query
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Run this query against your Salesforce org</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </TabsContent>
          
          <TabsContent value="results" className="space-y-4 mt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4 text-blue-500" />
                Query Results
                {queryResults.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {queryResults.length} records
                  </Badge>
                )}
              </h3>
              
              {objectType && (
                <Badge variant="outline" className="text-blue-700 bg-blue-50">
                  {objectType}
                </Badge>
              )}
            </div>
            
            {error ? (
              <Alert variant="destructive" className="bg-red-50 text-red-800 border-red-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error executing query</AlertTitle>
                <AlertDescription className="font-mono text-sm mt-2">
                  {error}
                </AlertDescription>
              </Alert>
            ) : (
              renderTanStackTable()
            )}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4 mt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <History className="h-4 w-4 text-blue-500" />
                Query History
              </h3>
              
              {queryHistory.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearHistory}
                  className="text-red-500 border-red-200 hover:bg-red-50"
                >
                  <X className="h-3.5 w-3.5 mr-1" />
                  Clear History
                </Button>
              )}
            </div>
            
            {queryHistory.length > 0 ? (
              <div className="space-y-3">
                {queryHistory.map((item) => (
                  <Card key={item.id} className="overflow-hidden border-slate-200 hover:border-blue-200 transition-colors">
                    <CardContent className="p-4">
                      <div className="font-medium text-blue-700">{item.prompt}</div>
                      <div className="text-xs text-gray-500 font-mono mt-2 line-clamp-1 bg-slate-50 p-2 rounded">
                        {item.query}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </Badge>
                          {item.resultCount !== undefined && (
                            <Badge variant="secondary" className="text-xs">
                              {item.resultCount} results
                            </Badge>
                          )}
                          {item.objectType && (
                            <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                              {item.objectType}
                            </Badge>
                          )}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => loadQueryFromHistory(item)}
                          className="text-blue-600 hover:text-blue-700 gap-1"
                        >
                          Use Again
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <History className="h-12 w-12 mb-4 opacity-30" />
                <p>No query history yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      
      {error && (
        <CardFooter className="bg-red-50 text-red-700 p-4 text-sm flex items-start gap-2 border-t border-red-100">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong className="font-medium">Error:</strong> {error}
          </div>
        </CardFooter>
      )}
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedRows.length} {objectType} {selectedRows.length === 1 ? 'record' : 'records'}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 rounded-md text-sm">
            <p className="text-red-700 font-medium">You are about to delete the following records:</p>
            <ul className="mt-2 text-red-600 list-disc pl-4">
              {selectedRows.slice(0, 5).map((rowIndex) => (
                <li key={rowIndex} className="truncate">
                  {queryResults[rowIndex].Name || queryResults[rowIndex].Id || `Record ${rowIndex + 1}`}
                </li>
              ))}
              {selectedRows.length > 5 && (
                <li>And {selectedRows.length - 5} more...</li>
              )}
            </ul>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              className="gap-1" 
              onClick={deleteSelectedRecords}
              disabled={isDeleting}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              {isDeleting ? 'Deleting...' : 'Confirm Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AIQueryAssistant;