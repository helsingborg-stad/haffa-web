import { Option, OptionName, ThemeFactory } from './types'

export const getOption = (
    name: OptionName,
    options: Option[],
    defaultValue: string = ''
): string =>
    options.find((option) => option.name === name)?.value ?? defaultValue

export const themeDefaults = {
    primary: '#33691e',
    secondary: '#dcedc8',
}

export const createCustomTheme: ThemeFactory = (options: Option[]) => ({
    palette: {
        primary: {
            main: getOption('theme.primary', options, themeDefaults.primary),
        },
        secondary: {
            main: getOption(
                'theme.secondary',
                options,
                themeDefaults.secondary
            ),
        },
    },
})
