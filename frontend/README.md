# Xavier frontend

## Deployment Guide

### Step 1 (setup your backend server)
Please first setup the backend server.\
For details, view [backend/README.md](https://github.com/jefferyabbott/Xavier/blob/main/backend/README.md).

### Step 2 (define env variable)
The frontend is a static website that needs to know how to find the backend. The react-scripts build process will look for an environment variable that contains the URL of the backend server. The easiest way to supply the environment variable is to define it in a **.env** file in the root directory of the frontend project.\
`REACT_APP_BACKEND_SERVER="https://yourBackendServerURL"`

### Step 3 (install dependencies)
In the root directory of the frontend project, enter:\
`npm install` \
This will install all dependencies required to build the project.

### Step 4 (build)
In the root directory of the frontend project, enter:\
`npm run build`

This builds the app for production to the **build** folder.\
It correctly bundles React in production mode and optimizes the build for the best performance. The build is minified and the filenames include the hashes.

### Step 5 (deploy)
The build folder contains all static resources for the website. Upload the build folder to your favorite web hosting solution. The entry point is **build/index.html**.