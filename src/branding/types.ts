import { PaperProps, TypographyOwnProps } from '@mui/material'

export interface ThemeModel {
    'palette.primary': string
    'palette.secondary': string
    'palette.error': string
    'palette.warning': string
    'palette.info': string
    'palette.success': string
    'component.button.radius': number
    'component.appbar.shadow': number
    'component.paper.variant': PaperProps['variant']
    'component.cardheader.variant': TypographyOwnProps['variant']
}
