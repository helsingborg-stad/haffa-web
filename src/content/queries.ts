export const getCompositionQuery = /* GraphQL */ `
    query Query {
        viewComposition {
            rows {
                columns {
                    module {
                        title
                        size
                        body
                        align
                        border
                        background
                        color
                        categories
                        image
                        alt
                        position
                        width
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
                        title
                        size
                        body
                        align
                        border
                        background
                        color
                        categories
                        image
                        alt
                        position
                        width
                        tags
                    }
                }
            }
        }
    }
`
