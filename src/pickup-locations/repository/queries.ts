export const getPickupLocationsQuery = /* GraphQL */ `
    query Query {
        pickupLocations {
            name
            adress
            zipCode
            city
            country
            notifyEmail
            tags
        }
    }
`

export const updatePickupLocationsMutation = /* GraphQL */ `
    mutation Mutation($input: [PickupLocationInput]!) {
        updatePickupLocations(input: $input) {
            name
            adress
            zipCode
            city
            country
            notifyEmail
            tags
        }
    }
`
