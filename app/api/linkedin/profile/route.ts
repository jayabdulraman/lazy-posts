export const maxDuration = 30;

import OpenAI from "openai";
import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'jayabdulraman';
    
    if (!process.env.COMPOSIO_LINKEDIN_API_KEY) {
      return new Response(JSON.stringify({ error: "Composio API key not configured" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    
    console.log("Getting LinkedIn profile for user:", userId);
    
    const composio = new Composio({
      apiKey: process.env.COMPOSIO_LINKEDIN_API_KEY,
    });
    
    // Get LinkedIn profile tools
    const linkedinTools = await composio.tools.get(userId, {
      tools: ['LINKEDIN_GET_MY_INFO'],
    });
    
    console.log("LinkedIn profile tools available:", Object.keys(linkedinTools));
    
    if (Object.keys(linkedinTools).length === 0) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "LinkedIn tools not available. Please authenticate first." 
      }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    
    // Define the task
    const task = `Get my LinkedIn profile information including my author ID.`;
    
    // Define the messages for the assistant
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: "You are a LinkedIn profile agent. Use the LINKEDIN_GET_MY_INFO tool to retrieve the authenticated user's LinkedIn profile information. Extract the author_id from the response_dict.data object."
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
    
    let profileData = null;
    let authorId: string | undefined;
    let successful = false;
    
    if (Array.isArray(result) && result.length > 0) {
      // Extract from the tool call result
      const toolResult = result[0];
      if (toolResult.content) {
        try {
          const contentData = JSON.parse(toolResult.content as string);
          console.log("Parsed content data:", contentData);
          
          successful = contentData.successful;
          if (successful && contentData.data?.response_dict) {
            profileData = contentData.data.response_dict;
            // Extract author_id from the profile data
            if (profileData.author_id) {
              authorId = profileData.author_id;
              console.log("Extracted author ID:", authorId);
            }
          }
          
          if (!successful) {
            console.error("Failed to get LinkedIn profile:", contentData.error);
            return new Response(JSON.stringify({ 
              success: false, 
              error: contentData.error || "Failed to get LinkedIn profile" 
            }), {
              status: 500,
              headers: { "content-type": "application/json" },
            });
          }
        } catch (parseError) {
          console.error("Error parsing tool result content:", parseError);
          return new Response(JSON.stringify({ 
            success: false, 
            error: "Failed to parse LinkedIn profile response" 
          }), {
            status: 500,
            headers: { "content-type": "application/json" },
          });
        }
      }
    }
    
    if (!authorId) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Could not extract author ID from LinkedIn profile" 
      }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    
    console.log('LinkedIn Profile Data:', profileData);
    console.log('Author ID:', authorId);
    
    // Return the profile data and author ID
    const linkedinProfileData = {
      success: true,
      authorId: authorId,
      profile: {
        id: profileData?.author_id,
        name: profileData?.name,
        given_name: profileData?.given_name,
        family_name: profileData?.family_name,
        email: profileData?.email,
        picture: profileData?.picture,
        locale: profileData?.locale,
        // Add other relevant fields as needed
      },
      rawData: profileData
    };
    
    console.log('Created LinkedIn profile data:', linkedinProfileData);
    
    return new Response(JSON.stringify(linkedinProfileData), {
      headers: { "content-type": "application/json" },
    });
    
  } catch (error) {
    console.error("Error in LinkedIn profile API:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to get LinkedIn profile";
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}