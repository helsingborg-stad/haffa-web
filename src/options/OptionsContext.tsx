import { FC, PropsWithChildren, createContext } from 'react'
import { OptionsRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`OptionsContext::${name} is not implemented`)
}
export const OptionsContext = createContext<OptionsRepository>({
    getOptions: notImplemented('getOptions'),
    updateOptions: notImplemented('updateOptions'),
})

export const OptionsProvider: FC<
    PropsWithChildren<{ repository: OptionsRepository }>
> = ({ repository, children }) => (
    <OptionsContext.Provider value={repository}>
        {children}
    </OptionsContext.Provider>
)
