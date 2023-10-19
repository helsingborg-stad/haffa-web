import { Button, Grid, Typography } from '@mui/material'
import { FC, useContext, useState } from 'react'
import { Editorial } from 'editorials'
// eslint-disable-next-line import/no-extraneous-dependencies
import { SwatchesPicker } from 'react-color'
import { themeDefaults } from 'branding/theme-factory'
import SaveIcon from '@mui/icons-material/Save'
import { getOption } from 'options'
import { PhraseContext } from 'phrases'
import type { Option } from '../../options/types'

export const EditBrandingForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [[primary, setPrimary], [secondary, setSecondary]] = [
        useState(getOption('primary', options, themeDefaults.primary)),
        useState(getOption('secondary', options, themeDefaults.secondary)),
    ]

    return (
        <>
            <Editorial>
                {phrase('THEME_EDITORIAL', 'Definitioner för tema')}
            </Editorial>
            <Grid container direction="row" sx={{ paddingBottom: 5 }}>
                <Grid key="primaryColor" item xs={12} sm={4} sx={{ p: 1 }}>
                    <Typography>
                        {phrase('THEME_PROP_PRIMARY_COLOR', 'Primär färg')}
                    </Typography>
                    <SwatchesPicker
                        color={primary}
                        onChangeComplete={(color) => setPrimary(color.hex)}
                    />
                </Grid>
                <Grid key="secondaryColor" item xs={12} sm={4} sx={{ p: 1 }}>
                    <Typography>
                        {phrase('THEME_PROP_SECONDARY_COLOR', 'Sekundär färg')}
                    </Typography>
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
                            key: 'primary',
                            value: primary,
                        },
                        {
                            key: 'secondary',
                            value: secondary,
                        },
                    ])
                }
            >
                {phrase('THEME_SAVE', 'Spara')}
            </Button>
            <Button
                onClick={() => {
                    setPrimary(themeDefaults.primary)
                    setSecondary(themeDefaults.secondary)
                }}
            >
                {phrase('THEME_RESTORE', 'Återställ')}
            </Button>
        </>
    )
}
