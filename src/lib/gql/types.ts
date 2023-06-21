export interface FluentGql {
	url: (url: string) => FluentGql 
	query: (query: string) => FluentGql
	variables: (variables: any) => FluentGql
	map: <T>(property: string) => Promise<T>
}
export interface FluentGqlOptions {
	url: string
	query: string,
	variables: any|null
}
