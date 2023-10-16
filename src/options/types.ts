export interface Option<T = string> {
    key: T
    value: string
}
export interface OptionsRepository {
    getOptions: () => Promise<Option[]>
    updateOptions: (options: Option[]) => Promise<Option[]>
}
