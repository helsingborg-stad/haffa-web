import { gqlClient } from 'graphql'
import { SyslogEntry, ISyslogProvider } from './types'
import { getSyslogQuery } from './queries'

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
