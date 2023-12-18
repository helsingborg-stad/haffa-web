export const getLocationsQuery = /* GraphQL */ `
    query Query {
        locations {
            name
            adress
            zipCode
            city
            country
        }
    }
`

export const updateLocationsMutation = /* GraphQL */ `
    mutation Mutation($input: [AdvertLocationInput]!) {
        updateLocations(input: $input) {
            name
            adress
            zipCode
            city
            country
        }
    }
`
