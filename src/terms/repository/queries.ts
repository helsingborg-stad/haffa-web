export const getTermsQuery = /* GraphQL */ `
    query Query {
        terms {
            places
            organization
            unit
            material
            condition
            usage
            tags
            sizes
        }
    }
`

export const updateTermsMutation = /* GraphQL */ `
    mutation Mutation($input: TermsInput!) {
        updateTerms(input: $input) {
            places
            organization
            unit
            material
            condition
            usage
            tags
            sizes
        }
    }
`
