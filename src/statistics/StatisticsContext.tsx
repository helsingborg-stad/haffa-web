import { FC, PropsWithChildren, createContext } from 'react'
import { StaticsticsProvider } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`StatisticsContext::${method} is not provided`)
}

export const StatisticsContext = createContext<StaticsticsProvider>({
    getServerSideEventLog: notProvided('getServerSideEventLog'),
    getServerSideAdvertEventLog: notProvided(
        'getAdvertServerSideAdvertEventLog'
    ),
})

export const StatisticsProvider: FC<
    PropsWithChildren<{ provider: StaticsticsProvider }>
> = ({ provider, children }) => (
    <StatisticsContext.Provider value={provider}>
        {children}
    </StatisticsContext.Provider>
)
