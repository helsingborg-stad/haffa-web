import { ThemeOptions } from '@mui/material/styles'
import { toMap } from 'lib/to-map'
import { ThemeModel } from './types'
import type { Option } from '../options/types'

export const defaultThemeModel: ThemeModel = {
    'palette.primary': '#33691e',
    'palette.secondary': '#dcedc8',
    'palette.error': '#d32f2f',
    'palette.warning': '#ed6c02',
    'palette.info': '#0288d1',
    'palette.success': '#2e7d32',
    'palette.background': '#fff',
    'palette.paper': '#fff',
    'component.button.radius': '0',
    'component.button.elevation': 'false',
    'component.appbar.variant': 'outlined',
    'component.appbar.border': '0',
    'component.appbar.color': 'default',
    'component.paper.variant': 'outlined',
    'component.typography.variant': 'body2',
    'component.cardheader.variant': 'body1',
    'shape.radius': '4',
}

export const createThemeModel = (options: Option[]): ThemeModel => ({
    ...defaultThemeModel,
    ...toMap(
        options.filter((option) =>
            [
                'palette.primary',
                'palette.secondary',
                'palette.error',
                'palette.warning',
                'palette.info',
                'palette.success',
                'palette.background',
                'palette.paper',
                'component.button.radius',
                'component.button.elevation',
                'component.appbar.variant',
                'component.appbar.border',
                'component.appbar.color',
                'component.paper.variant',
                'component.typography.variant',
                'component.cardheader.variant',
                'shape.radius',
            ].includes(option.key)
        ),
        ({ key }) => key,
        ({ value }) => value
    ),
})

export const createThemeOptions = (model: ThemeModel): Option[] =>
    Object.entries(model).map(([key, value]) => ({
        key,
        value: String(value),
    }))

export const createCustomTheme = (model: ThemeModel): ThemeOptions => {
    const options = {
        ...defaultThemeModel,
        ...model,
    }

    const theme: ThemeOptions = {
        palette: {
            background: {
                default: options['palette.background'],
                paper: options['palette.paper'],
            },
            primary: {
                main: options['palette.primary'],
            },
            secondary: {
                main: options['palette.secondary'],
            },
            error: {
                main: options['palette.error'],
            },
            warning: {
                main: options['palette.warning'],
            },
            info: {
                main: options['palette.info'],
            },
            success: {
                main: options['palette.success'],
            },
        },
        shape: {
            borderRadius: Number(options['shape.radius']),
        },
        components: {
            MuiTypography: {
                defaultProps: {
                    variant: options['component.typography.variant'],
                },
            },
            MuiButton: {
                defaultProps: {
                    disableElevation:
                        options['component.button.elevation'] === 'true',
                },
                styleOverrides: {
                    root: {
                        borderRadius: Number(
                            options['component.button.radius']
                        ),
                    },
                },
            },
            MuiCardHeader: {
                defaultProps: {
                    titleTypographyProps: {
                        variant: options['component.cardheader.variant'],
                        fontWeight: 'bold',
                    },
                },
            },
            MuiPaper: {
                defaultProps: {
                    variant: options['component.paper.variant'],
                },
            },
            MuiAppBar: {
                defaultProps: {
                    elevation:
                        options['component.appbar.variant'] === 'outlined'
                            ? 0
                            : 4,
                    variant: options['component.appbar.variant'],
                    color: options['component.appbar.color'],
                },
                styleOverrides: {
                    root: {
                        border: options['component.appbar.border'],
                    },
                },
            },
        },
    }
    return theme
}
