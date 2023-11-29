export interface FluentGql {
    init: (init?: RequestInit) => FluentGql
    fetch: (f?: typeof fetch) => FluentGql
    url: (url: string) => FluentGql
    headers: (headers: Record<string, string>) => FluentGql
    query: (query: string) => FluentGql
    variables: (variables: any) => FluentGql
    map: <T>(property: string, fixup?: (value: T) => T) => Promise<T>
}
export interface FluentGqlOptions {
    fetch?: typeof fetch
    init?: RequestInit | null | undefined
    url: string
    headers: Record<string, string>
    query: string
    variables: any | null
}

// Generic result from Haffa GQL backend
export interface OperationResult {
    success: boolean
}
