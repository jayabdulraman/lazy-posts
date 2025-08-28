export const maxDuration = 30;

import OpenAI from "openai";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { content, userId, authorId }: { content: string; userId: string; authorId?: string } = await req.json();
    
    if (!content || !userId) {
      return new Response(JSON.stringify({ error: "Content and userId are required" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    
    if (!authorId) {
      return new Response(JSON.stringify({ error: "LinkedIn author ID is required. Please reconnect your LinkedIn account." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    
    if (!process.env.COMPOSIO_LINKEDIN_API_KEY) {
      return new Response(JSON.stringify({ error: "Composio API key not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    
    console.log("Starting LinkedIn post endpoint");
    console.log("Content to post:", content);
    console.log("User ID:", userId);
    console.log("Author ID:", authorId);
    
    const composio = new Composio({
      apiKey: process.env.COMPOSIO_LINKEDIN_API_KEY,
    });
    
    // Get LinkedIn tools 
    const linkedinTools = await composio.tools.get(userId, {
      tools: ['LINKEDIN_CREATE_LINKED_IN_POST'],
    });
    
    console.log("LinkedIn tools available:", Object.keys(linkedinTools));
    
    // Define the task
    const task = `Post the following content to LinkedIn: 
      author: ${authorId}
      Commentary: ${content}
      lifecycleState: PUBLISHED
      visibility: PUBLIC
      `;
    
    // Define the messages for the assistant
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a LinkedIn posting agent. Post the provided content to LinkedIn using the LINKEDIN_CREATE_LINKED_IN_POST tool. Maintain a professional tone appropriate for LinkedIn's business-focused platform."
      },
      { role: "user", content: task }
    ];
    
    // Create a chat completion
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages,
      tools: linkedinTools,
      tool_choice: "auto",
    });
    
    console.log("OpenAI response:", response);
    
    // Execute the tool calls using Composio
    const result = await composio.provider.handleToolCalls(userId, response);
    console.log("Tool execution result:", result);
    
    // Parse the tool execution result
    console.log("Raw result structure:", JSON.stringify(result, null, 2));
    
    let postId: string | undefined;
    let postText: string = content;
    let successful = false;
    
    if (Array.isArray(result) && result.length > 0) {
      // Extract from the tool call result
      const toolResult = result[0];
      if (toolResult.content) {
        try {
          const contentData = JSON.parse(toolResult.content as string);
          console.log("Parsed content data:", contentData);
          console.log("Full response_data structure:", JSON.stringify(contentData.data?.response_data, null, 2));
          
          successful = contentData.successful;
          if (successful && contentData.data) {
            // Check for share_id in the response_data
            if (contentData.data.response_data && contentData.data.response_data.share_id) {
              postId = contentData.data.response_data.share_id;
            } else if (contentData.data.id) {
              postId = contentData.data.id;
            }
            postText = contentData.data.text || content;
          }
          
          if (!successful) {
            console.error("Failed to post to LinkedIn:", contentData.error);
            return new Response(JSON.stringify({ 
              success: false, 
              error: contentData.error || "Failed to post to LinkedIn" 
            }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }
        } catch (parseError) {
          console.error("Error parsing tool result content:", parseError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: "Failed to parse LinkedIn response" 
          }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }
    }
    
    // Create LinkedIn post URL
    // LinkedIn post URLs use urn:li:share: format
    let postUrl: string | undefined;
    if (postId) {
      // If postId is in URN format like "urn:li:share:123456", use it directly
      // If it's just a numeric ID, wrap it in the urn:li:share: format
      const shareId = postId.includes('urn:li:share:') ? postId : `urn:li:share:${postId}`;
      postUrl = `https://www.linkedin.com/feed/update/${shareId}`;
    }
    
    console.log('LinkedIn Post ID:', postId);
    console.log('LinkedIn Post URL:', postUrl);
    
    // Create success response data
    const linkedinData = {
      type: 'linkedin-post-success',
      content: postText,
      userId: userId,
      timestamp: Date.now(),
      posted: true,
      postId: postId,
      postUrl: postUrl,
      postData: result[0]
    };
    
    console.log('Created LinkedIn success data:', linkedinData);
    
    return new Response(JSON.stringify({
      success: true,
      message: "LinkedIn post published successfully!",
      linkedinData: linkedinData
    }), {
      headers: { "content-type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in LinkedIn post API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to post to LinkedIn";
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}