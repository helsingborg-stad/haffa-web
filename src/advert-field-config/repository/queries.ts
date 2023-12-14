export const getFieldsQuery = /* GraphQL */ `
    query Query {
        advertFieldConfig {
            name
            visible
            mandatory
        }
    }
`

export const updateFieldsMutation = /* GraphQL */ `
    mutation Mutation($input: [FieldConfigInput!]) {
        updateFieldConfig(input: $input) {
            name
            visible
            mandatory
        }
    }
`
