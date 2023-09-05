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
