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

export { GET_CONSOLE_USERS };
