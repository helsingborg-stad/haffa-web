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
