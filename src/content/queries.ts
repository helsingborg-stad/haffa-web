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
                        imageRef
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
                        imageRef
                        tags
                        title
                    }
                }
            }
        }
    }
`
