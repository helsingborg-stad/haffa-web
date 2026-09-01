import { Grid, MenuItem, type PaperProps, Typography } from '@mui/material'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import { arrayWithNumbers } from '../lib/array-with-numbers'
import type { ThemeSectionProps } from './types'

export const TypographySection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Text och kort
        </Typography>
        <Grid container rowSpacing={4}>
            <Grid
                size={{
                    xs: 12,
                    sm: 2,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Storlek brödtext"
                    value={model['typography.body1.fontsize']}
                    onChange={({ target: { value } }) =>
                        patch({
                            'typography.body1.fontsize': value,
                        })
                    }
                >
                    {CreateMenuItems([
                        ['Liten', '0.875'],
                        ['Stor', '1.0'],
                    ])}
                </RegularSelect>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 2,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Skuggning kort"
                    value={model['component.paper.variant']}
                    onChange={({ target: { value } }) =>
                        patch({
                            'component.paper.variant':
                                value as PaperProps['variant'],
                        })
                    }
                >
                    {CreateMenuItems<PaperProps['variant']>([
                        ['Nej', 'outlined'],
                        ['Ja', 'elevation'],
                    ])}
                </RegularSelect>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 2,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Radie på komponenter"
                    value={model['shape.radius']}
                    onChange={({ target: { value } }) =>
                        patch({ 'shape.radius': value })
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
