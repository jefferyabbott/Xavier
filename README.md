# Xavier

Xavier is an open source project that provides a backend and frontend for open source MDM servers such as [MicroMDM](https://micromdm.io) or [NanoMDM](https://github.com/micromdm/nanomdm).

![Xavier Dashboard](https://uca9e3e5caa6d2145fa24785c25e.dl.dropboxusercontent.com/cd/0/inline/CYVCTAcmXDv73xfgwKO4YEZ-lNn1NXZomm7JbeyAlwDpF9MhjIOEyhCCXptX7TM8XXXl_An-iNfCimftyuFYUyMWIl7KP_NHe4VUqMqiOajcU-KZJQITauVNXkvUJsPzOG-jYKCJWH6fuxlckBJB80NS/file#)
![Xavier Endpoint View](https://uce974e9445650bd613d73fa82a5.dl.dropboxusercontent.com/cd/0/inline/CYVHCxEdnPBw6d9Km2rV_UHx4f9HM8n3JlZvZZx9mx4jvTDNJqpuaRwEZ7uGynOF_Y6N9bTaej2TL0GmAr-waCklADLFux5kErkm8XP9joxvAA9bkD8bUYYEYFZ35icRPm_2-vbLKu0RaaqfUjjmyF_0/file#)

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



