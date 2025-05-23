export interface StaticsticsProvider {
    getServerSideEventLog: (
        from: Date | null,
        to: Date | null
    ) => Promise<ServerSideLogEvent[]>
    getServerSideAdvertEventLog: (
        advertId: string
    ) => Promise<ServerSideLogEvent[]>
    getSummaries: () => Promise<Summaries>
}

export interface ServerSideLogEvent {
    event: string
    advertId?: string
    at: string
    by: string
    byOrganization?: string
    quantity?: number
    organization?: string
    category?: string
    co2kg?: number
    valueByUnit?: number
}

export interface Summaries {
    eventsFromStart: {
        totalCo2: number
        totalValue: number
        totalCollects: number
    }
    eventsThisYear: {
        totalCo2: number
        totalValue: number
        totalCollects: number
    }
    advertSummaries: {
        totalLendingAdverts: number
        totalRecycleAdverts: number
        availableLendingAdverts: number
        availableRecycleAdverts: number
        availableAdverts: number
        totalAdverts: number
        reservedAdverts: number
        collectedAdverts: number
    }
}
