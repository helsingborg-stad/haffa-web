export const getTagDescriptionsQuery = /* GraphQL */ `
    query Query {
        tagDescriptions {
            tag
            label
            description
        }
    }
`

export const updateTagDescriptionsMutation = /* GraphQL */ `
    mutation Mutation($input: [TagDescriptionInput]!) {
        updateTagDescriptions(input: $input) {
            tag
            label
            description
        }
    }
`
