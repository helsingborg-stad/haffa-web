export const getBrandingOptionsQuery = /* GraphQL */ `
    query Query {
        brandingOptions {
            name
            value
        }
    }
`

export const updateBrandingOptionsMutation = /* GraphQL */ `
    mutation Mutation($input: [OptionInput]!) {
        updateBrandingOptions(input: $input) {
            name
            value
        }
    }
`
