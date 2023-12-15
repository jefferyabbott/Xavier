# Xavier

Xavier is an open source project that provides a backend and frontend for open source MDM servers such as [MicroMDM](https://micromdm.io) or [NanoMDM](https://github.com/micromdm/nanomdm).

![Xavier Dashboard](https://storage.googleapis.com/github-images/XavierDashboard.png)
![Xavier Endpoint View](https://storage.googleapis.com/github-images/XavierEndpoint.png)

## Quick Start
1. Setup your MDM server - either [MicroMDM](https://micromdm.io) or [NanoMDM](https://github.com/micromdm/nanomdm)
2. Setup the backend server - deployment guide is found at [backend/README.md](https://github.com/jefferyabbott/Xavier/blob/main/backend/README.md)
3. Setup the frontend web site - deployment guide is found at [frontend/README.md](https://github.com/jefferyabbott/Xavier/blob/main/frontend/README.md)

## User Accounts
Xavier will eventually support SAML authentication. For now, as a new project, it only supports local user accounts. There are two types of accounts: administrator (can do anything) and auditor (read-only, cannot do anything). See the deployment guide for the backend in order to setup your first administrator account.

## Recommended Architecture
The backend server can be especially busy - it handles requests from both the frontend and the MDM server. In a medium to large environment, it would be helpful to have a load balancer and multiple backend servers. This diagram is an idea of what the architecture could look like.
![Xavier Architecture](https://storage.googleapis.com/github-images/XavierArchitecture.png)
This diagram includes *Cloud Functions*, which are not currently used in the app but are on the future roadmap. Cloud Functions will be used to handle mass deployment of config profiles or MDM commands.



