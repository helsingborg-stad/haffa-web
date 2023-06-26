export interface FluentGql {
	url: (url: string) => FluentGql 
	headers: (headers: Record<string, string>) => FluentGql
	query: (query: string) => FluentGql
	variables: (variables: any) => FluentGql
	map: <T>(property: string) => Promise<T>
}
export interface FluentGqlOptions {
	url: string
	headers: Record<string, string>,
	query: string,
	variables: any|null
}
