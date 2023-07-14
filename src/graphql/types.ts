export interface FluentGql {
    init: (init?: RequestInit) => FluentGql
    url: (url: string) => FluentGql
    headers: (headers: Record<string, string>) => FluentGql
    query: (query: string) => FluentGql
    variables: (variables: any) => FluentGql
    map: <T>(property: string, fixup?: (value: T) => T) => Promise<T>
}
export interface FluentGqlOptions {
    init?: RequestInit | null | undefined
    url: string
    headers: Record<string, string>
    query: string
    variables: any | null
}
