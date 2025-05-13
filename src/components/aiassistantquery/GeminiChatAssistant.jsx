// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
// import { Input } from "../ui/input";
// import { Avatar } from "../ui/avatar";
// import { Loader2, Send, Bot, User } from "lucide-react";
// import { toast } from "sonner";

// const GeminiChatAssistant = ({ onQueryGenerated }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   // Scroll to bottom of chat when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Send message to Gemini API
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage = input.trim();
//     setInput('');
    
//     // Add user message to chat
//     const newMessages = [...messages, { role: 'user', content: userMessage }];
//     setMessages(newMessages);
    
//     setIsLoading(true);

//     try {
//       // Prepare a prompt that asks Gemini to create a SOQL query
//       const enhancedPrompt = `Generate a Salesforce SOQL query for this request: ${userMessage}`;
      
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: enhancedPrompt }),
//       });

//       const result = await response.json();
      
//       if (!response.ok) {
//         throw new Error(result.error || 'Failed to generate response');
//       }

//       // Add AI response to chat
//       setMessages([
//         ...newMessages, 
//         { 
//           role: 'assistant', 
//           content: 'Here\'s the SOQL query based on your request:',
//           query: result.query 
//         }
//       ]);
      
//       // Send the generated query to parent component
//       if (onQueryGenerated && result.query) {
//         onQueryGenerated(result.query);
//       }
      
//     } catch (err) {
//       toast.error('Error: ' + (err.message || 'Failed to get response'));
//       // Add error message to chat
//       setMessages([
//         ...newMessages,
//         { 
//           role: 'assistant', 
//           content: 'Sorry, I encountered an error while generating your query. Please try again.' 
//         }
//       ]);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Extract SOQL query from the chat messages
//   const extractQuery = (message) => {
//     if (message.query) {
//       return message.query;
//     }
    
//     // For older messages that might not have the query property
//     const match = message.content.match(/```(?:sql|soql)?\s*(SELECT[\s\S]*?)```/i);
//     return match ? match[1].trim() : null;
//   };

//   // Use a query from the chat
//   const useQuery = (query) => {
//     if (onQueryGenerated && query) {
//       onQueryGenerated(query);
//       toast.success('Query selected and ready to execute!');
//     }
//   };

//   return (
//     <Card className="flex flex-col h-[500px]">
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Bot className="h-5 w-5 text-blue-500" />
//           Gemini Query Assistant
//         </CardTitle>
//         <CardDescription>
//           Chat with Gemini AI to create and refine your Salesforce queries
//         </CardDescription>
//       </CardHeader>
      
//       <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
//         {messages.length === 0 ? (
//           <div className="h-full flex items-center justify-center text-gray-400 text-center">
//             <div>
//               <Bot className="h-12 w-12 mx-auto mb-2 opacity-50" />
//               <p>Start a conversation to generate Salesforce SOQL queries</p>
//               <p className="text-sm mt-2">Try asking: "Show me the top 10 accounts" or "Find all contacts in California"</p>
//             </div>
//           </div>
//         ) : (
//           messages.map((message, index) => (
//             <div 
//               key={index} 
//               className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
//             >
//               <div className={`flex gap-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
//                 <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'bg-blue-100' : 'bg-neutral-100'}`}>
//                   {message.role === 'user' ? (
//                     <User className="h-4 w-4 text-blue-500" />
//                   ) : (
//                     <Bot className="h-4 w-4 text-neutral-500" />
//                   )}
//                 </Avatar>
                
//                 <div>
//                   <div className={`rounded-lg p-3 ${
//                     message.role === 'user' 
//                       ? 'bg-blue-500 text-white' 
//                       : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {message.content}
//                   </div>
                  
//                   {message.role === 'assistant' && message.query && (
//                     <div className="mt-2">
//                       <div className="bg-gray-50 border rounded-md p-2 font-mono text-xs overflow-x-auto">
//                         {message.query}
//                       </div>
//                       <div className="mt-1 flex justify-end">
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           className="text-xs" 
//                           onClick={() => useQuery(message.query)}
//                         >
//                           Use This Query
//                         </Button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//         <div ref={messagesEndRef} />
//       </CardContent>
      
//       <CardFooter className="border-t p-3">
//         <form onSubmit={sendMessage} className="flex w-full gap-2">
//           <Input
//             placeholder="Ask about Salesforce data you need..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             disabled={isLoading}
//             className="flex-1"
//           />
//           <Button type="submit" disabled={isLoading || !input.trim()}>
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4" />
//             )}
//           </Button>
//         </form>
//       </CardFooter>
//     </Card>
//   );
// };

// export default GeminiChatAssistant;





// 'use client';

// import React, { useState, useRef, useEffect } from 'react';
// import { Button } from "../ui/button";
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
// import { Input } from "../ui/input";
// import { Avatar, AvatarFallback } from "../ui/avatar";
// import { ScrollArea } from "../ui/scroll-area";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
// import { Badge } from "../ui/badge";
// import { 
//   Loader2, 
//   Send, 
//   Bot, 
//   User, 
//   Copy, 
//   CheckCircle2, 
//   TerminalSquare 
// } from "lucide-react";
// import { toast } from "sonner";
// import { useTheme } from "next-themes";

// const ChatMessage = ({ message, onUseQuery }) => {
//   const [copied, setCopied] = useState(false);
//   const { theme } = useTheme();
  
//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//     toast.success("Query copied to clipboard");
//   };

//   const isUserMessage = message.role === 'user';
//   const messageQuery = message.query || null;

//   return (
//     <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4`}>
//       <div className={`flex gap-3 max-w-[85%] ${isUserMessage ? 'flex-row-reverse' : ''}`}>
//         <Avatar className={`h-8 w-8 ${isUserMessage 
//           ? 'bg-primary/10 text-primary' 
//           : 'bg-muted text-muted-foreground'}`}
//         >
//           <AvatarFallback>
//             {isUserMessage ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
//           </AvatarFallback>
//         </Avatar>
        
//         <div>
//           <div className={`rounded-lg p-3 ${
//             isUserMessage 
//               ? 'bg-primary text-primary-foreground' 
//               : 'bg-muted text-foreground'
//           }`}>
//             {message.content}
//           </div>
          
//           {messageQuery && (
//             <div className="mt-2 animate-in fade-in duration-300">
//               <div className="relative">
//                 <div className="bg-muted/50 border rounded-md p-3 font-mono text-xs overflow-x-auto">
//                   {messageQuery}
//                 </div>
//                 <div className="mt-2 flex justify-end gap-2">
//                   <TooltipProvider>
//                     <Tooltip>
//                       <TooltipTrigger asChild>
//                         <Button 
//                           variant="outline" 
//                           size="icon"
//                           className="h-7 w-7"
//                           onClick={() => copyToClipboard(messageQuery)}
//                         >
//                           {copied ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
//                         </Button>
//                       </TooltipTrigger>
//                       <TooltipContent>
//                         <p>Copy to clipboard</p>
//                       </TooltipContent>
//                     </Tooltip>
//                   </TooltipProvider>
                  
//                   <Button 
//                     variant="default" 
//                     size="sm" 
//                     className="text-xs h-7" 
//                     onClick={() => onUseQuery(messageQuery)}
//                   >
//                     Use Query
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const GeminiChatAssistant = ({ onQueryGenerated }) => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const messagesEndRef = useRef(null);
//   const inputRef = useRef(null);
//   const { theme } = useTheme();

//   // Focus on input on mount
//   useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   // Scroll to bottom of chat when messages change
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   // Send message to Gemini API
//   const sendMessage = async (e) => {
//     e.preventDefault();
//     if (!input.trim() || isLoading) return;

//     const userMessage = input.trim();
//     setInput('');
    
//     // Add user message to chat
//     const newMessages = [...messages, { role: 'user', content: userMessage }];
//     setMessages(newMessages);
    
//     setIsLoading(true);

//     try {
//       // Prepare a prompt that asks Gemini to create a SOQL query
//       const enhancedPrompt = `Generate a Salesforce SOQL query for this request: ${userMessage}`;
    
//       const response = await fetch('/api/gemini', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ prompt: enhancedPrompt }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to generate response');
//       }

//       const result = await response.json();
      
//       // Add AI response to chat
//       setMessages([
//         ...newMessages, 
//         { 
//           role: 'assistant', 
//           content: 'Here\'s the SOQL query based on your request:',
//           query: result.query 
//         }
//       ]);
      
//       // Send the generated query to parent component
//       if (onQueryGenerated && result.query) {
//         onQueryGenerated(result.query);
//       }
      
//     } catch (err) {
//       console.error('Error generating query:', err);
//       toast.error('Error: ' + (err.message || 'Failed to get response'));
      
//       // Add error message to chat
//       setMessages([
//         ...newMessages,
//         { 
//           role: 'assistant', 
//           content: 'Sorry, I encountered an error while generating your query. Please try again.' 
//         }
//       ]);
//     } finally {
//       setIsLoading(false);
//       // Focus back on input after sending
//       setTimeout(() => {
//         inputRef.current?.focus();
//       }, 100);
//     }
//   };

//   // Use a query from the chat
//   const handleUseQuery = (query) => {
//     if (onQueryGenerated && query) {
//       onQueryGenerated(query);
//       toast.success('Query selected and ready to execute!');
//     }
//   };

//   // Example queries to help users get started
//   const exampleQueries = [
//     "Show me the top 10 accounts by revenue",
//     "Find all contacts created in the last 30 days",
//     "List opportunities in the closing stage",
//     "Get all cases with high priority"
//   ];

//   const handleExampleClick = (example) => {
//     setInput(example);
//     inputRef.current?.focus();
//   };

//   return (
//     <Card className="flex flex-col h-[600px] border shadow-md">
//       <CardHeader className="border-b px-6 py-4">
//         <CardTitle className="flex items-center gap-2 text-xl">
//           <Bot className="h-5 w-5 text-primary" />
//           Gemini Query Assistant
//         </CardTitle>
//         <CardDescription className="text-muted-foreground">
//           Chat with Gemini AI to create and refine your Salesforce SOQL queries
//         </CardDescription>
//       </CardHeader>
      
//       <ScrollArea className="flex-1 p-4">
//         <div className="space-y-4 min-h-[400px]">
//           {messages.length === 0 ? (
//             <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground text-center p-6">
//               <div className="max-w-md">
//                 <TerminalSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                 <h3 className="text-lg font-medium mb-2">Start Creating SOQL Queries</h3>
//                 <p className="mb-6">Describe the Salesforce data you need, and I'll generate the appropriate SOQL query for you.</p>
                
//                 <div className="grid grid-cols-2 gap-2">
//                   {exampleQueries.map((query, index) => (
//                     <Button 
//                       key={index}
//                       variant="outline"
//                       className="text-xs justify-start h-auto py-2 px-3 whitespace-normal text-left"
//                       onClick={() => handleExampleClick(query)}
//                     >
//                       {query}
//                     </Button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           ) : (
//             messages.map((message, index) => (
//               <ChatMessage 
//                 key={index} 
//                 message={message} 
//                 onUseQuery={handleUseQuery} 
//               />
//             ))
//           )}
//           <div ref={messagesEndRef} />
//         </div>
//       </ScrollArea>
      
//       <CardFooter className="border-t p-4">
//         <form onSubmit={sendMessage} className="flex w-full gap-2">
//           <Input
//             ref={inputRef}
//             placeholder="Ask about Salesforce data you need..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             disabled={isLoading}
//             className="flex-1"
//           />
//           <Button 
//             type="submit" 
//             disabled={isLoading || !input.trim()}
//             className="shrink-0"
//             aria-label="Send message"
//           >
//             {isLoading ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <Send className="h-4 w-4" />
//             )}
//           </Button>
//         </form>
//       </CardFooter>
//     </Card>
//   );
// };

// export default GeminiChatAssistant;
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, CopyIcon, CheckIcon, TerminalSquare } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Import shadcn components
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Alert, AlertDescription } from "../ui/alert";
import { toast } from "sonner";

// Custom components for ReactMarkdown
const MarkdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (!inline && language) {
      return (
        <div className="relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <CopyButton text={String(children).replace(/\n$/, '')} />
          </div>
          <SyntaxHighlighter
            style={nord}
            language={language}
            PreTag="div"
            className="rounded-md text-sm"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    } else if (!inline) {
      return (
        <div className="relative group">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <CopyButton text={String(children).replace(/\n$/, '')} />
          </div>
          <SyntaxHighlighter
            style={nord}
            language="text"
            PreTag="div"
            className="rounded-md text-sm"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }
    
    return <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>{children}</code>;
  },
  h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
  h2: ({ children }) => <h2 className="text-xl font-bold mt-5 mb-3">{children}</h2>,
  h3: ({ children }) => <h3 className="text-lg font-bold mt-4 mb-2">{children}</h3>,
  h4: ({ children }) => <h4 className="text-base font-semibold mt-3 mb-2">{children}</h4>,
  p: ({ children }) => <p className="mb-4">{children}</p>,
  ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  li: ({ children }) => <li className="mb-1">{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
  ),
  a: ({ href, children }) => (
    <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full border border-gray-300 rounded-md">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-gray-300 dark:border-gray-700">{children}</tr>,
  th: ({ children }) => (
    <th className="px-4 py-2 text-left font-semibold border-r border-gray-300 dark:border-gray-700 last:border-r-0">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="px-4 py-2 border-r border-gray-300 dark:border-gray-700 last:border-r-0">{children}</td>
  ),
  hr: () => <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />,
  img: ({ src, alt }) => (
    <img 
      src={src} 
      alt={alt} 
      className="max-w-full h-auto my-4 rounded-md" 
    />
  ),
};

// Copy button component
const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard!");
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full bg-background/70 backdrop-blur"
            onClick={handleCopy}
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5" /> : <CopyIcon className="h-3.5 w-3.5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{copied ? "Copied!" : "Copy code"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

// Chat message component
const ChatMessage = ({ message }) => {
  const isUserMessage = message.role === 'user';

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} mb-4 max-w-full`}>
      <div className={`flex gap-3 max-w-[85%] ${isUserMessage ? 'flex-row-reverse' : ''}`}>
        <Avatar className={`h-8 w-8 ${isUserMessage ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
          <AvatarFallback>
            {isUserMessage ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
          </AvatarFallback>
        </Avatar>
        
        <div className={`${isUserMessage ? 'items-end' : 'items-start'} flex flex-col`}>
          <div className={`rounded-lg p-4 ${
            isUserMessage 
              ? 'bg-primary text-primary-foreground' 
              : 'bg-muted dark:bg-gray-800'
          }`}>
            {isUserMessage ? (
              <p className="whitespace-pre-wrap break-words">{message.content}</p>
            ) : (
              <div className="markdown-content prose dark:prose-invert prose-headings:mb-2 prose-headings:mt-4 max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                  components={MarkdownComponents}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AI chatbot component
const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState(null);
  const [currentStreamedContent, setCurrentStreamedContent] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Focus on input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Add welcome message on first load
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "# Welcome to CRM Assistant\n\nI'm your CRM assistant. I can help answer questions about Salesforce, CRM concepts, or generate queries. How can I assist you today?"
        }
      ]);
    }
  }, []);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentStreamedContent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Clean up any pending requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Send message to API
  const sendMessage = async (e) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);
    
    setIsLoading(true);
    
    // Create a temporary ID for the streaming message
    const tempId = Date.now().toString();
    setStreamingId(tempId);
    setCurrentStreamedContent('');

    // Create abort controller for cancelling request if needed
    abortControllerRef.current = new AbortController();
    
    try {
      // Prepare conversation history for the API
      const conversationHistory = newMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Make API call
      const response = await fetch('/api/geminiassistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: conversationHistory,
          stream: true
        }),
        signal: abortControllerRef.current.signal
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("ReadableStream not supported");
      }

      // Handle streaming response
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Decode chunk and add to accumulated content
        const chunk = decoder.decode(value, { stream: true });
        accumulatedContent += chunk;
        setCurrentStreamedContent(accumulatedContent);
      }

      // Set final message content once streaming is complete
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: accumulatedContent
      }]);
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
      } else {
        console.error('Error calling API:', error);
        toast.error('Failed to get response from AI');
        
        // Add error message to chat
        setMessages([...newMessages, { 
          role: 'assistant', 
          content: "I'm sorry, I encountered an error while processing your request. Please try again." 
        }]);
      }
    } finally {
      setIsLoading(false);
      setStreamingId(null);
      setCurrentStreamedContent('');
      abortControllerRef.current = null;
      
      // Focus back on input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  // Cancel current streaming response
  const cancelStream = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
      setStreamingId(null);
      setCurrentStreamedContent('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Example queries to help users get started
  const exampleQueries = [
    "What are the best practices for Salesforce data migration?",
    "Generate a SOQL query to find all opportunities closing this month",
    "How do I create dashboards in Salesforce?",
    "What are the key features of Salesforce Einstein Analytics?"
  ];

  const handleExampleClick = (example) => {
    setInput(example);
    inputRef.current?.focus();
  };

  return (
    <Card className="flex flex-col h-[600px] border shadow-md">
      <CardHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary/10">
            <AvatarFallback className="text-primary">
              <Bot className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">CRM Assistant</CardTitle>
            <CardDescription className="text-muted-foreground">
              AI-powered Salesforce & CRM expert
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 min-h-[400px]">
          {messages.length === 0 ? (
            <div className="h-[400px] flex flex-col items-center justify-center text-muted-foreground text-center p-6">
              <div className="max-w-md">
                <TerminalSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start Chatting with Your CRM Assistant</h3>
                <p className="mb-6">Ask me anything about Salesforce, CRM concepts, or data management strategies.</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage 
                key={index} 
                message={message}
              />
            ))
          )}
          
          {/* Streaming message (while response is being generated) */}
          {streamingId && currentStreamedContent && (
            <div className="flex justify-start mb-4 max-w-full">
              <div className="flex gap-3 max-w-[85%]">
                <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex flex-col items-start">
                  <div className="rounded-lg p-4 bg-muted dark:bg-gray-800">
                    <div className="markdown-content prose dark:prose-invert prose-headings:mb-2 prose-headings:mt-4 max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={MarkdownComponents}
                      >
                        {currentStreamedContent}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Loading indicator */}
          {isLoading && !currentStreamedContent && (
            <div className="flex justify-start mb-4">
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 bg-muted text-muted-foreground">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <Alert className="w-auto p-3">
                  <AlertDescription className="flex items-center">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating response...
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <CardFooter className="border-t p-4">
        <form onSubmit={sendMessage} className="flex w-full flex-col gap-2">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              placeholder="Ask anything about CRM..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1"
            />
            {isLoading ? (
              <Button 
                type="button" 
                variant="destructive"
                onClick={cancelStream}
                className="shrink-0"
                aria-label="Cancel"
              >
                Stop
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={!input.trim()}
                className="shrink-0"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {messages.length <= 2 && (
            <div className="mt-4 w-full">
              <p className="text-sm text-muted-foreground mb-2">Try these example questions:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {exampleQueries.map((query, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left h-auto py-2 justify-start whitespace-normal text-xs"
                    onClick={() => handleExampleClick(query)}
                  >
                    {query}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </form>
      </CardFooter>
    </Card>
  );
};

export default AIAssistant;