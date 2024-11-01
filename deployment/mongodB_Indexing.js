// Index creation commands for MongoDB
// Run these against your database to improve query performance

// Indexes for common device queries
db.macosdevices.createIndex({ "SerialNumber": 1 });
db.iosdevices.createIndex({ "SerialNumber": 1 });
db.ipadosdevices.createIndex({ "SerialNumber": 1 });

// Compound indexes for filtered queries
db.macosdevices.createIndex({ 
  "QueryResponses.OSVersion": 1,
  "mdmProfileInstalled": 1,
  "QueryResponses.SystemIntegrityProtectionEnabled": 1
});

// Indexes for security queries
db.macosdevices.createIndex({ "SecurityInfo.FDE_Enabled": 1 });
db.macosdevices.createIndex({ "QueryResponses.SystemIntegrityProtectionEnabled": 1 });
db.macosdevices.createIndex({ "mdmProfileInstalled": 1 });

// Indexes for application queries
db.macosdevices.createIndex({ "Applications.Name": 1, "Applications.Version": 1 });
db.iosdevices.createIndex({ "Applications.Name": 1, "Applications.Version": 1 });
db.ipadosdevices.createIndex({ "Applications.Name": 1, "Applications.Version": 1 });

// Indexes for profile queries
db.macosdevices.createIndex({ "Profiles.PayloadDisplayName": 1 });
db.iosdevices.createIndex({ "Profiles.PayloadDisplayName": 1 });
db.ipadosdevices.createIndex({ "Profiles.PayloadDisplayName": 1 });

// Index for pagination
db.macosdevices.createIndex({ "_id": 1 });
db.iosdevices.createIndex({ "_id": 1 });
db.ipadosdevices.createIndex({ "_id": 1 });

// Index for command logs
db.commands.createIndex({ "DeviceUDID": 1 });

// Index for console users
db.consoleusers.createIndex({ "_id": 1 });

// Index for compliance card preferences
db.compliancecardprefs.createIndex({ "consoleUser": 1 });
