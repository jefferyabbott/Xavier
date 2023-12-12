import * as dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import https from 'https';
import express from 'express';
import cors from 'cors';
import errorHandler from './middleware/errorHandler.js';
import protect from './middleware/authHandler.js';

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

// define graphql endpoint
import { graphqlHTTP } from 'express-graphql';
import schema from './schema/schema.js';
app.use('/graphql', protect, graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
}));

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
