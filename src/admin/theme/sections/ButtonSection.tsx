import { type ButtonProps, Grid, MenuItem, Typography } from '@mui/material'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import { arrayWithNumbers } from '../lib/array-with-numbers'
import { PreviewButton } from '../preview/Button'
import type { ThemeSectionProps } from './types'

const BUTTON_VARIANTS: [NonNullable<ButtonProps['variant']>, string][] = [
    ['outlined', 'Kontur'],
    ['contained', 'Fylld'],
    ['text', 'Text'],
]

const BUTTON_PREVIEWS: ButtonProps[] = [
    { color: 'primary' },
    { color: 'secondary' },
    { disabled: true },
]

export const ButtonSection = ({ model, patch: apply }: ThemeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Knappar
        </Typography>

        <Grid container rowSpacing={4}>
            {BUTTON_VARIANTS.map(([variant, label], key) => (
                <Grid
                    key={key}
                    size={{
                        xs: 12,
                        sm: 4,
                    }}
                    sx={{
                        pr: 1,
                    }}
                >
                    <Typography>{label}</Typography>
                    {BUTTON_PREVIEWS.map((props, innerkey) => (
                        <PreviewButton
                            key={innerkey}
                            {...props}
                            variant={variant}
                        />
                    ))}
                </Grid>
            ))}

            <Grid
                size={{
                    xs: 12,
                    sm: 6,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Skuggning (Delad)"
                    value={model['component.button.elevation']}
                    onChange={({ target: { value } }) =>
                        apply({
                            'component.button.elevation': value,
                        })
                    }
                >
                    {CreateMenuItems([
                        ['Nej', 'true'],
                        ['Ja', 'false'],
                    ])}
                </RegularSelect>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 6,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Radie (Delad)"
                    value={model['component.button.radius']}
                    onChange={({ target: { value } }) =>
                        apply({
                            'component.button.radius': value,
                        })
                    }
                >
                    {arrayWithNumbers(25).map((i) => (
                        <MenuItem key={i} value={i}>
                            {i}
                        </MenuItem>
                    ))}
                </RegularSelect>
            </Grid>
        </Grid>
    </>
)
