import { v4 as uuidv4 } from 'uuid';
import { logCommand } from './logCommand.js';

const createRawCommandPlistWithLog = (args, RequestType, Requester, DeviceUDID) => {
    const CommandUUID = uuidv4().toUpperCase();

    // log command
    logCommand(CommandUUID, RequestType, Requester, DeviceUDID)

    return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>Command</key>
        <dict>
            ${args}
        </dict>
        <key>CommandUUID</key>
        <string>${CommandUUID}</string>
    </dict>
    </plist>`;
}

const createRawCommandPlistWithoutLog = (args) => {
    const CommandUUID = uuidv4().toUpperCase();

    return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>Command</key>
        <dict>
            ${args}
        </dict>
        <key>CommandUUID</key>
        <string>${CommandUUID}</string>
    </dict>
    </plist>`;
}

export { createRawCommandPlistWithLog, createRawCommandPlistWithoutLog };
