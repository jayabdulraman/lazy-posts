// Using Node.js runtime for Composio SDK compatibility
// export const runtime = "edge";
export const maxDuration = 30;

import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

type Role = "user" | "assistant" | "system";

interface Message {
  role: Role;
  content: string;
}



function streamFromString(text: string, delayMs = 10): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      for (let i = 0; i < text.length; i += 4) {
        controller.enqueue(encoder.encode(text.slice(i, i + 4)));
        await new Promise((r) => setTimeout(r, delayMs));
      }
      controller.close();
    },
  });
}

function resolveModel(selected?: string) {
  const name = (selected ?? "").trim();

  // OpenAI models (latest 2025)
  if (name === "o3" || name === "o4-mini" || name === "GPT-4.1" || name === "GPT-4.1 Mini" || name === "gpt-5" || name === "gpt-5-mini" || name === "gpt-5-nano") {
    let modelId: string;
    switch (name) {
      case "gpt-5":
        modelId = "gpt-5";
        break;
      case "gpt-5-mini":
        modelId = "gpt-5-mini";
        break;
      case "gpt-5-nano":
        modelId = "gpt-5-nano";
        break;
      case "o3":
        modelId = "o3";
        break;
      case "o4-mini":
        modelId = "o4-mini";
        break;
      case "GPT-4.1":
        modelId = "gpt-4.1";
        break;
      case "GPT-4.1 Mini":
        modelId = "gpt-4.1-mini";
        break;
      default:
        modelId = "gpt-4o-mini";
    }
    return openai(modelId);
  }

  // Anthropic models (latest 2025)
  if (name === "Claude 4 Opus" || name === "Claude 4 Sonnet" || name === "Claude 3.5 Sonnet" || name === "Claude 3.5 Haiku") {
    let modelId: string;
    switch (name) {
      case "Claude 4 Opus":
        modelId = "claude-4-opus-latest";
        break;
      case "Claude 4 Sonnet":
        modelId = "claude-4-sonnet-latest";
        break;
      case "Claude 3.5 Sonnet":
        modelId = "claude-3-5-sonnet-20241022";
        break;
      case "Claude 3.5 Haiku":
        modelId = "claude-3-5-haiku-20241022";
        break;
      default:
        modelId = "claude-3-5-haiku-20241022";
    }
    return anthropic(modelId);
  }

  // Google models (latest 2025)
  if (name === "Gemini 2.5 Pro" || name === "Gemini 2.5 Flash" || name === "Gemini 2.0 Flash" || name === "Gemini 2.0 Flash Thinking") {
    let modelId: string;
    switch (name) {
      case "Gemini 2.5 Pro":
        modelId = "gemini-2.5-pro";
        break;
      case "Gemini 2.5 Flash":
        modelId = "gemini-2.5-flash";
        break;
      case "Gemini 2.0 Flash":
        modelId = "gemini-2.0-flash-exp";
        break;
      case "Gemini 2.0 Flash Thinking":
        modelId = "gemini-2.0-flash-thinking-exp";
        break;
      default:
        modelId = "gemini-2.0-flash-exp";
    }
    return google(modelId);
  }

  // Groq models (latest 2025)
  if (name === "DeepSeek R1 Llama 70B" || name === "Llama 3.3 70B") {
    let modelId: string;
    switch (name) {
      case "DeepSeek R1 Llama 70B":
        modelId = "deepseek-r1-distill-llama-70b";
        break;
      case "Llama 3.3 70B":
        modelId = "llama-3.3-70b-versatile";
        break;
      default:
        modelId = "llama-3.3-70b-versatile";
    }
    return groq(modelId);
  }

  // Fallback to OpenAI GPT-4.1 mini
  return openai("gpt-4.1-mini");
}

export async function POST(req: Request) {
  try {
    const { messages, prompt: explicitPrompt, model: selectedModel, tools: selectedTools }: { 
      messages?: Message[]; 
      prompt?: string; 
      model?: string; 
      tools?: string[];
    } = await req.json();
    
    
    const msgs: Message[] = messages && messages.length > 0 
      ? messages 
      : [{ role: "user", content: explicitPrompt ?? "" }];
    
    
    try {
      const model = resolveModel(selectedModel);
      
      let composioTools = {};
      
      // Initialize Composio tools if any are selected
      if (selectedTools && selectedTools.length > 0 && process.env.COMPOSIO_API_KEY) {
        try {
          const composio = new Composio({
            apiKey: process.env.COMPOSIO_API_KEY,
            provider: new VercelProvider(),
          });
          // Get tools from Composio - assuming we have a default user ID
          const userId = "default"; // In production, this should be the actual user ID
          
          // Get tools by their slugs - pass as array to tools.get
          composioTools = await composio.tools.get(userId, {
            tools: selectedTools,
          });
          
        } catch (toolError) {
        }
      }
      
      const streamTextOptions: any = {
        model, 
        messages: msgs.map(m => ({ role: m.role, content: m.content })),
        maxSteps: 10,
        experimental_continueSteps: true
      };
      
      // Only add tools if we have any
      if (Object.keys(composioTools).length > 0) {
        streamTextOptions.tools = composioTools;
        streamTextOptions.maxToolRoundtrips = 3;
        streamTextOptions.toolChoice = "auto"; // Allow model to choose when to use tools
        // Add system message to ensure proper tool usage
        streamTextOptions.system = "You are a helpful assistant. When using tools, always provide a clear response based on the tool results. After executing any tool, explain what you found or accomplished.";
      }
      
      
      const result = streamText(streamTextOptions);
      
      
      // For tool-enabled requests, we need a two-step process
      if (Object.keys(composioTools).length > 0) {
        
        // Create a custom readable stream that handles tool execution then AI response
        const stream = new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            let toolResults: any[] = [];
            let toolCalls: any[] = [];
            
            try {
              // STEP 1: Execute tools
              
              for await (const part of result.fullStream) {
                
                if (part.type === 'tool-call') {
                  const toolCallData = {
                    type: 'tool-call',
                    toolName: part.toolName,
                    toolCallId: part.toolCallId,
                    args: part.input || {}
                  };
                  toolCalls.push(toolCallData);
                  
                  // Send tool call to frontend
                  const toolCallJson = `\n\n__TOOL_CALL__${JSON.stringify(toolCallData)}__TOOL_CALL__\n\n`;
                  controller.enqueue(encoder.encode(toolCallJson));
                } else if (part.type === 'tool-result') {
                  const toolResultData = {
                    type: 'tool-result',
                    toolCallId: part.toolCallId,
                    toolName: part.toolName,
                    result: part.output || {}  
                  };
                  toolResults.push(toolResultData);
                  
                  // Send tool result to frontend
                  const toolResultJson = `\n\n__TOOL_RESULT__${JSON.stringify(toolResultData)}__TOOL_RESULT__\n\n`;
                  controller.enqueue(encoder.encode(toolResultJson));
                }
              }
              
              
              // STEP 2: Get AI response based on tool results
              if (toolResults.length > 0) {
                
                // Create new messages array with tool results
                const messagesWithResults = [
                  ...msgs.map(m => ({ role: m.role, content: m.content })),
                  {
                    role: "user" as const,
                    content: `Based on the following tool results, please provide a helpful response:\n\n${toolResults.map(tr => `Tool: ${tr.toolName}\nResult: ${JSON.stringify(tr.result, null, 2)}`).join('\n\n')}`
                  }
                ];
                
                // Make second LLM call without tools for the response
                const responseResult = streamText({
                  model,
                  messages: messagesWithResults,
                  system: "You are a helpful assistant. Provide a clear, helpful response based on the tool results provided. Summarize and interpret the results for the user."
                });
                
                // Stream the AI response
                for await (const part of responseResult.textStream) {
                  controller.enqueue(encoder.encode(part));
                }
                
              }
            } catch (error) {
              const errorMsg = `\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}`;
              controller.enqueue(encoder.encode(errorMsg));
            } finally {
              controller.close();
            }
          }
        });
        
        return new Response(stream, {
          headers: { 
            'content-type': 'text/plain; charset=utf-8',
            'cache-control': 'no-cache'
          }
        });
      }
      
      // For non-tool requests, use standard text stream
      const response = result.toTextStreamResponse();
      return response;
    } catch (providerError) {
      // Provider not available or missing key; return error message
      const errorMessage = "Sorry, AI model is not available. Please check your API keys configuration.";
      return new Response(streamFromString(errorMessage), {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
  } catch (error) {
    return new Response(streamFromString("Sorry, something went wrong."), {
      headers: { "content-type": "text/plain; charset=utf-8" },
      status: 500,
    });
  }
}