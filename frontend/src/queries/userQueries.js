import { gql } from '@apollo/client';

const GET_CONSOLE_USERS = gql`
query getConsoleUsers {
    consoleusers {
        name
        email
        userType
    }
}
`

const GET_USER_INFO = gql`
query getUserInfo($userId: ID!) {
    lookupUser(userId: $userId) {
        name
        email
    }
}
`

export { GET_CONSOLE_USERS, GET_USER_INFO };
