import {
    Card,
    CardContent,
    CssBaseline,
    ThemeProvider,
    Typography,
} from '@mui/material'
import {
    createCustomTheme,
    createThemeModel,
    createThemeOptions,
    getDefaultThemeModel,
} from 'branding/theme-factory'
import type { ThemeModel } from 'branding/types'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import { type FC, useState } from 'react'
import type { Option } from '../../options/types'
import { AppBarSection } from './sections/AppBarSection'
import { AvatarSection } from './sections/AvatarSection'
import { ButtonSection } from './sections/ButtonSection'
import { DarkModeSection } from './sections/DarkModeSection'
import { FontSection } from './sections/FontSection'
import { LogotypeSection } from './sections/LogotypeSection'
import { MediaSection } from './sections/MediaSection'
import { NoticesSection } from './sections/NoticesSection'
import { PaletteSection } from './sections/PaletteSection'
import { TextFieldSection } from './sections/TextFieldSection'
import { TextSection } from './sections/TextSection'
import { TypographySection } from './sections/TypographySection'

const ModeThemeCard: FC<{
    mode: 'light' | 'dark'
    model: ThemeModel
    patch: (values: Partial<ThemeModel>) => void
}> = ({ mode, model, patch }) => (
    <ThemeProvider theme={createCustomTheme(model, mode)}>
        <Card sx={{ mb: 2 }}>
            <CssBaseline />
            <CardContent>
                <Typography variant="h5">
                    {mode === 'dark' ? 'Mörkt' : 'Standard'} läge
                </Typography>
                <PaletteSection mode={mode} model={model} patch={patch} />
                <TextSection mode={mode} model={model} patch={patch} />
                <ButtonSection model={model} patch={patch} />
                <NoticesSection model={model} patch={patch} />
                <TextFieldSection model={model} patch={patch} />
                <AppBarSection mode={mode} model={model} patch={patch} />
                <AvatarSection mode={mode} model={model} patch={patch} />
            </CardContent>
        </Card>
    </ThemeProvider>
)

export const EditThemeForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))

    const patch = (values: Partial<ThemeModel>) =>
        setModel((current) => ({
            ...current,
            ...values,
        }))

    const save = () => onUpdate(createThemeOptions(model))
    const restore = () => setModel(getDefaultThemeModel())

    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_THEME_HEADLINE"
                body="ADMIN_THEME_BODY"
            />
            <AdminActionPanel
                disabled={false}
                onSave={save}
                onRestore={restore}
            />

            <ModeThemeCard mode="light" model={model} patch={patch} />
            <ModeThemeCard mode="dark" model={model} patch={patch} />

            <ThemeProvider theme={createCustomTheme(model, 'light')}>
                <Card>
                    <CssBaseline />
                    <CardContent>
                        <TypographySection model={model} patch={patch} />
                        <MediaSection model={model} patch={patch} />
                        <LogotypeSection model={model} patch={patch} />
                        <FontSection model={model} patch={patch} />
                        <DarkModeSection model={model} patch={patch} />
                    </CardContent>
                </Card>
            </ThemeProvider>

            <AdminActionPanel
                disabled={false}
                onSave={save}
                onRestore={restore}
            />
        </>
    )
}
