// Using Node.js runtime for Composio SDK compatibility
export const maxDuration = 30;

import { Composio } from "@composio/core";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      return new Response(JSON.stringify({ error: 'Missing authorization code' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      });
    }

    const apiKey = process.env.COMPOSIO_LINKEDIN_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'COMPOSIO_LINKEDIN_API_KEY not configured' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    // Initialize Composio client
    const composio = new Composio({
      apiKey: apiKey,
    });

    // Exchange authorization code for access token
    // This should be handled by Composio's authentication flow
    // The exact implementation depends on Composio's OAuth handling
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Authentication successful',
      redirect: '/'
    }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('LinkedIn OAuth error:', error);
    return new Response(JSON.stringify({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.COMPOSIO_LINKEDIN_API_KEY;
    const authKey = process.env.COMPOSIO_LINKEDIN_AUTH_CONFIG_ID;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'COMPOSIO_LINKEDIN_API_KEY not configured' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    if (!authKey) {
      return new Response(JSON.stringify({ error: 'LINKEDIN_AUTH_CONFIG_ID not configured' }), {
        status: 500,
        headers: { 'content-type': 'application/json' }
      });
    }

    // Get the user ID from request body or generate one
    const { userId = "jayabdulraman" } = await req.json().catch(() => ({}));

    // Initialize Composio client
    const composio = new Composio({
      apiKey: apiKey,
    });

    const connectionRequest = await composio.connectedAccounts.initiate(userId, authKey);

    // Get authentication URL for LinkedIn
    // This depends on Composio's authentication flow
    const authUrl = connectionRequest.redirectUrl || 'http://localhost:3000/api/linkedin/auth';
    
    // Don't wait for connection here - return immediately with the auth URL
    // The client will handle redirecting the user and waiting for completion
    console.log("LinkedIn connectionRequest ID", connectionRequest.id);
    return new Response(JSON.stringify({ 
      authUrl,
      connectionId: connectionRequest.id, // Include the connection ID for status checks
      message: 'Use this URL to authenticate with LinkedIn'
    }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error) {
    console.error('LinkedIn auth initiation error:', JSON.stringify(error, null, 2));
    return new Response(JSON.stringify({ 
      error: 'Failed to initiate authentication',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}