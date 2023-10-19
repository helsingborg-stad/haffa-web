export interface Option<T = string> {
    key: T
    value: string
}
export interface OptionsRepository {
    getOptions: (name: string) => Promise<Option[]>
    updateOptions: (name: string, options: Option[]) => Promise<Option[]>
}
