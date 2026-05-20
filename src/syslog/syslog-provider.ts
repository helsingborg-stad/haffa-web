import { gqlClient } from 'graphql'
import { getSyslogQuery } from './queries'
import type { ISyslogProvider, SyslogEntry } from './types'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createSyslogProvider = (
    token: string,
    f?: typeof fetch
): ISyslogProvider => ({
    getSyslogEntries: () =>
        gql(token, f)
            .query(getSyslogQuery)
            .variables({})
            .map<SyslogEntry[]>('syslog'),
})
