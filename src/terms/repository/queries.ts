export const getTermsQuery = /* GraphQL */ `
    query Query {
        terms {
            organization
            unit
            material
            condition
            usage
        }
    }
`

export const updateTermsMutation = /* GraphQL */ `
    mutation Mutation($input: TermsInput!) {
        updateTerms(input: $input) {
            organization
            unit
            material
            condition
            usage
        }
    }
`
