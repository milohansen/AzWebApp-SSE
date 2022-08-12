# AzWebApp-SSE
An ultra-simple example repo for replicating SSE issues when Azure App Service middleware (CORS, Auth) are enabled.

When running locally or in an Azure App Service *WITHOUT* middleware, connections between the client website and server correctly terminate.


## Running

1. Start the server by running ```node server.js```.

2. Open the web page by navigating to localhost:4000 (or whatever your app's url is).

3. On a separate screen open the streaming logs for your App Service or server console.

4. Click the 'Connect' button on the webpage.

    - Both the webpage and server should show messages saying 'Connection opened' and 'sending/recieved Hi'.
    - Every five seconds a new greeting will be sent and logged on both the server and webpage.

5. At any point after the connection has been opened: click the 'Disconnect' button.

    - Both the webpage and server should show messages saying 'Connection closed'.
      > The server's message will also include a unique ID that is be correlated to the client via an 'x-client-id' header in the network request.

    - **WHEN RUNNING WITH MIDDLEWARE ENABLED**: The disconnect message does *not* appear on the server and the server will continue to send greetings.

## Configuring App Service middleware

To enable middleware (and cause the issue we're seeing) you will need to set up CORS and/or Authentication on your App Serice

### CORS

1. Navigate to the 'CORS' option in the Azure portal view of your App Service.

2. Add any value to the list of Allowed Origins.

3. Save and wait a minute for the app service to restart.

> Reset by removing all CORS config (no Allowed Origins and uncheck 'Enable Access-Control-Allow-Credentials')

### Authentication

1. Navigate to the 'Authentication' option in the Azure portal view of your App Service.

2. Set up Authentication using any identity provider and any options.

3. Save and wait a minute for the app service to restart.

> Reset by disabling Authentication