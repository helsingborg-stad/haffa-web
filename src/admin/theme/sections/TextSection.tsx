import { Box, Card, Grid, Typography } from '@mui/material'
import type { ThemeModel } from 'branding/types'
import { ColorSelect } from '../components/ColorSelect'
import type { ThemeModeSectionProps } from './types'

const LOREM_IPSUM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod ' +
    'tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim ' +
    'veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea ' +
    'commodo consequat.'

export const TextSection = ({ mode, model, patch }: ThemeModeSectionProps) => {
    const items: Array<[string, string, keyof ThemeModel]> = [
        ['Primär textfärg', 'text.primary', `${mode}.palette.text.primary`],
        [
            'Sekundär textfärg',
            'text.secondary',
            `${mode}.palette.text.secondary`,
        ],
        [
            'Inaktiverad textfärg',
            'text.disabled',
            `${mode}.palette.text.disabled`,
        ],
    ]

    return (
        <>
            <Typography
                variant="h6"
                sx={{
                    py: 2,
                }}
            >
                Text och kort
            </Typography>
            <Grid container rowSpacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        sm: 12,
                    }}
                    sx={{
                        pr: 1,
                    }}
                >
                    <Card sx={{ p: 2 }}>
                        {items.map(([label, paletteColorPath]) => (
                            <Box key={paletteColorPath}>
                                <Typography
                                    color={paletteColorPath}
                                    sx={{
                                        fontWeight: 'bold',
                                    }}
                                >
                                    {label}:
                                </Typography>
                                <Typography gutterBottom>
                                    {LOREM_IPSUM}
                                </Typography>
                            </Box>
                        ))}
                    </Card>
                </Grid>

                {items.map(([label, , modelKey]) => (
                    <Grid
                        key={modelKey}
                        size={{
                            xs: 12,
                            sm: 4,
                        }}
                        sx={{
                            pr: 1,
                        }}
                    >
                        <ColorSelect
                            label={label}
                            value={model[modelKey]}
                            onColorChange={(color) =>
                                patch({
                                    [modelKey]: color,
                                })
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
