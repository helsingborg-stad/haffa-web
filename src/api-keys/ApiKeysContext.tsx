import { FC, PropsWithChildren, createContext } from 'react'
import { ApiKeysRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`ApiKeysContext::${name} is not implemented`)
}

export const ApiKeysContext = createContext<ApiKeysRepository>({
    getApiKeys: notImplemented('getApiKeys'),
    updateApiKeys: notImplemented('updateApiKeys'),
})

export const ApiKeysProvider: FC<
    PropsWithChildren<{ repository: ApiKeysRepository }>
> = ({ repository, children }) => (
    <ApiKeysContext.Provider value={repository}>
        {children}
    </ApiKeysContext.Provider>
)
