import { AppBarProps, PaperProps, TypographyOwnProps } from '@mui/material'

declare module '@mui/material/styles' {
    interface Theme {
        logotype?: string
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        logotype?: string
    }
}

export interface ThemeModel {
    'palette.primary': string
    'palette.secondary': string
    'palette.error': string
    'palette.warning': string
    'palette.info': string
    'palette.success': string
    'palette.background': string
    'palette.paper': string
    'component.button.radius': string
    'component.button.elevation': string
    'component.appbar.variant': AppBarProps['variant']
    'component.appbar.border': string
    'component.appbar.color': AppBarProps['color']
    'component.paper.variant': PaperProps['variant']
    'component.typography.variant': TypographyOwnProps['variant']
    'component.cardheader.variant': TypographyOwnProps['variant']
    'custom.image.logotype': string
    'shape.radius': string
}
