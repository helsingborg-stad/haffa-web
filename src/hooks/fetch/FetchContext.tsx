import { Action, Action1 } from 'lib/types'
import { FC, PropsWithChildren, createContext } from 'react'

const SLOW_TIME_MS = 500

export interface FetchContextType {
    fetch: typeof fetch
    addListener: (handler: Action1<boolean>) => Action
}

const notProvided = (method: string) => () => {
    throw new Error(`FetchContext::${method} is not provided`)
}

export const FetchContext = createContext<FetchContextType>({
    fetch: notProvided('fetch'),
    addListener: notProvided('registerListener'),
})

export const FetchContextProvider: FC<PropsWithChildren> = ({ children }) => (
    <FetchContext.Provider value={createFetch()}>
        {children}
    </FetchContext.Provider>
)

function createFetch(): FetchContextType {
    interface Pending {
        slow: boolean
    }
    let listeners: Action1<boolean>[] = []
    let pending: Pending[] = []
    const notify = () => {
        const slow = pending.some(({ slow }) => slow)
        listeners.forEach((l) => l(slow))
    }

    const register = () => {
        const record: Pending = {
            slow: false,
        }
        pending.push(record)
        const timer = setTimeout(() => {
            record.slow = true
            notify()
        }, SLOW_TIME_MS)
        return {
            unregister: () => {
                clearTimeout(timer)
                pending = pending.filter((r) => r !== record)
                notify()
            },
        }
    }

    const detectSlowFetch: typeof fetch = (...args) => {
        const { unregister } = register()
        return fetch(...args)
            .then((response) => {
                unregister()
                return response
            })
            .catch((err) => {
                unregister()
                throw err
            })
    }

    return {
        fetch: detectSlowFetch,
        addListener: (listener) => {
            listeners.push(listener)
            notify()
            return () => {
                listeners = listeners.filter((l) => l !== listener)
            }
        },
    }
}
