import { Grid, Typography } from '@mui/material'
import type { ThemeModel } from 'branding/types'
import { ColorSelect } from '../components/ColorSelect'
import type { ThemeModeSectionProps } from './types'

export const PaletteSection = ({
    mode,
    model,
    patch,
}: ThemeModeSectionProps) => {
    const items: Array<[string, keyof ThemeModel]> = [
        ['Primär färg', `${mode}.palette.primary`],
        ['Sekundär färg', `${mode}.palette.secondary`],
        ['Information', `${mode}.palette.info`],
        ['Varning', `${mode}.palette.warning`],
        ['Fel', `${mode}.palette.error`],
        ['Genomfört', `${mode}.palette.success`],
        ['Bakgrund', `${mode}.palette.background`],
        ['Förgrund', `${mode}.palette.paper`],
    ]

    return (
        <>
            <Typography variant="h6" py={2}>
                Palett
            </Typography>
            <Grid container rowSpacing={2}>
                {items.map(([label, name]) => (
                    <Grid item xs={12} sm={3} pr={1} key={name}>
                        <ColorSelect
                            label={label}
                            value={model[name]}
                            disableAlpha
                            onColorChange={(color) =>
                                patch({
                                    [name]: color,
                                })
                            }
                        />
                    </Grid>
                ))}
            </Grid>
        </>
    )
}
