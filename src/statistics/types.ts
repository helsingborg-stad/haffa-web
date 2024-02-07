export interface StaticsticsProvider {
    getServerSideEventLog: (
        from: Date | null,
        to: Date | null
    ) => Promise<ServerSideLogEvent[]>
}

export interface ServerSideLogEvent {
    event: string
    at: string
    by: string
    byOrganization?: string
    quantity?: number
    organization?: string
    category?: string
    co2kg?: number
    valueByUnit?: number
}
