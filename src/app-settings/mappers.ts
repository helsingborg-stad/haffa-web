import { toMap } from 'lib/to-map'
import type { Option } from 'options/types'
import type { AppSettingsOptions } from '../options/types'

export const mapOptionsToAppSettings = (
    options: Option[]
): AppSettingsOptions => {
    const { warnOnReservingOwnAdvert } = toMap(
        options,
        ({ key }) => key,
        ({ value }) => value === 'true'
    )
    return {
        warnOnReservingOwnAdvert: warnOnReservingOwnAdvert ?? true,
    }
}

export const mapAppSettingsToOptions = (
    settings: AppSettingsOptions
): Option[] =>
    Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
    }))
