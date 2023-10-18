import { getOption } from 'options'
import type { Option } from '../options/types'
import { BrandingOptions, type ThemeFactory } from './types'

export const themeDefaults = {
    primary: '#33691e',
    secondary: '#dcedc8',
}

export const createCustomTheme: ThemeFactory = (options: Option[]) => ({
    palette: {
        primary: {
            main: getOption<BrandingOptions>(
                'theme.primary',
                options,
                themeDefaults.primary
            ),
        },
        secondary: {
            main: getOption<BrandingOptions>(
                'theme.secondary',
                options,
                themeDefaults.secondary
            ),
        },
    },
})
