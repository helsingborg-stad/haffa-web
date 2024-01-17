export const getLoginPoliciesQuery = /* GraphQL */ `
    query Query {
        loginPolicies {
            emailPattern
            roles
            deny
        }
    }
`

export const setLoginPoliciesMutation = /* GraphQL */ `
    mutation Mutation($input: [LoginPolicyInput]!) {
        updateLoginPolicies(input: $input) {
            emailPattern
            roles
            deny
        }
    }
`

export const getUsermappingConfigurationQuery = /* GraphQL */ `
    query Query {
        userMappingConfiguration {
            allowGuestUsers
        }
    }
`

export const setUserMappingConfigurationMutation = /* GraphQL */ `
    mutation Mutation($input: UserMappingConfigurationInput!) {
        updateUserMappingConfiguration(input: $input) {
            allowGuestUsers
        }
    }
`
