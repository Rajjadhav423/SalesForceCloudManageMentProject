// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

// export async function POST(request) {
//     try {
//         const { prompts } = await request.json();
//         if (!Array.isArray(prompts) || prompts.length === 0) {
//             return NextResponse.json({ error: "Missing or invalid prompts" }, { status: 400 });
//         }

//         const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

//         const results = await Promise.all(
//             prompts.map(async (prompt) => {
//                 try {
//                     const result = await model.generateContent({
//                         contents: [
//                             {
//                                 role: "user",
//                                 parts: [
//                                     {
//                                         text: `You are a Salesforce expert.so give salesforce related answer`,
//                                     },
//                                     {
//                                         text: prompt,
//                                     },
//                                 ],
//                             },
//                         ],
//                         generationConfig: {
//                             temperature: 0.2,
//                             maxOutputTokens: 1024,
//                         },
//                     });

//                     const generatedText = result.response.text().trim();
//                     const cleaned = generatedText.replace(/```soql|```/gi, "").trim();

//                     if (!cleaned.toUpperCase().startsWith("SELECT")) {
//                         return { prompt, error: "Invalid SOQL generated" };
//                     }

//                     return { prompt, query: cleaned };
//                 } catch (err) {
//                     console.error("Error generating SOQL for prompt:", prompt, err);
//                     return { prompt, error: err?.message || "Error generating SOQL" };
//                 }
//             })
//         );

//         return NextResponse.json({
//             success: true,
//             results,
//             provider: "gemini-2.0-flash",
//         });
//     } catch (err) {
//         console.error("Gemini error:", err);
//         return NextResponse.json(
//             { error: err?.message || "Something went wrong" },
//             { status: 500 }
//         );
//     }
// }


// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

// export async function POST(request) {
//     try {
//         const { prompt } = await request.json();
        
//         if (!prompt || typeof prompt !== 'string') {
//             return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
//         }

//         const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

//         // Enhanced system prompt that instructs the model to format responses properly
//         const systemPrompt = `You are a knowledgeable Salesforce and CRM expert assistant. 
//         You can answer questions about:
//         - Salesforce platform capabilities, features, and best practices
//         - General CRM concepts, strategies, and implementation
//         - Sales, marketing, and customer service automation
//         - Using Salesforce objects, fields, and relationships
//         - SOQL queries (when specifically requested)
//         - Customization, development, and integration techniques
//         - Admin and user tips and troubleshooting
        
//         FORMATTING INSTRUCTIONS:
//         - Structure your responses with clear paragraphs separated by blank lines.
//         - When providing a SOQL query, always wrap it in triple backticks with the word "soql" like this:
//           \`\`\`soql
//           SELECT Id, Name FROM Account
//           \`\`\`
//         - For any code examples or configuration snippets, use appropriate code blocks.
//         - Use bullet points for lists when appropriate.
//         - Keep responses concise and directly relevant to the question.
        
//         Always be conversational, helpful, and provide context with your answers.`;

//         const result = await model.generateContent({
//             contents: [
//                 {
//                     role: "user",
//                     parts: [
//                         { text: systemPrompt },
//                         { text: prompt }
//                     ]
//                 }
//             ],
//             generationConfig: {
//                 temperature: 0.4,
//                 maxOutputTokens: 2048,
//             },
//         });

//         // Extract the generated response
//         const generatedText = result.response.text().trim();
        
//         // Check if this looks like a SOQL query response and format appropriately
//         let responseObj = {};
        
//         if (generatedText.includes("```soql") || 
//             (generatedText.includes("SELECT") && 
//              (generatedText.includes("FROM") || generatedText.includes("from")))) {
            
//             // Try to extract just the SOQL query if it's embedded in the response
//             const queryMatch = generatedText.match(/```soql([\s\S]*?)```/) || 
//                                generatedText.match(/```([\s\S]*?)```/) ||
//                                generatedText.match(/(SELECT[\s\S]*?FROM[\s\S]*?(?:WHERE[\s\S]*?)?(?:GROUP BY[\s\S]*?)?(?:HAVING[\s\S]*?)?(?:ORDER BY[\s\S]*?)?(?:LIMIT\s+\d+)?(?:OFFSET\s+\d+)?)/i);
                               
//             const query = queryMatch ? 
//                 queryMatch[1].trim() : 
//                 generatedText.replace(/```soql|```/gi, "").trim();
                
//             responseObj = {
//                 success: true,
//                 content: generatedText,
//                 query: query.startsWith("SELECT") ? query : null,
//                 isQueryResponse: true
//             };
//         } else {
//             // Regular conversational response
//             responseObj = {
//                 success: true,
//                 content: generatedText,
//                 isQueryResponse: false
//             };
//         }

//         return NextResponse.json(responseObj);
        
//     } catch (err) {
//         console.error("Gemini API error:", err);
//         return NextResponse.json(
//             { error: err?.message || "Something went wrong with the AI service" },
//             { status: 500 }
//         );
//     }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenerativeAI(GEMINI_API_KEY);

// Convert Gemini streaming response to a readable stream
function responseToReadableStream(streamingResult) {
  return new ReadableStream({
    async start(controller) {
      try {
        // Process the streaming result directly
        for await (const chunk of streamingResult) {
          const text = chunk.text();
          if (text) {
            controller.enqueue(new TextEncoder().encode(text));
          }
        }
        
        controller.close();
      } catch (error) {
        console.error("Streaming error:", error);
        controller.error(error);
      }
    },
  });
}

export async function POST(request) {
  try {
    const { messages, stream = false } = await request.json();
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Missing or invalid messages" }, { status: 400 });
    }

    // Initialize the model
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Enhanced system prompt that instructs the model to format responses properly
    const systemPrompt = `You are a knowledgeable Salesforce and CRM expert assistant. 
    You can answer questions about:
    - Salesforce platform capabilities, features, and best practices
    - General CRM concepts, strategies, and implementation
    - Sales, marketing, and customer service automation
    - Using Salesforce objects, fields, and relationships
    - SOQL queries (when specifically requested)
    - Customization, development, and integration techniques
    - Admin and user tips and troubleshooting
    
    FORMATTING INSTRUCTIONS:
    - Use Markdown formatting to structure your responses.
    - Use proper markdown headings with # for titles and ## for subtitles.
    - Structure your responses with clear paragraphs separated by blank lines.
    - When providing a SOQL query, always wrap it in triple backticks with the word "sql" like this:
      \`\`\`sql
      SELECT Id, Name FROM Account
      \`\`\`
    - Use proper markdown code blocks for all code examples.
    - Use bullet points for lists when appropriate.
    - Use **bold** and *italic* when appropriate to emphasize key points.
    - If including tables, use proper markdown table syntax.
    
    Always be conversational, helpful, and provide context with your answers.`;

    // Format the conversation history for Gemini
    const formattedMessages = [];
    
    // Add system prompt as first message
    formattedMessages.push({
      role: "user",
      parts: [{ text: systemPrompt }]
    });
    
    // Add system response acknowledgment
    formattedMessages.push({
      role: "model",
      parts: [{ text: "I'll act as a Salesforce and CRM expert and follow the formatting guidelines." }]
    });
    
    // Convert chat messages to Gemini format
    for (const message of messages) {
      const role = message.role === 'assistant' ? 'model' : 'user';
      formattedMessages.push({
        role: role,
        parts: [{ text: message.content }]
      });
    }

    // Chat completion configuration
    const generationConfig = {
      temperature: 0.4,
      maxOutputTokens: 4096,
      topP: 0.95,
      topK: 40,
    };

    // Create chat session with history
    const chat = model.startChat({
      history: formattedMessages.slice(0, -1),
      generationConfig,
    });
    
    // Get the last message from the user
    const lastMessage = formattedMessages[formattedMessages.length - 1];

    // Handle streaming response if requested
    if (stream) {
      // Get the streaming response - no need to await here
      const streamingResponse = await chat.sendMessageStream(lastMessage.parts[0].text);
      
      // Create readable stream from Gemini response
      const readableStream = responseToReadableStream(streamingResponse.stream);
      
      // Return the stream
      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked'
        }
      });
    } 
    // Non-streaming response
    else {
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      const response = result.response;
      const text = response.text();
      
      return NextResponse.json({
        content: text,
        role: "assistant"
      });
    }
  } catch (err) {
    console.error("AI API error:", err);
    return NextResponse.json(
      { error: err?.message || "Something went wrong with the AI service" },
      { status: 500 }
    );
  }
}