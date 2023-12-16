import command from "../models/commandHistory.js";

async function logCommand(CommandUUID, RequestType, Requester, DeviceUDID) {

    await command.updateOne(
        {CommandUUID},
        {
            CommandUUID,
            RequestType,
            Requester,
            DeviceUDID
        },
        {
            upsert: true
        }
    );
}

async function logResponse(CommandUUID, Response, DeviceUDID) {
    await command.updateOne(
        {CommandUUID},
        {
            CommandUUID,
            Response,
            DeviceUDID
        }
    )
}


export { logCommand, logResponse };
