import { gqlClient } from 'graphql'
import { Summaries, ServerSideLogEvent, StaticsticsProvider } from './types'
import {
    getAdvertEventsQuery,
    getSummariesQuery,
    getEventsQuery,
} from './queries'
import { normalizeSummaries } from './mappers'

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
    getSummaries: () =>
        gql(token, f)
            .query(getSummariesQuery)
            .variables({
                yearStart: new Date(new Date().getFullYear(), 0).toISOString(),
            })
            .map<Summaries>()
            .then((summaries) => normalizeSummaries(summaries)),
})
