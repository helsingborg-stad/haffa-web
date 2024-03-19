import { cached, cast } from '../../../utils'
import { getConfig } from '../../../config'
import { HtmlOptions } from '../types'
import { CACHE_TTL_MS } from '../constants'

const isNonEmptyString = (v: any): boolean =>
    typeof v === 'string' && v.length > 0

export const getHtmlOptions = cached(
    async (): Promise<HtmlOptions> =>
        fetch(
            getConfig().mapBackendUrl('/api/v1/haffa/options/branding-html'),
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            }
        )
            .then((response) => response.json())
            .then((options) =>
                Object.fromEntries(
                    cast<{ key: string; value: string }[]>(options)
                        .filter(({ key }) => isNonEmptyString(key))
                        .filter(({ value }) => isNonEmptyString(value))
                        .map(({ key, value }) => [key, value])
                )
            )
            .catch(() => ({}))
            .then((options) => ({
                title: 'Haffa',
                description: 'Haffa - appen för återbruk',
                imageUrl: '/image-logo192.png',
                url: 'https://haffa.helsingborg.se',
                imageLogo192: '/image-logo192.png',
                imageLogo512: '/image-logo512.png',
                imageFavicon: '/image-favicon.png',
                ...options,
            }))
            .then((options) => ({
                ...options,
                preview: {
                    title: options.title,
                    description: options.description,
                    imageUrl: '/image-logo192.png',
                },
            })),
    CACHE_TTL_MS
)
