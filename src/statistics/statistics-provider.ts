import { gqlClient } from 'graphql'
import { ServerSideLogEvent, StaticsticsProvider } from './types'
import { getAdvertEventsQuery, getEventsQuery } from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createStatisticsProvider = (
    token: string,
    f?: typeof fetch
): StaticsticsProvider => ({
    getServerSideEventLog: (from, to) =>
        gql(token, f)
            .query(getEventsQuery)
            .variables({ from, to })
            .map<ServerSideLogEvent[]>('events'),
    getServerSideAdvertEventLog: (advertId) =>
        gql(token, f)
            .query(getAdvertEventsQuery)
            .variables({ advertId })
            .map<ServerSideLogEvent[]>('advertEvents'),
})
