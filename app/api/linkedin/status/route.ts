// Using Node.js runtime for Composio SDK compatibility
export const maxDuration = 30;

import { Composio } from "@composio/core";
import { VercelProvider } from "@composio/vercel";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId') || 'jayabdulraman';
    const connectionId = url.searchParams.get('connectionId');

    const apiKey = process.env.COMPOSIO_LINKEDIN_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: 'COMPOSIO_API_KEY not configured' 
      }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    const composio = new Composio({
      apiKey: apiKey,
      provider: new VercelProvider(),
    });

    console.log("LinkedIn connectionId", connectionId);
    try {
      // If we have a connectionId, check that specific connection
      if (connectionId) {
        try {
          const connection = await composio.connectedAccounts.get(connectionId);
          if (connection && connection.status === "ACTIVE") {
            return new Response(JSON.stringify({ 
              authenticated: true,
              connectionId,
              userId
            }), {
              headers: { 'content-type': 'application/json' }
            });
          }
        } catch (connErr) {
          console.log("LinkedIn connection not ready yet:", connErr);
          // Continue to regular check if connection check fails
        }
      }
      
      // Try to get user profile to check if authenticated
      const connectedAccount = await composio.connectedAccounts.get(userId);

      const tools = await composio.tools.get(userId, {
        tools: ['LINKEDIN_CREATE_LINKED_IN_POST'],
      });
      console.log("LinkedIn tools", tools);

      if (connectedAccount.status === "ACTIVE" && Object.keys(tools).length > 0) {
        // Tools are available, user is likely authenticated
        return new Response(JSON.stringify({ 
          authenticated: true,
          hasLinkedInTools: true,
          userId
        }), {
          headers: { 'content-type': 'application/json' }
        });
      } else {
        return new Response(JSON.stringify({ 
          authenticated: false,
          hasLinkedInTools: false,
          userId
        }), {
          headers: { 'content-type': 'application/json' }
        });
      }
    } catch (error) {
      // If we can't get tools, user is not authenticated
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: 'Not authenticated with LinkedIn',
        userId
      }), {
        headers: { 'content-type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('LinkedIn status check error:', error);
    return new Response(JSON.stringify({ 
      authenticated: false,
      error: 'Status check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}