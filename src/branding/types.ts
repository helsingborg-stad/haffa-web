import { ThemeOptions } from '@mui/material'
import type { Option } from '../options/types'

export type BrandingOptions =
    | 'primary'
    | 'secondary'
    | 'info'
    | 'warning'
    | 'error'
    | 'success'

export type ThemeFactory = (options: Option<BrandingOptions>[]) => ThemeOptions
