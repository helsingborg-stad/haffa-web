import type { ThemeModel } from 'branding/types'

export type ThemeSectionProps = {
    model: ThemeModel
    patch: (values: Partial<ThemeModel>) => void
}

export type ThemeModeSectionProps = ThemeSectionProps & {
    mode: 'light' | 'dark'
}
