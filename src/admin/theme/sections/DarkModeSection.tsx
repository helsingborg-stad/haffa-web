import { Grid, Typography } from '@mui/material'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import type { ThemeSectionProps } from './types'

export const DarkModeSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Mörkt läge
        </Typography>
        <Grid container rowSpacing={4}>
            <Grid
                size={{
                    xs: 12,
                    sm: 4,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Tillåt besökare att välja mörkt läge"
                    value={model['darkmode.enabled']}
                    onChange={({ target: { value } }) =>
                        patch({ 'darkmode.enabled': value })
                    }
                >
                    {CreateMenuItems([
                        ['Nej', 'false'],
                        ['Ja', 'true'],
                    ])}
                </RegularSelect>
            </Grid>
        </Grid>
    </>
)
