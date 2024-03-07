import { cached, cast } from '../../../utils'
import { getConfig } from '../../../config'
import { HtmlOptions } from '../types'
import { CACHE_TTL_MS } from '../constants'

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
                    cast<{ key: string; value: string }[]>(options).map(
                        ({ key, value }) => [key, value]
                    )
                )
            )
            .catch(() => ({}))
            .then((options) => ({
                title: 'Haffa',
                description: 'Haffa - appen för återbruk',
                url: 'https://haffa.helsingborg.se',
                imageLogo192: '/image-logo192.png',
                imageLogo512: '/image-logo512.png',
                imageFavicon: '/image-favicon.png',
                ...options,
            })),
    CACHE_TTL_MS
)
