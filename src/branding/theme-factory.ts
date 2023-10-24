import { getOption } from 'options'
import { ThemeOptions } from '@mui/material'
import type { Option } from '../options/types'
import { BrandingOptions, ThemeFactory } from './types'

export const defaultThemeColors: Option<BrandingOptions>[] = [
    {
        key: 'primary',
        value: '#33691e',
    },
    {
        key: 'secondary',
        value: '#dcedc8',
    },
    {
        key: 'error',
        value: '#d32f2f',
    },
    {
        key: 'warning',
        value: '#ed6c02',
    },
    {
        key: 'info',
        value: '#0288d1',
    },
    {
        key: 'success',
        value: '#2e7d32',
    },
]

export const normalizeThemeColors = (options: Option[]) =>
    defaultThemeColors.map((color) => ({
        key: color.key,
        value: getOption(color.key, options) ?? color.value,
    }))

export const createCustomTheme: ThemeFactory = (
    options: Option<BrandingOptions>[]
): ThemeOptions => {
    const colors = normalizeThemeColors(options)

    const theme: ThemeOptions = {
        palette: {},
    }
    colors.forEach((color) => {
        if (theme.palette) {
            theme.palette[color.key] = {
                main: color.value,
            }
        }
    })
    return theme
}
