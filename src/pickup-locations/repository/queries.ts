export const getPickupLocationsQuery = /* GraphQL */ `
    query Query {
        pickupLocations {
            name
            adress
            zipCode
            city
            country
            notifyEmail
            trackingName
            tags
        }
    }
`

export const getPickupLocationsByAdvertQuery = /* GraphQL */ `
    query Query($id: ID!) {
        pickupLocationsByAdvert(id: $id) {
            name
            adress
            zipCode
            city
            country
            notifyEmail
            trackingName
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
            trackingName
            tags
        }
    }
`
