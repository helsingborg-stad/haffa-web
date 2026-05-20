import { createContext, type FC, type PropsWithChildren } from 'react'
import type { ISyslogProvider } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`SyslogContext::${method} is not provided`)
}

export const SyslogContext = createContext<ISyslogProvider>({
    getSyslogEntries: notProvided('getSyslogEntries'),
})

export const SyslogProvider: FC<
    PropsWithChildren<{ provider: ISyslogProvider }>
> = ({ provider, children }) => (
    <SyslogContext.Provider value={provider}>{children}</SyslogContext.Provider>
)
