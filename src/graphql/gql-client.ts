import { FluentGql, FluentGqlOptions } from './types'

/*
const mapNullToNotFoundError = <T>(value: T): T => {
	if ((value === null) || (value === undefined))
}
*/
const gqlFetch = (options: FluentGqlOptions) =>
    (options.fetch || fetch)(options.url, {
        ...options.init,
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        },
        body: JSON.stringify({
            query: options.query,
            variables: options.variables,
        }),
    }).then((response) => response.json())

const gqlFetchMap = <T>(
    options: FluentGqlOptions,
    property: string
): Promise<T> =>
    gqlFetch(options).then(({ data, errors }) => {
        const [error] = [...(errors || [])].map((error) =>
            Object.assign(new Error(error.message), error)
        )
        if (error) {
            throw error
        }
        return data[property] as T
    })

export const gqlClient = (
    options: FluentGqlOptions = {
        init: null,
        url: '/api/v1/haffa/graphql',
        headers: {},
        query: '',
        variables: null,
    }
): FluentGql => ({
    init: (init) => gqlClient({ ...options, init }),
    fetch: (fetch) => gqlClient({ ...options, fetch }),
    url: (url) => gqlClient({ ...options, url }),
    headers: (headers) => gqlClient({ ...options, headers }),
    query: (query) => gqlClient({ ...options, query }),
    variables: (variables) => gqlClient({ ...options, variables }),
    map: <T>(property: string, fixup?: (value: T) => T) =>
        gqlFetchMap<T>(options, property).then((value) =>
            fixup ? fixup(value) : value
        ),
})
