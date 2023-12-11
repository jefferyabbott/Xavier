import { v4 as uuidv4 } from 'uuid';

export const createRawCommandPlist = (args) => {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
    <plist version="1.0">
    <dict>
        <key>Command</key>
        <dict>
            ${args}
        </dict>
        <key>CommandUUID</key>
        <string>${uuidv4().toUpperCase()}</string>
    </dict>
    </plist>`;
}