import { Button, Grid, Typography } from '@mui/material'
import { FC, useState } from 'react'
import { Editorial } from 'editorials'
// eslint-disable-next-line import/no-extraneous-dependencies
import { SwatchesPicker } from 'react-color'
import { getOption, themeDefaults } from 'branding/theme-factory'
import SaveIcon from '@mui/icons-material/Save'
import type { Option } from '../../branding/types'

export const EditBrandingForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    //  const { phrase } = useContext(PhraseContext)

    const [[primary, setPrimary], [secondary, setSecondary]] = [
        useState(getOption('theme.primary', options, themeDefaults.primary)),
        useState(
            getOption('theme.secondary', options, themeDefaults.secondary)
        ),
    ]

    return (
        <>
            <Editorial>Definitioner för tema</Editorial>
            <Grid container direction="row" sx={{ paddingBottom: 5 }}>
                <Grid key="primaryColor" item xs={12} sm={4} sx={{ p: 1 }}>
                    <Typography>Primär färg</Typography>
                    <SwatchesPicker
                        color={primary}
                        onChangeComplete={(color) => setPrimary(color.hex)}
                    />
                </Grid>
                <Grid key="secondaryColor" item xs={12} sm={4} sx={{ p: 1 }}>
                    <Typography>Sekundär färg</Typography>
                    <SwatchesPicker
                        color={secondary}
                        onChangeComplete={(color) => setSecondary(color.hex)}
                    />
                </Grid>
            </Grid>
            <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={() =>
                    onUpdate([
                        {
                            name: 'theme.primary',
                            value: primary,
                        },
                        {
                            name: 'theme.secondary',
                            value: secondary,
                        },
                    ])
                }
            >
                Spara
            </Button>
            <Button
                onClick={() => {
                    setPrimary(themeDefaults.primary)
                    setSecondary(themeDefaults.secondary)
                }}
            >
                Återställ
            </Button>
        </>
    )
}
