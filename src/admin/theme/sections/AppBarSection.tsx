import { AppBar, type AppBarProps, Grid, Typography } from '@mui/material'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import type { ThemeModeSectionProps } from './types'

export const AppBarSection = ({
    mode,
    model,
    patch,
}: ThemeModeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Menybar
        </Typography>
        <Grid container rowSpacing={4}>
            <Grid
                size={{
                    xs: 12,
                    sm: 12,
                }}
            >
                <AppBar position="static" sx={{ p: 3 }}>
                    <Typography variant="h6">HAFFA</Typography>
                </AppBar>
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
                    label="Skuggning (Delad)"
                    value={model['component.appbar.variant']}
                    onChange={({ target: { value } }) =>
                        patch({
                            'component.appbar.variant':
                                value as AppBarProps['variant'],
                        })
                    }
                >
                    {CreateMenuItems<AppBarProps['variant']>([
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
                    label="Ram (Delad)"
                    value={model['component.appbar.border']}
                    onChange={({ target: { value } }) =>
                        patch({
                            'component.appbar.border': value,
                        })
                    }
                >
                    {CreateMenuItems([
                        ['Nej', '0'],
                        ['Ja', '1'],
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
                    label="Färg"
                    value={model[`${mode}.component.appbar.color`]}
                    onChange={({ target: { value } }) =>
                        patch({
                            [`${mode}.component.appbar.color`]:
                                value as AppBarProps['color'],
                        })
                    }
                >
                    {CreateMenuItems<AppBarProps['color']>([
                        ['Standard', 'default'],
                        ['Förgrund', 'inherit'],
                        ['Genomskinlig', 'transparent'],
                        ['Primär', 'primary'],
                        ['Sekundär', 'secondary'],
                    ])}
                </RegularSelect>
            </Grid>
        </Grid>
    </>
)
