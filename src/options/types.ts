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
