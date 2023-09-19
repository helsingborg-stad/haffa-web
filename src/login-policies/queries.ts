const rolesProjection = /* GraphQL */ `
    roles {
        canEditOwnAdverts
        canArchiveOwnAdverts
        canRemoveOwnAdverts
        canReserveAdverts
        canCollectAdverts
        canManageOwnAdvertsHistory
        canManageAllAdverts
        canEditSystemCategories
        canEditSystemLoginPolicies
        canRunSystemJobs
    }
`

export const getLoginPoliciesQuery = /* GraphQL */ `
    query Query {
        loginPolicies {
            emailPattern
            ${rolesProjection}
            deny
        }
    }
`

export const setLoginPoliciesMutation = /* GraphQL */ `
    mutation Mutation($input: [LoginPolicyInput]!) {
        updateLoginPolicies(input: $input) {
            emailPattern
            ${rolesProjection}
            deny
        }
    }
`
