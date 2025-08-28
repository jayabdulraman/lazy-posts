export const maxDuration = 30;

import OpenAI from "openai";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, userId }: { content: string; userId: string } = await req.json();
    
    if (!content || !userId) {
      return new Response(JSON.stringify({ error: "Content and userId are required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    
    if (!process.env.COMPOSIO_API_KEY) {
      return new Response(JSON.stringify({ error: "Composio API key not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    
    console.log("Starting Twitter post endpoint");
    console.log("Content to post:", content);
    console.log("User ID:", userId);
    
    const composio = new Composio({
      apiKey: process.env.COMPOSIO_API_KEY,
    });
    
    // Get Twitter tools 
    const twitterTools = await composio.tools.get(userId, {
      tools: ['TWITTER_CREATION_OF_A_POST'],
    });
    
    console.log("Twitter tools available:", Object.keys(twitterTools));
    
    // Define the task
    const task = `Post this tweet to Twitter: "${content}"`;
    
    // Define the messages for the assistant
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a Twitter posting agent. Post the provided tweet content to Twitter using the TWITTER_CREATION_OF_A_POST tool."
      },
      { role: "user", content: task }
    ];
    
    // Create a chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      tools: twitterTools,
      tool_choice: "auto",
    });
    
    console.log("OpenAI response:", response);
    
    // Execute the tool calls using Composio
    const result = await composio.provider.handleToolCalls(userId, response);
    console.log("Tool execution result:", result);
    
    // Parse the tool execution result
    console.log("Raw result structure:", JSON.stringify(result, null, 2));
    
    let tweetId: string | undefined;
    let tweetText: string = content;
    let successful = false;
    
    if (Array.isArray(result) && result.length > 0) {
      // Extract from the tool call result
      const toolResult = result[0];
      if (toolResult.content) {
        try {
          const contentData = JSON.parse(toolResult.content as string);
          console.log("Parsed content data:", contentData);
          
          successful = contentData.successful;
          if (successful && contentData.data?.data) {
            tweetId = contentData.data.data.id;
            tweetText = contentData.data.data.text || content;
          }
          
          if (!successful) {
            console.error("Failed to post tweet:", contentData.error);
            return new Response(JSON.stringify({ 
              success: false, 
              error: contentData.error || "Failed to post tweet" 
            }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }
        } catch (parseError) {
          console.error("Error parsing tool result content:", parseError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: "Failed to parse tweet response" 
          }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }
    }
    
    // Create tweet URL (we'll need to get the username from the response or use a generic format)
    // For now, we'll use the tweet ID to create the URL
    const tweetUrl = tweetId ? `https://twitter.com/i/web/status/${tweetId}` : undefined;
    
    console.log('Tweet ID:', tweetId);
    console.log('Tweet URL:', tweetUrl);
    
    // Create success response data
    const twitterData = {
      type: 'twitter-post-success',
      content: tweetText,
      userId: userId,
      timestamp: Date.now(),
      posted: true,
      tweetId: tweetId,
      tweetUrl: tweetUrl,
      tweetData: result[0]
    };
    
    console.log('Created Twitter success data:', twitterData);
    
    return new Response(JSON.stringify({
      success: true,
      message: "Tweet posted successfully!",
      twitterData: twitterData
    }), {
      headers: { "content-type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in Twitter post API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to post tweet";
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}