import { ThemeOptions } from '@mui/material'
import type { Option } from '../options/types'

export type BrandingOptions = 'theme.primary' | 'theme.secondary'
export type ThemeFactory = (options: Option<BrandingOptions>[]) => ThemeOptions
