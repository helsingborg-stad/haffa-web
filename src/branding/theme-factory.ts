import { ThemeOptions, createTheme } from '@mui/material/styles'
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
    'component.button.radius': 0,
    'component.appbar.shadow': 0,
    'component.paper.variant': 'outlined',
    'component.cardheader.variant': 'body1',
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
                'component.button.radius',
                'component.appbar.shadow',
                'component.paper.variant',
                'component.cardheader.variant',
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
    const systemTheme = createTheme()

    const theme: ThemeOptions = {
        palette: {
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
        components: {
            MuiButton: {
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
                styleOverrides: {
                    root: {
                        boxShadow:
                            systemTheme.shadows[
                                options['component.appbar.shadow']
                            ],
                    },
                },
            },
        },
    }
    return theme
}
