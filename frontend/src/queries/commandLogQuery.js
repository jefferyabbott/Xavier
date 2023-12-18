import { gql } from '@apollo/client';

const GET_COMMAND_LOG = gql`
    query getCommandLog($DeviceUDID: String!) {
        commandlogs(DeviceUDID: $DeviceUDID) {
            CommandUUID
            RequestType
            Requester
            Approver
            Response
            createdAt
            updatedAt
    }
}`

export { GET_COMMAND_LOG };
