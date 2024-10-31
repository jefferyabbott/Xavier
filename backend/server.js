import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import DataLoader from 'dataloader';
import errorHandler from './middleware/errorHandler.js';
import protect from './middleware/authHandler.js';

// models
import macOSDevice from './models/macOSDevice.js';
import iOSDevice from './models/iOSDevice.js';
import iPadOSDevice from './models/iPadOSDevice.js';

// Create DataLoader factory functions
const createLoaders = () => ({
  applicationLoader: new DataLoader(async (names) => {
    const results = await macOSDevice.aggregate([
      { $unwind: '$Applications' },
      { $match: { 'Applications.Name': { $in: names } } },
      { $project: {
        deviceSerialNumber: '$SerialNumber',
        deviceName: '$QueryResponses.DeviceName',
        deviceModel: '$QueryResponses.Model',
        osVersion: '$QueryResponses.OSVersion',
        appVersion: '$Applications.Version',
        appShortVersion: '$Applications.ShortVersion',
        bundleSize: '$Applications.BundleSize',
        installing: '$Applications.Installing',
        applicationName: '$Applications.Name'
      }}
    ]);
    
    return names.map(name => 
      results.filter(result => result.applicationName === name)
    );
  }),
  
  deviceLoader: new DataLoader(async (serialNumbers) => {
    const devices = await Promise.all([
      macOSDevice.find({ SerialNumber: { $in: serialNumbers } }),
      iOSDevice.find({ SerialNumber: { $in: serialNumbers } }),
      iPadOSDevice.find({ SerialNumber: { $in: serialNumbers } })
    ]);
    
    const allDevices = devices.flat();
    return serialNumbers.map(serial => 
      allDevices.find(device => device.SerialNumber === serial) || null
    );
  })
});

const app = express();

app.use(cors({
  origin: [process.env.MDM_SERVER_URL, process.env.XAVIER_FRONTEND_SERVER_URL]
}));

app.use(express.json({ limit: '50mb', extended: false }));
app.use(express.urlencoded({extended: false}));

// connect to database
import connectDB from './config/database.js';
connectDB();

import mdmWebhookRouter from './routes/mdmWebhookRoutes.js';
import mdmCommandRouter from './routes/mdmCommandRoutes.js';
import userRouter from './routes/consoleUserRoutes.js';
import complianceCardPrefsRouter from './routes/complianceCardPrefsRoutes.js';

// open routes
app.use('/mdm/webhook', mdmWebhookRouter);
app.use('/api/users', userRouter);

// protected routes
app.use('/mdm/commands', protect, mdmCommandRouter);
app.use('/complianceCardPrefs', protect, complianceCardPrefsRouter);

// graphql endpoint
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema.js';

// Configure GraphQL with context
app.use('/graphql', protect, (req, res) => {
  graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
    context: {
      ...createLoaders(),
      user: req.user,
    }
  })(req, res);
});

app.use(errorHandler);

if (process.env.SSL_KEY_FILE && process.env.SSL_CERTIFICATE_FILE) {
  const httpsServer = https.createServer({
    key: fs.readFileSync(process.env.SSL_KEY_FILE),
    cert: fs.readFileSync(process.env.SSL_CERTIFICATE_FILE),
  }, app);
  
  httpsServer.listen(process.env.PORT, () => {
    console.log(`MDM backend server running on port ${process.env.PORT} w/ TLS.`);
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log(`MDM backend server running on port ${process.env.PORT}.`);
  });
}
