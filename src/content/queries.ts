export const getCompositionQuery = /* GraphQL */ `
    query Query {
        viewComposition {
            rows {
                columns {
                    module {
                        body
                        categories
                        title
                        image
                        tags
                    }
                }
            }
        }
    }
`

export const updateCompositionMutation = /* GraphQL */ `
    mutation Mutation($input: ViewCompositionInput!) {
        updateComposition(input: $input) {
            rows {
                columns {
                    module {
                        body
                        categories
                        image
                        tags
                        title
                    }
                }
            }
        }
    }
`
