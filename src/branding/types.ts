import { ThemeOptions } from '@mui/material'
import type { Option } from '../options/types'

export type BrandingOptions = 'primary' | 'secondary'
export type ThemeFactory = (options: Option<BrandingOptions>[]) => ThemeOptions
