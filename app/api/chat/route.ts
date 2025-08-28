// Using Node.js runtime for Composio SDK compatibility
// export const runtime = "edge";
export const maxDuration = 30;

import { generateText, streamText, stepCountIs } from "ai";
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

  const modelMap: Record<string, () => any> = {
    // OpenAI models
    "gpt-5": () => openai("gpt-5"),
    "gpt-5-mini": () => openai("gpt-5-mini"),
    "gpt-5-nano": () => openai("gpt-5-nano"),
    "o3": () => openai("o3"),
    "o4-mini": () => openai("o4-mini"),
    "GPT-4.1": () => openai("gpt-4.1"),
    "GPT-4.1 Mini": () => openai("gpt-4.1-mini"),
    
    // Anthropic models
    "Claude 4 Opus": () => anthropic("claude-4-opus-latest"),
    "Claude 4 Sonnet": () => anthropic("claude-4-sonnet-latest"),
    "Claude 3.5 Sonnet": () => anthropic("claude-3-5-sonnet-20241022"),
    "Claude 3.5 Haiku": () => anthropic("claude-3-5-haiku-20241022"),
    
    // Google models
    "Gemini 2.5 Pro": () => google("gemini-2.5-pro"),
    "Gemini 2.5 Flash": () => google("gemini-2.5-flash"),
    "Gemini 2.0 Flash": () => google("gemini-2.0-flash-exp"),
    "Gemini 2.0 Flash Thinking": () => google("gemini-2.0-flash-thinking-exp"),
    
    // Groq models
    "DeepSeek R1 Llama 70B": () => groq("deepseek-r1-distill-llama-70b"),
    "Llama 3.3 70B": () => groq("llama-3.3-70b-versatile"),
  };

  return modelMap[name]?.() || openai("gpt-4o-mini");
}

export async function POST(req: Request) {
  try {
    const { messages, prompt: explicitPrompt, model: selectedModel, tools: selectedTools, userId }: { 
      messages?: Message[]; 
      prompt?: string; 
      model?: string; 
      tools?: string[];
      userId?: string;
    } = await req.json();
    
    const msgs: Message[] = messages && messages.length > 0 
      ? messages 
      : [{ role: "user", content: explicitPrompt ?? "" }];
    
    const model = resolveModel(selectedModel);
    const composioUserId = userId || "ca_VYRbOnfLPnef";
    
    // Check if Twitter tools are selected
    const hasTwitterTools = selectedTools?.some(tool => tool.includes('TWITTER')) || false;
    
    if (hasTwitterTools && process.env.COMPOSIO_API_KEY) {
      console.log("Starting Twitter workflow with two agents");
      
      // AGENT 1: Research and Generate Tweet Content
      // AGENT 1: Research Agent - Web Search
      console.log("Starting Agent 1: Web Research");
      
      const researchResult = await generateText({
        model,
        messages: msgs.map(m => ({ role: m.role, content: m.content })),
        tools: {
          web_search_preview: openai.tools.webSearchPreview({
            searchContextSize: 'low',
          }),
        },
        toolChoice: { type: 'tool', toolName: 'web_search_preview' },
        system: `You are a research agent. Your job is to search the web for current information about the user's topic.

<task>
Search for the most recent and relevant information about the user's topic and provide a research summary.
</task>

<requirements>
- Use web search to find current information in ${new Date().getFullYear()}
- Provide a comprehensive research summary
- Focus on recent developments, trends, and key insights
- Be thorough in your research findings
</requirements>`,
      });
      
      console.log("Agent 1 completed. Research findings:", researchResult.text);
      console.log("Research sources:", researchResult.sources);
      
      // AGENT 2: Synthesis Agent - Generate Tweet
      console.log("Starting Agent 2: Tweet Generation");
      
      const tweetResult = await generateText({
        model,
        messages: [
          {
            role: "system",
            content: `You are a tweet synthesis agent. Create an opinionated Twitter post based on research findings.

                  <requirements>
                  - Write a provocative, opinionated take (not generic observations)
                  - Keep under 280 characters, no hashtags
                  - Avoid jargon, dashes or ems e.g ——, or fluff words
                  - Take a clear stance on the topic
                  - End with exactly: "TWEET_CONTENT: [your opinionated tweet]"
                  </requirements>.`
          },
          {
            role: "user", 
            content: `Based on this research about "${msgs[msgs.length - 1]?.content}", create an opinionated tweet:\n\nRESEARCH FINDINGS:\n${researchResult.text}`
          }
        ],
      });
      
      console.log("Agent 2 completed. Tweet generation:", tweetResult.text);
      
      // Extract tweet content from Agent 2
      const tweetMatch = tweetResult.text.match(/TWEET_CONTENT:\s*(.+?)(?:\n|$)/);
      const tweetContent = tweetMatch ? tweetMatch[1].trim() : tweetResult.text.slice(-280);
      
      // Use sources from Agent 1 (research)
      const sources = researchResult.sources || [];
      
      console.log("Final tweet content:", tweetContent);
      console.log("Final sources:", sources);
      
      // Create preview card data with real sources
      const twitterPreviewData = {
        type: 'twitter-post-preview',
        content: tweetContent,
        userId: composioUserId,
        timestamp: Date.now(),
        posted: false,
        sources: sources,
        researchText: researchResult.text
      };
      
      console.log('Created Twitter preview data:', twitterPreviewData);
      
      // Return only the preview card data
      const responseWithCard = `__TWITTER_PREVIEW__${JSON.stringify(twitterPreviewData)}__TWITTER_PREVIEW__`;
      
      return new Response(responseWithCard, {
        headers: { "content-type": "text/plain; charset=utf-8" },
      });
    }
    
    // For non-Twitter requests, use standard generation
    const result = await generateText({
      model,
      messages: msgs.map(m => ({ role: m.role, content: m.content })),
      system: "You are a helpful assistant. You can also remind the user to enable the Twitter/X tools to research, generate and post to their X account."
    });
    
    return new Response(result.text, {
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
    
  } catch (error) {
    console.error("Error in chat API:", error);
    const errorMessage = error instanceof Error ? error.message : "Sorry, something went wrong.";
    return new Response(errorMessage, {
      headers: { "content-type": "text/plain; charset=utf-8" },
      status: 500,
    });
  }
}