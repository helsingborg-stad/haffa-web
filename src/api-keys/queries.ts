export const getApiKeysQuery = /* GraphQL */ `
    query Query {
        apiKeys {
            email
            secret
            expires
        }
    }
`

export const updateApiKeysMutation = /* GraphQL */ `
    mutation Mutation($input: [ApiKeyInput]!) {
        updateApiKeys(input: $input) {
            email
            secret
            expires
        }
    }
`
