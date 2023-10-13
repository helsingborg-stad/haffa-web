import { FC, PropsWithChildren, createContext } from 'react'
import { BrandingRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`BrandingContext::${name} is not implemented`)
}

export const BrandingContext = createContext<BrandingRepository>({
    getBrandingOptions: notImplemented('getBrandingOptions'),
    updateBrandingOptions: notImplemented('updateBrandingOptions'),
})

export const BrandingProvider: FC<
    PropsWithChildren<{ repository: BrandingRepository }>
> = ({ repository, children }) => (
    <BrandingContext.Provider value={repository}>
        {children}
    </BrandingContext.Provider>
)
