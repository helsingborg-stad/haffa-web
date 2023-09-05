export const getLoginPoliciesQuery = /* GraphQL */ `
    query Query {
        loginPolicies {
            emailPattern
            roles
            deny
        }
    }
`

export const getCategoriesQuery = /* GraphQL */ `
    query Query {
        categories {
            id
            parentId
            label
            co2kg
            advertCount
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

export const setCategoriesMutation = /* GraphQL */ `
    mutation Mutation($input: [CategoryInput]!) {
        updateCategories(input: $input) {
            id
            parentId
            label
            co2kg
            advertCount
        }
    }
`
