export const getFieldsQuery = /* GraphQL */ `
    query Query {
        advertFieldConfig {
            name
            label
            visible
            mandatory
            initial
            adornment
        }
    }
`

export const updateFieldsMutation = /* GraphQL */ `
    mutation Mutation($input: [FieldConfigInput!]) {
        updateFieldConfig(input: $input) {
            name
            label
            visible
            mandatory
            initial
            adornment
        }
    }
`
