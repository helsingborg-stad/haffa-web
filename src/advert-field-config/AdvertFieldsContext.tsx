import { createContext, type FC, type PropsWithChildren } from 'react'
import type { AdvertFieldRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`AdvertFieldsContext::${method} is not provided`)
}

export const AdvertFieldsContext = createContext<AdvertFieldRepository>({
    getFieldConfig: notProvided('getFieldConfig'),
    updateFieldConfig: notProvided('updateFieldConfig'),
})

export const AdvertFieldProvider: FC<
    PropsWithChildren<{ repository: AdvertFieldRepository }>
> = ({ repository, children }) => (
    <AdvertFieldsContext.Provider value={repository}>
        {children}
    </AdvertFieldsContext.Provider>
)
