import { ThemeOptions, createTheme } from '@mui/material/styles'
import { toMap } from 'lib/to-map'
import { BrandingOptions, ThemeFactory, ThemeModel } from './types'
import type { Option } from '../options/types'

const defaultThemeColors: ThemeModel['colors'] = {
    primary: '#33691e',
    secondary: '#dcedc8',
    error: '#d32f2f',
    warning: '#ed6c02',
    info: '#0288d1',
    success: '#2e7d32',
}

const defaultThemeLayout: ThemeModel['layout'] = {
    radius: 0,
    appbarshadow: 0,
    papervariant: 'outlined',
    cardHeader: 'body1',
}

export const defaultThemeModel: ThemeModel = {
    colors: defaultThemeColors,
    layout: defaultThemeLayout,
}

export const createThemeModel = (options: Option[]): ThemeModel => {
    const colors = {
        ...defaultThemeColors,
        ...toMap(
            options.filter((color) =>
                [
                    'primary',
                    'secondary',
                    'info',
                    'warning',
                    'error',
                    'success',
                ].includes(color.key)
            ),
            ({ key }) => key,
            ({ value }) => value
        ),
    }
    const layout = {
        ...defaultThemeLayout,
        ...toMap(
            options.filter((layout) =>
                ['radius', 'papervariant', 'appbarshadow'].includes(layout.key)
            ),
            ({ key }) => key,
            ({ value }) => value
        ),
    }
    return {
        colors,
        layout,
    }
}

export const createThemeOptions = (
    model: ThemeModel
): Option<BrandingOptions>[] => {
    const colors = Object.entries(model.colors).map(([key, value]) => ({
        key,
        value: String(value),
    }))
    const layout = Object.entries(model.layout).map(([key, value]) => ({
        key,
        value: String(value),
    }))
    return [...colors, ...layout] as Option<BrandingOptions>[]
}

export const createCustomTheme: ThemeFactory = (
    model: ThemeModel
): ThemeOptions => {
    const colors = {
        ...defaultThemeColors,
        ...model.colors,
    }
    const layout = {
        ...defaultThemeLayout,
        ...model.layout,
    }
    const defaultTheme = createTheme()

    const theme: ThemeOptions = {
        palette: {
            primary: {
                main: colors.primary,
            },
            secondary: {
                main: colors.secondary,
            },
            error: {
                main: colors.error,
            },
            warning: {
                main: colors.warning,
            },
            info: {
                main: colors.info,
            },
            success: {
                main: colors.success,
            },
        },
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: Number(layout.radius),
                    },
                },
            },
            MuiCardHeader: {
                defaultProps: {
                    titleTypographyProps: {
                        variant: layout.cardHeader,
                        fontWeight: 'bold',
                    },
                },
            },
            MuiPaper: {
                defaultProps: {
                    variant: layout.papervariant,
                },
            },
            MuiAppBar: {
                styleOverrides: {
                    root: {
                        boxShadow: defaultTheme.shadows[layout.appbarshadow],
                    },
                },
            },
        },
    }
    return theme
}
