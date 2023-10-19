import { FC, PropsWithChildren, createContext } from 'react'
import { Option, OptionsRepository } from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`OptionsContext::${name} is not implemented`)
}

export interface OptionsContextType {
    getThemeOptions: () => Promise<Option[]>
    updateThemeOptions: (options: Option[]) => Promise<Option[]>
    getPhraseOptions: () => Promise<Option[]>
    updatePhraseOptions: (options: Option[]) => Promise<Option[]>
}

export const OptionsContext = createContext<OptionsContextType>({
    getThemeOptions: notImplemented('getThemeOptions'),
    updateThemeOptions: notImplemented('updateThemeOptions'),
    getPhraseOptions: notImplemented('getPhraseOptions'),
    updatePhraseOptions: notImplemented('updatePhraseOptions'),
})

export const OptionsProvider: FC<
    PropsWithChildren<{ repository: OptionsRepository }>
> = ({ repository, children }) => (
    <OptionsContext.Provider
        value={{
            getThemeOptions: () => repository.getOptions('branding-theme'),
            updateThemeOptions: (options) =>
                repository.updateOptions('branding-theme', options),
            getPhraseOptions: () => repository.getOptions('branding-phrases'),
            updatePhraseOptions: (options) =>
                repository.updateOptions('branding-phrases', options),
        }}
    >
        {children}
    </OptionsContext.Provider>
)
