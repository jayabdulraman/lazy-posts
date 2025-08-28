# Testing Scripts

This directory contains various testing scripts for the application.

## Twitter Connection Test

The `test-twitter-connection.ts` script helps you test Twitter authentication and connection using the Composio API.

### Prerequisites

1. Make sure you have a `.env.local` file in the root of the project with your Composio API key:
   ```
   COMPOSIO_API_KEY=your_api_key_here
   ```

2. Ensure you have the correct Auth Config ID in the script. The default is `ac_UdqFwixfy3cV`, but you should update it to match your Composio dashboard.

### Running the Test

You can run the test in two ways:

1. Using the npm script:
   ```bash
   npm run test:twitter
   ```

2. Directly using ts-node:
   ```bash
   npx ts-node tests/test-twitter-connection.ts
   ```

### What the Test Does

1. Initializes a Composio client with your API key
2. Prompts you for a user ID (defaults to "jayabdulraman")
3. Initiates a Twitter connection request
4. Provides the redirect URL and offers to open it in your browser
5. Waits for the connection to be established (this will block until authentication completes)
6. Verifies the connection by retrieving it by ID
7. Tests available Twitter tools for the authenticated user

### Troubleshooting

If you encounter any errors:

1. Check that your Composio API key is correct
2. Verify the Auth Config ID matches your Twitter integration in Composio
3. Ensure your Twitter app has the necessary permissions
4. Check the Composio dashboard for any error messages or logs

### Example Output

```
Initializing Composio client...
Enter user ID (default: jayabdulraman): 

Initiating connection for user: jayabdulraman
Please wait...

Connection request ID: cr_abcdefg123456
Redirect URL: https://auth.composio.dev/oauth/authorize?client_id=...

Do you want to open this URL in your browser? (y/n): y
Opening URL in your default browser...

Waiting for connection to complete...
(This will block until authentication is complete or times out)

Connection established successfully!
Connected account ID: ca_xyz789
Status: ACTIVE

Testing connection retrieval by ID...
Retrieved connection status: ACTIVE

Testing available Twitter tools...
Available tools: TWITTER_USER_LOOKUP_ME, TWITTER_CREATION_OF_A_POST

Test completed successfully!
```
