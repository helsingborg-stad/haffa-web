import {
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material'
import { useState } from 'react'
import { FontSelect } from '../components/FontSelect'
import type { ThemeSectionProps } from './types'

export const FontSection = ({ model, patch }: ThemeSectionProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)

    return (
        <>
            <Typography variant="h6" py={2}>
                Typsnitt
            </Typography>
            <Grid item xs={12} sm={2} pr={1}>
                <TextField
                    label="Familj"
                    value={
                        model['cssbaseline.styleoverrides.fontface'] ||
                        model['typography.font.family']
                    }
                    disabled
                    fullWidth
                    variant="outlined"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Button onClick={() => setDialogOpen(true)}>
                                    Ändra
                                </Button>
                            </InputAdornment>
                        ),
                    }}
                />
                <FontSelect
                    open={dialogOpen}
                    initialValue={{
                        fontFamily: model['typography.font.family'],
                        src: model['cssbaseline.styleoverrides.fontface'],
                    }}
                    onClose={() => setDialogOpen(false)}
                    onUpdate={({ fontFamily, src }) => {
                        setDialogOpen(false)
                        patch({
                            'typography.font.family': fontFamily,
                            'cssbaseline.styleoverrides.fontface': src,
                        })
                    }}
                />
            </Grid>
        </>
    )
}
