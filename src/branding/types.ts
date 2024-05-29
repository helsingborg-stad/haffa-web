import {
    AppBarProps,
    AvatarProps,
    PaperProps,
    TextFieldProps,
    TypographyOwnProps,
} from '@mui/material'

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
    'advert.image.aspectRatio': string
    'palette.primary': string
    'palette.secondary': string
    'palette.error': string
    'palette.warning': string
    'palette.info': string
    'palette.success': string
    'palette.background': string
    'palette.paper': string
    'palette.text.primary': string
    'palette.text.secondary': string
    'palette.text.disabled': string
    'component.button.radius': string
    'component.button.elevation': string
    'component.appbar.variant': AppBarProps['variant']
    'component.appbar.border': string
    'component.appbar.color': AppBarProps['color']
    'component.paper.variant': PaperProps['variant']
    'component.cardheader.variant': TypographyOwnProps['variant']
    'component.avatar.bgcolor': string
    'component.avatar.color': string
    'component.avatar.variant': AvatarProps['variant']
    'component.textfield.variant': TextFieldProps['variant']
    'typography.body1.fontsize': string
    'custom.image.logotype': string
    'shape.radius': string
}
