import type {
    AlertProps,
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
    'darkmode.enabled': string
    'component.button.radius': string
    'component.button.elevation': string
    'component.appbar.variant': AppBarProps['variant']
    'component.appbar.border': string
    'component.paper.variant': PaperProps['variant']
    'component.cardheader.variant': TypographyOwnProps['variant']
    'component.avatar.variant': AvatarProps['variant']
    'component.textfield.variant': TextFieldProps['variant']
    'component.alert.variant': AlertProps['variant']
    'typography.body1.fontsize': string
    'custom.image.logotype': string
    'shape.radius': string
    'typography.font.family': string
    'cssbaseline.styleoverrides.fontface': string
    // Light theme palette
    'light.palette.primary': string
    'light.palette.secondary': string
    'light.palette.error': string
    'light.palette.warning': string
    'light.palette.info': string
    'light.palette.success': string
    'light.palette.background': string
    'light.palette.paper': string
    'light.palette.text.primary': string
    'light.palette.text.secondary': string
    'light.palette.text.disabled': string
    'light.component.appbar.color': AppBarProps['color']
    'light.component.avatar.bgcolor': string
    'light.component.avatar.color': string
    // dark theme palette
    'dark.palette.primary': string
    'dark.palette.secondary': string
    'dark.palette.error': string
    'dark.palette.warning': string
    'dark.palette.info': string
    'dark.palette.success': string
    'dark.palette.background': string
    'dark.palette.paper': string
    'dark.palette.text.primary': string
    'dark.palette.text.secondary': string
    'dark.palette.text.disabled': string
    'dark.component.appbar.color': AppBarProps['color']
    'dark.component.avatar.bgcolor': string
    'dark.component.avatar.color': string
}
