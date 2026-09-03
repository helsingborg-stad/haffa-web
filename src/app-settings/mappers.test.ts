import { describe, expect, it } from 'vitest'
import type { Option } from 'options/types'
import { mapOptionsToAppSettings } from './mappers'

describe('mapOptionsToAppSettings', () => {
    it('maps options to app settings regardless of key order', () => {
        const options: Option[] = [
            { key: 'showCo2eInAdvertList', value: 'true' },
            { key: 'warnOnReservingOwnAdvert', value: 'false' },
        ]

        expect(mapOptionsToAppSettings(options)).toEqual({
            warnOnReservingOwnAdvert: false,
            showCo2eInAdvertList: true,
        })
    })

    it('maps options to app settings when keys are in the opposite order', () => {
        const options: Option[] = [
            { key: 'warnOnReservingOwnAdvert', value: 'false' },
            { key: 'showCo2eInAdvertList', value: 'true' },
        ]

        expect(mapOptionsToAppSettings(options)).toEqual({
            warnOnReservingOwnAdvert: false,
            showCo2eInAdvertList: true,
        })
    })

    it('defaults missing keys to true', () => {
        expect(mapOptionsToAppSettings([])).toEqual({
            warnOnReservingOwnAdvert: true,
            showCo2eInAdvertList: true,
        })
    })
})
