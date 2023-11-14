import { AppBarProps, PaperProps, TypographyOwnProps } from '@mui/material'

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
    'component.appbar.variant': AppBarProps['variant']
    'component.appbar.border': string
    'component.appbar.color': AppBarProps['color']
    'component.paper.variant': PaperProps['variant']
    'component.cardheader.variant': TypographyOwnProps['variant']
    'shape.radius': string
}
