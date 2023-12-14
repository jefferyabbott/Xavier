# Xavier backend

## Deployment Guide

### Step 1 (setup your MDM server)
Xavier's backend receives responses from the endpoints as a webhook through an open source MDM server such as [MicroMDM](https://micromdm.io) or [NanoMDM](https://github.com/micromdm/nanomdm). If you don't already have a running MDM server, you'll want to set that up first.

### Step 2 (setup the database)
Xavier uses **MongoDB** to store and retrieve data about the endpoints. You will need to setup (and secure) a database. Probably the quickest way to do this is to use **MongoDB Atlas**. If you are running this in AWS, **Amazon DocumentDB** is a fully-compatible clone of MongoDB. Alternatively, you could run your own MongoDB server. If you are setting up a simple testing environment, running MongoDB server on the same server as the backend app would be fine.

### Step 3 (define env variables)
The backend requires several environment variables. How you set env variables depends on where/how you are hosting the backend. One possible way to supply the environment variables is to define them in a **.env** file in the root directory of the backend project.
```
PORT=8080
MONGO_URI="mongodb+srv://MONGO_USER:MONGO_PASSWORD@MONGO_URL/?retryWrites=true&w=majority"
NODE_ENV="production"
MDM_USER="yourMDM_serverUsername"
MDM_TOKEN="yourMDM_apiToken"
MDM_SERVER_URL="https://yourMDM-ServerURL"
XAVIER_FRONTEND_SERVER_URL="https://www.yourFrontEndServerURL"
JWT_SECRET="LONG_RANDOM_STRING_TO_SECURE_YOUR_JWTS"
SSL_CERTIFICATE_FILE="path to your SSL certificate" #(optional)
SSL_KEY_FILE="path to your SSL key" #(optional)
```

1. Set the port to whatever port is needed in your hosting environment.
2. Setting the NODE_ENV to development would enable the GraphiQL interactive in-browser GraphQL IDE. Please do not do this in your production environment.
3. The SSL_CERTIFICATE_FILE and SSL_KEY_FILE are only required if you are terminating TLS on the server. If you are using a load balancer (recommended), do not provide these variables.

### Step 4 (install dependencies)
Xavier was built and tested using **Node.js v18.17.0**. Assuming you have Node.js installed, you can install the project dependencies. In the root directory of the backend project, enter:\
`npm install` \
This will install all dependencies required to build the project.

### Step 5 (enable new user registration)
Xavier will eventually support account management through a SAML provider such as Okta. For now, though, you must create local user accounts. In order to create your first user account, which will have administrator privileges by default, open [backend/routes/consoleUserRoutes.js](https://github.com/jefferyabbott/Xavier/blob/main/backend/routes/consoleUserRoutes.js) and uncomment the following line:\
```// router.post('/register', registerUser);```\
This will allow you to register your first user account. You'll see how to do that in step 7.

### Step 6 (start the backend server)
The project can now be served using:\
`node server.js`

If you are running this app on an AWS EC2 or Google Compute Engine consider managing it with [PM2 process manager](https://pm2.keymetrics.io).

### Step 7 (create the first user account)
Using an app like Postman or using the curl command, send a `POST` request to:\
`https://https://yourBackendServerURL/api/users/register`\
In the body of the POST request, include a JSON object containing { name, email, password }. If using curl, the request may look like this:
```
curl --location 'https://yourBackendServerURL/api/users/register' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=First User' \
--data-urlencode 'email=firstuser@example.com' \
--data-urlencode 'password=mySuperSecretPassword'
```
or ...
```
curl --location 'https://yourBackendServerURL/api/users/register' \
--header 'Content-Type: application/json' \
--data-raw '{
    '\''name'\'': '\''First User'\'',
    '\''email'\'': '\''firstuser@example.com'\'',
    '\''password'\'': '\''mySuperSecretPassword
}'
```

After creating the first user account, return to step 5 and comment out the register route so people cannot make their own user accounts. Then restart the server. By default, after one administrator account is created, any future accounts created using the register route will have read-only auditor privileges.

### Step 8 (point your MDM server to the backend server)
Now that the backend server is running, you'll need to redirect MDM responses from the MDM server to the backend server. In the **serve** command for your MDM server, add the URL for your backend server as a webhook:\
`-command-webhook-url https://yourBackendServerURL/mdm/webhook
`
