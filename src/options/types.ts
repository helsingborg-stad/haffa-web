export interface Option<T = string> {
    key: T
    value: string
}
export interface OptionsRepository {
    getOptions: <T>(name: string) => Promise<Option<T>[]>
    updateOptions: <T>(
        name: string,
        options: Option<T>[]
    ) => Promise<Option<T>[]>
}

export interface HtmlOptions {
    title: string
    description: string
    url: string
    imageFavicon: string
    imageLogo192: string
    imageLogo512: string
}

export type HtmlOptionKeys = keyof HtmlOptions
export type AnalyticsOptionKeys = 'provider' | 'config'
