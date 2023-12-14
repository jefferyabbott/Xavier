import consoleUser from "../models/consoleUser.js";

export default async function isAdministrator(id) {
    const requestingUser = await consoleUser.findOne({ _id: id }).select(['-password']);
    if (requestingUser.userType === 'consoleAdministrator') {
        return true;
    }
    return false;
}