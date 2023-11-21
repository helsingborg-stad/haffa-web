import { ThemeOptions } from '@mui/material/styles'
import { toMap } from 'lib/to-map'
import { ThemeModel } from './types'
import type { Option } from '../options/types'

export const defaultThemeModel: ThemeModel = {
    'advert.image.aspectRatio': '4:3',
    'palette.primary': '#76232f',
    'palette.secondary': '#ac8889',
    'palette.error': '#d32f2f',
    'palette.warning': '#ed6c02',
    'palette.info': '#ad8b5d',
    'palette.success': '#2e7d32',
    'palette.background': '#fff',
    'palette.paper': '#fff',
    'component.button.radius': '12',
    'component.button.elevation': 'true',
    'component.appbar.variant': 'outlined',
    'component.appbar.border': '0',
    'component.appbar.color': 'default',
    'component.paper.variant': 'outlined',
    'component.avatar.bgcolor': '#f6f3eb',
    'component.avatar.color': '#000000',
    'component.avatar.variant': 'circular',
    'component.cardheader.variant': 'body1',
    'typography.body1.fontsize': '0.875',
    'shape.radius': '14',
    'custom.image.logotype':
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjgiIGhlaWdodD0iMjEiIHZpZXdCb3g9IjAgMCA2OCAyMSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjE0IDEyLjI0NEg0LjY4NFYyMEgwLjYyNFYwLjY3OTk5OEg0LjY4NFY4LjM4SDEzLjE0VjAuNjc5OTk4SDE3LjIyOFYyMEgxMy4xNFYxMi4yNDRaTTI1Ljc2NzYgMTQuNDI4QzI1LjAyMDkgMTQuNDI4IDI0LjQ2MDkgMTQuNTQ5MyAyNC4wODc2IDE0Ljc5MkMyMy43MTQyIDE1LjAxNiAyMy41Mjc2IDE1LjMzMzMgMjMuNTI3NiAxNS43NDRDMjMuNTI3NiAxNi4xMzYgMjMuNzMyOSAxNi40NDQgMjQuMTQzNiAxNi42NjhDMjQuNTU0MiAxNi44OTIgMjUuMTA0OSAxNy4wMDQgMjUuNzk1NiAxNy4wMDRDMjYuNzI4OSAxNy4wMDQgMjcuNDY2MiAxNi44MDggMjguMDA3NiAxNi40MTZDMjguNTQ4OSAxNi4wMjQgMjguODE5NiAxNS40MzYgMjguODE5NiAxNC42NTJWMTQuNDI4SDI1Ljc2NzZaTTE5LjYzNTYgMTUuOTRDMTkuNjM1NiAxNC41NTg3IDIwLjE1ODIgMTMuNDU3MyAyMS4yMDM2IDEyLjYzNkMyMi4yNjc2IDExLjc5NiAyMy43NzAyIDExLjM3NiAyNS43MTE2IDExLjM3NkgyOC44MTk2VjExLjA5NkMyOC44MTk2IDEwLjQwNTMgMjguNTk1NiA5Ljg2NCAyOC4xNDc2IDkuNDcyQzI3LjcxODIgOS4wOCAyNy4xMzk2IDguODg0IDI2LjQxMTYgOC44ODRDMjUuMjE2OSA4Ljg4NCAyNC40NTE2IDkuMzUwNjcgMjQuMTE1NiAxMC4yODRIMjAuMTY3NkMyMC4zOTE2IDguNzkwNjcgMjEuMDkxNiA3LjY1MiAyMi4yNjc2IDYuODY4QzIzLjQ2MjIgNi4wODQgMjQuODUyOSA1LjY5MiAyNi40Mzk2IDUuNjkyQzI4LjQxODIgNS42OTIgMjkuOTM5NiA2LjE5NiAzMS4wMDM2IDcuMjA0QzMyLjA2NzYgOC4yMTIgMzIuNTk5NiA5LjUwOTMzIDMyLjU5OTYgMTEuMDk2VjIwSDI5LjA3MTZWMTguMjkyQzI4LjczNTYgMTguODg5MyAyOC4yMDM2IDE5LjM3NDcgMjcuNDc1NiAxOS43NDhDMjYuNzQ3NiAyMC4xMjEzIDI1Ljg1MTYgMjAuMzA4IDI0Ljc4NzYgMjAuMzA4QzIzLjMzMTYgMjAuMzA4IDIyLjEwODkgMTkuOTUzMyAyMS4xMTk2IDE5LjI0NEMyMC4xMzAyIDE4LjUxNiAxOS42MzU2IDE3LjQxNDcgMTkuNjM1NiAxNS45NFpNMzYuMjE5OSA2LjA4NEMzNi4yMTk5IDQuMzI5MzMgMzYuNjc3MiAyLjk5NDY3IDM3LjU5MTkgMi4wOEMzOC41MDY1IDEuMTQ2NjcgMzkuNzg1MiAwLjY3OTk5OCA0MS40Mjc5IDAuNjc5OTk4SDQzLjQxNTlWNC4xNTJINDEuODQ3OUM0MS4xMzg1IDQuMTUyIDQwLjY2MjUgNC4yODI2NyA0MC40MTk5IDQuNTQ0QzQwLjE3NzIgNC43ODY2NyA0MC4wNTU5IDUuMjA2NjcgNDAuMDU1OSA1LjgwNFY2LjExMkg0My4zNTk5VjkuMzg4SDQwLjA1NTlWMjBIMzYuMjE5OVY5LjM4OEgzNC4wOTE5VjYuMTEySDM2LjIxOTlWNi4wODRaTTQ2LjQ3MzggNi4wODRDNDYuNDczOCA0LjMyOTMzIDQ2LjkzMTEgMi45OTQ2NyA0Ny44NDU4IDIuMDhDNDguNzYwNCAxLjE0NjY3IDUwLjAzOTEgMC42Nzk5OTggNTEuNjgxOCAwLjY3OTk5OEg1My42Njk4VjQuMTUySDUyLjEwMThDNTEuMzkyNCA0LjE1MiA1MC45MTY0IDQuMjgyNjcgNTAuNjczOCA0LjU0NEM1MC40MzExIDQuNzg2NjcgNTAuMzA5OCA1LjIwNjY3IDUwLjMwOTggNS44MDRWNi4xMTJINTMuNjEzOFY5LjM4OEg1MC4zMDk4VjIwSDQ2LjQ3MzhWOS4zODhINDQuMzQ1OFY2LjExMkg0Ni40NzM4VjYuMDg0Wk02MC43Njc2IDE0LjQyOEM2MC4wMjA5IDE0LjQyOCA1OS40NjA5IDE0LjU0OTMgNTkuMDg3NiAxNC43OTJDNTguNzE0MiAxNS4wMTYgNTguNTI3NiAxNS4zMzMzIDU4LjUyNzYgMTUuNzQ0QzU4LjUyNzYgMTYuMTM2IDU4LjczMjkgMTYuNDQ0IDU5LjE0MzYgMTYuNjY4QzU5LjU1NDIgMTYuODkyIDYwLjEwNDkgMTcuMDA0IDYwLjc5NTYgMTcuMDA0QzYxLjcyODkgMTcuMDA0IDYyLjQ2NjIgMTYuODA4IDYzLjAwNzYgMTYuNDE2QzYzLjU0ODkgMTYuMDI0IDYzLjgxOTYgMTUuNDM2IDYzLjgxOTYgMTQuNjUyVjE0LjQyOEg2MC43Njc2Wk01NC42MzU2IDE1Ljk0QzU0LjYzNTYgMTQuNTU4NyA1NS4xNTgyIDEzLjQ1NzMgNTYuMjAzNiAxMi42MzZDNTcuMjY3NiAxMS43OTYgNTguNzcwMiAxMS4zNzYgNjAuNzExNiAxMS4zNzZINjMuODE5NlYxMS4wOTZDNjMuODE5NiAxMC40MDUzIDYzLjU5NTYgOS44NjQgNjMuMTQ3NiA5LjQ3MkM2Mi43MTgyIDkuMDggNjIuMTM5NiA4Ljg4NCA2MS40MTE2IDguODg0QzYwLjIxNjkgOC44ODQgNTkuNDUxNiA5LjM1MDY3IDU5LjExNTYgMTAuMjg0SDU1LjE2NzZDNTUuMzkxNiA4Ljc5MDY3IDU2LjA5MTYgNy42NTIgNTcuMjY3NiA2Ljg2OEM1OC40NjIyIDYuMDg0IDU5Ljg1MjkgNS42OTIgNjEuNDM5NiA1LjY5MkM2My40MTgyIDUuNjkyIDY0LjkzOTYgNi4xOTYgNjYuMDAzNiA3LjIwNEM2Ny4wNjc2IDguMjEyIDY3LjU5OTYgOS41MDkzMyA2Ny41OTk2IDExLjA5NlYyMEg2NC4wNzE2VjE4LjI5MkM2My43MzU2IDE4Ljg4OTMgNjMuMjAzNiAxOS4zNzQ3IDYyLjQ3NTYgMTkuNzQ4QzYxLjc0NzYgMjAuMTIxMyA2MC44NTE2IDIwLjMwOCA1OS43ODc2IDIwLjMwOEM1OC4zMzE2IDIwLjMwOCA1Ny4xMDg5IDE5Ljk1MzMgNTYuMTE5NiAxOS4yNDRDNTUuMTMwMiAxOC41MTYgNTQuNjM1NiAxNy40MTQ3IDU0LjYzNTYgMTUuOTRaIiBmaWxsPSIjREEyOTFDIi8+Cjwvc3ZnPgo=',
}

const ThemModelKeys = new Set<keyof ThemeModel>([
    'advert.image.aspectRatio',
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
    'component.avatar.bgcolor',
    'component.avatar.color',
    'component.avatar.variant',
    'component.cardheader.variant',
    'typography.body1.fontsize',
    'custom.image.logotype',
    'shape.radius',
])

export const createThemeModel = (options: Option[]): ThemeModel => ({
    ...defaultThemeModel,
    ...toMap(
        options.filter(({ key }) => ThemModelKeys.has(key as keyof ThemeModel)),
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

    const fontSize = (value: string) => `${value}rem`

    const theme: ThemeOptions = {
        logotype: options['custom.image.logotype'],
        typography: {
            body1: {
                fontSize: fontSize(options['typography.body1.fontsize']),
            },
        },
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
            MuiLink: {
                defaultProps: {
                    underline: 'hover',
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
            MuiAvatar: {
                defaultProps: {
                    variant: options['component.avatar.variant'],
                },
                styleOverrides: {
                    root: {
                        color: options['component.avatar.color'],
                        backgroundColor: options['component.avatar.bgcolor'],
                    },
                },
            },
        },
    }
    return theme
}
