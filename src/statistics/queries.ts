export const getEventsQuery = /* GraphQL */ `
    query Query($from: String, $to: String) {
        events(from: $from, to: $to) {
            event
            advertId
            at
            quantity
            organization
            byOrganization
            category
            co2kg
            valueByUnit
        }
    }
`

export const getAdvertEventsQuery = /* GraphQL */ `
    query Query($advertId: String) {
        advertEvents(advertId: $advertId) {
            event
            advertId
            by
            at
            quantity
            organization
            byOrganization
            category
            co2kg
            valueByUnit
        }
    }
`

export const getSummariesQuery = /* GraphQL */ `
    query Query($yearStart: String) {
        eventsFromStart: eventSummaries {
            totalCo2
            totalCollects
            totalValue
        }
        eventsThisYear: eventSummaries(from: $yearStart) {
            totalCo2
            totalCollects
            totalValue
        }
        advertSummaries {
            totalLendingAdverts
            totalRecycleAdverts
            availableLendingAdverts
            availableRecycleAdverts
            availableAdverts
            totalAdverts
            reservedAdverts
            collectedAdverts
        }
    }
`
