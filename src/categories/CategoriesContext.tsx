import { FC, PropsWithChildren, createContext } from 'react'
import { CategoriesRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`SettingsContext::${name} is not implemented`)
}

export const CategoriesContext = createContext<CategoriesRepository>({
    getCategories: notImplemented('getCategories'),
    updateCategories: notImplemented('updateCategories'),
})

export const CategoriesProvider: FC<
    PropsWithChildren<{ repository: CategoriesRepository }>
> = ({ repository, children }) => (
    <CategoriesContext.Provider value={repository}>
        {children}
    </CategoriesContext.Provider>
)
