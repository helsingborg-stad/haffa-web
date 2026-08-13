import { Grid, Typography } from '@mui/material'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import type { ThemeSectionProps } from './types'

export const DarkModeSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography variant="h6" py={2}>
            Mörkt läge
        </Typography>
        <Grid container rowSpacing={4}>
            <Grid item xs={12} sm={4} pr={1}>
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
