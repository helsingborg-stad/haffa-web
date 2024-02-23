import { FC, PropsWithChildren, createContext } from 'react'
import {
    AnalyticsOptionKeys,
    HtmlOptionKeys,
    Option,
    OptionsRepository,
} from './types'

const notImplemented = (name: string) => (): never => {
    throw new Error(`OptionsContext::${name} is not implemented`)
}

export interface OptionsContextType {
    // Theme settings
    getThemeOptions: () => Promise<Option[]>
    updateThemeOptions: (options: Option[]) => Promise<Option[]>

    // Analytics settings
    getAnalyticsOptions: () => Promise<Option<AnalyticsOptionKeys>[]>
    updateAnalyticsOptions: (
        options: Option<AnalyticsOptionKeys>[]
    ) => Promise<Option<AnalyticsOptionKeys>[]>

    // Phrases settings
    getPhraseOptions: () => Promise<Option[]>
    updatePhraseOptions: (options: Option[]) => Promise<Option[]>

    // Html settings
    getHtmlOptions: () => Promise<Option<HtmlOptionKeys>[]>
    updateHtmlOptions: (
        options: Option<HtmlOptionKeys>[]
    ) => Promise<Option<HtmlOptionKeys>[]>
}

export const OptionsContext = createContext<OptionsContextType>({
    getThemeOptions: notImplemented('getThemeOptions'),
    updateThemeOptions: notImplemented('updateThemeOptions'),
    getAnalyticsOptions: notImplemented('getAnalyticsOptions'),
    updateAnalyticsOptions: notImplemented('updateAnalyticsOptions'),
    getPhraseOptions: notImplemented('getPhraseOptions'),
    updatePhraseOptions: notImplemented('updatePhraseOptions'),
    getHtmlOptions: notImplemented('getHtmlOptions'),
    updateHtmlOptions: notImplemented('updateHtmlOptions'),
})

export const OptionsProvider: FC<
    PropsWithChildren<{ repository: OptionsRepository }>
> = ({ repository, children }) => (
    <OptionsContext.Provider
        value={
            {
                getThemeOptions: () => repository.getOptions('branding-theme'),
                updateThemeOptions: (options) =>
                    repository.updateOptions('branding-theme', options),
                getPhraseOptions: () =>
                    repository.getOptions('branding-phrases'),
                updatePhraseOptions: (options) =>
                    repository.updateOptions('branding-phrases', options),
                getAnalyticsOptions: () =>
                    repository.getOptions('analytics-tagmanager'),
                updateAnalyticsOptions: (options) =>
                    repository.updateOptions('analytics-tagmanager', options),
                getHtmlOptions: () => repository.getOptions('branding-html'),
                updateHtmlOptions: (options) =>
                    repository.updateOptions('branding-html', options),
            } as OptionsContextType
        }
    >
        {children}
    </OptionsContext.Provider>
)
