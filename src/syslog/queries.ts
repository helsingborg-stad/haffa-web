export const getSyslogQuery = /* GraphQL */ `
    query Query {
        syslog {
            at
            by
            message
            severity
            type
        }
    }
`
