import { ThemeOptions } from '@mui/material'

export type OptionName = 'theme.primary' | 'theme.secondary'

export interface Option {
    name: OptionName
    value: string
}
export interface BrandingRepository {
    getBrandingOptions: () => Promise<Option[]>
    updateBrandingOptions: (options: Option[]) => Promise<Option[]>
}

export type ThemeFactory = (options: Option[]) => ThemeOptions
