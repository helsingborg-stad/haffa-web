import { getOption } from 'options/mappers'
import { GoogleAdapter } from './adapters/google'
import { MatomoAdapter } from './adapters/matomo'
import type { AnalyticsOptionKeys, Option } from '../options/types'

const injectTagmanager = (options: Option<AnalyticsOptionKeys>[]) => {
    switch (getOption('provider', options)) {
        case 'matomo':
            MatomoAdapter(getOption('config', options) ?? '')
            break
        case 'google':
            GoogleAdapter(getOption('config', options) ?? '')
            break
        default:
            break
    }
}

export const AnalyticsProvider = () => {
    const fetchOptions = (name: string) =>
        fetch(`/api/v1/haffa/options/${name}`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .catch(() => [])

    fetchOptions('analytics-tagmanager').then((options) =>
        injectTagmanager(options)
    )
}
