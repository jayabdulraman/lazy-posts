#!/usr/bin/env node

const { Composio } = require('@composio/core');
const dotenv = require('dotenv');
const readline = require('readline');

// Load environment variables
dotenv.config({ path: '.env.local' });

const apiKey = process.env.COMPOSIO_API_KEY;
if (!apiKey) {
  console.error('Error: COMPOSIO_API_KEY not found in environment variables');
  process.exit(1);
}

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function testTwitterConnection() {
  try {
    console.log('Initializing Composio client...');
    const composio = new Composio({ apiKey: apiKey });

    // Use the "AUTH CONFIG ID" from your dashboard
    const authConfigId = 'ac_dketwvUehtjR'; // Update this with your actual auth config ID
    
    // Prompt for user ID
    const userId = await new Promise((resolve) => {
      rl.question('Enter user ID (default: jayabdulraman): ', (answer) => {
        resolve(answer || 'jayabdulraman');
      });
    });

    console.log(`\nInitiating connection for user: ${userId}`);
    console.log('Please wait...');

    const connRequest = await composio.connectedAccounts.initiate(
      userId,
      authConfigId
    );

    console.log(`\nConnection request ID: ${connRequest.id}`);
    console.log(`Redirect URL: ${connRequest.redirectUrl}`);

    // Ask if user wants to open the URL in browser
    const shouldOpen = await new Promise((resolve) => {
      rl.question('\nDo you want to open this URL in your browser? (y/n): ', (answer) => {
        resolve(answer.toLowerCase() === 'y');
      });
    });

    if (shouldOpen && connRequest.redirectUrl) {
      console.log('Opening URL in your default browser...');
      console.log(`URL: ${connRequest.redirectUrl}`);
      
      try {
        // Use dynamic import for the 'open' package
        const open = (await import('open')).default;
        await open(connRequest.redirectUrl);
      } catch (err) {
        console.error('Failed to open URL in browser:', err);
        console.log('Please manually copy and paste the URL into your browser.');
      }
    } else if (shouldOpen) {
      console.log('Error: No redirect URL available');
    }

    console.log('\nWaiting for connection to complete...');
    console.log('(This will block until authentication is complete or times out)');
    
    const connectedAccount = await connRequest.waitForConnection(6000);
    console.log(`\nConnection established successfully!`);
    console.log(`Connected account ID: ${connectedAccount.id}`);
    console.log(`Status: ${connectedAccount.status}`);
    
    // Test getting the connection by ID
    console.log('\nTesting connection retrieval by ID...');
    const retrievedConnection = await composio.connectedAccounts.get(connectedAccount.id);
    console.log(`Retrieved connection status: ${retrievedConnection.status}`);
    
    // Test getting available tools
    console.log('\nTesting available Twitter tools...');
    try {
      const tools = await composio.tools.get(userId, {
        tools: ['TWITTER_USER_LOOKUP_ME'],
      });
      console.log(`Available tools: ${Object.keys(tools).join(', ')}`);
    } catch (error) {
      console.error('Error getting tools:', error);
    }

    console.log('\nTest completed successfully!');
  } catch (error) {
    console.error('Error during connection test:', error);
  } finally {
    rl.close();
  }
}

// Run the test
testTwitterConnection();
