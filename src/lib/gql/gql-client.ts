import { FluentGql, FluentGqlOptions } from './types'

/*
const mapNullToNotFoundError = <T>(value: T): T => {
	if ((value === null) || (value === undefined))
}
*/
const gqlFetch = (options: FluentGqlOptions) => fetch(options.url, 
	{
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: options.query,
			variables: options.variables,
		}),
	})
	.then(response => response.json())

const gqlFetchMap = <T>(options: FluentGqlOptions, property: string): Promise<T> => gqlFetch(options).then(({ data }) => data[property] as T)

export const gqlClient = (options: FluentGqlOptions = { url: '/api/v1/haffa/graphql', query: '', variables: null }): FluentGql => ({
	url: url => gqlClient({ ...options, url }),
	query: query => gqlClient({ ...options, query }),
	variables: variables => gqlClient({ ...options, variables }),
	map: <T>(property: string) => gqlFetchMap<T>(options, property),
})
