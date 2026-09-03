import { toMap } from 'lib/to-map'
import type { Option } from 'options/types'
import type { AppSettingsOptionKeys, AppSettingsOptions } from '../options/types'

export const mapOptionsToAppSettings = (
    options: Option[]
): AppSettingsOptions => {
    const { warnOnReservingOwnAdvert, showCo2eInAdvertList } = toMap(
        options,
        ({ key }) => key,
        ({ value }) => value === 'true'
    )
    return {
        warnOnReservingOwnAdvert: warnOnReservingOwnAdvert ?? true,
        showCo2eInAdvertList: showCo2eInAdvertList ?? true,
    }
}

export const mapAppSettingsToOptions = (
    settings: AppSettingsOptions
): Option<AppSettingsOptionKeys>[] =>
    (Object.entries(settings) as [AppSettingsOptionKeys, boolean][]).map(
        ([key, value]) => ({
            key,
            value: String(value),
        })
    )
