export const getOptionsQuery = /* GraphQL */ `
    query Query($name: String!) {
        options(name: $name) {
            key
            value
        }
    }
`

export const updateOptionsMutation = /* GraphQL */ `
    mutation Mutation($name: String!, $input: [OptionInput]!) {
        updateOptions(name: $name, input: $input) {
            key
            value
        }
    }
`
