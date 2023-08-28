import { FC, PropsWithChildren, createContext } from 'react'
import { SettingsRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`SettingsContext::${name} is not implemented`)
}

export const SettingsContext = createContext<SettingsRepository>({
    getLoginPolicies: notImplemented('getLoginPolicies'),
    updateLoginPolicies: notImplemented('updateLoginPolicies'),
    getCategories: notImplemented('getCategories'),
    updateCategories: notImplemented('updateCategories'),
})

export const SettingsProvider: FC<
    PropsWithChildren<{ repository: SettingsRepository }>
> = ({ repository, children }) => (
    <SettingsContext.Provider value={repository}>
        {children}
    </SettingsContext.Provider>
)
