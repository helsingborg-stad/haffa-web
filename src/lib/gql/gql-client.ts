import { FluentGql, FluentGqlOptions } from './types'

export const gqlClient = (options: FluentGqlOptions = { url: '/api/v1/haffa/graphql', query: '', variables: null }): FluentGql => ({
	url: url => gqlClient({ ...options, url }),
	query: query => gqlClient({ ...options, query }),
	variables: variables => gqlClient({ ...options, variables }),
	map: <T>(property: string) => fetch(options.url, {
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
		.then(({ data }) => data[property] as T),
})
