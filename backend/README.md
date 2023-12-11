# Xavier backend

## Deployment Guide

### Step 1 (setup your MDM server)
Xavier's backend receives responses from the endpoints as a webhook through an open source MDM server such as [MicroMDM](https://micromdm.io) or [NanoMDM](https://github.com/micromdm/nanomdm). If you don't already have a running MDM server, you'll want to set that up first.

### Step 2 (define env variables)
The backend requires several environment variables. How you set env variables depends on where/how you are hosting the backend. One possible way to supply the environment variables is to define them in a **.env** file in the root directory of the backend project.\
`PORT=8080`\
`MONGO_URI="mongodb+srv://MONGO_USER:MONGO_PASSWORD@MONGO_URL/?retryWrites=true&w=majority"`\
`NODE_ENV="production"`\
`MDM_USER="yourMDM_serverUsername`\
`MDM_TOKEN="yourMDM_apiToken"`\
`MDM_SERVER_URL="https://yourMDM-ServerURL"`\
`XAVIER_FRONTEND_SERVER_URL="https://www.yourFrontEndServerURL"`\
`JWT_SECRET="LONG_RANDOM_STRING_TO_SECURE_YOUR_JWTS"`\
`SSL_CERTIFICATE_FILE="path to your SSL certificate"` (optional)\
`SSL_KEY_FILE="path to your SSL key"` (optional)

1. Set the port to whatever port is needed in your hosting environment.
2. Setting the NODE_ENV to development would enable the GraphiQL interactive in-browser GraphQL IDE. Please do not do this in your production environment.
3. The SSL_CERTIFICATE_FILE and SSL_KEY_FILE are only required if you are terminating TLS on the server. If you are using a load balancer (recommended), do not provide these varaiables.

### Step 3 (install dependencies)
Xavier was built and tested using **Node.js v18.17.0**. Assuming you have Node.js installed, you can install the project dependencies. In the root directory of the backend project, enter:\
`npm install` \
This will install all dependencies required to build the project.

### Step 4 (start the backend server)
The project can now be served using:\
`node server.js`

If you are running this app on an AWS EC2 or Google Compute Engine consider managing it with [PM2 process manager](https://pm2.keymetrics.io).

### Step 5 (point your MDM server to the backend server)
Now that the backend server is running, you'll need to redirect MDM responses from the MDM server to the backend server. In the serve command for your MDM server, add the URL for your backend server as a webhook:\
`-command-webhook-url https://yourBackendServerURL/mdm/webhook
`
