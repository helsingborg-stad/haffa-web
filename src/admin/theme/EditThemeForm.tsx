import {
    AlertProps,
    AppBar,
    AppBarProps,
    Avatar,
    AvatarProps,
    Box,
    Button,
    ButtonProps,
    Card,
    CardActions,
    CardContent,
    CssBaseline,
    Grid,
    MenuItem,
    PaperProps,
    SelectProps,
    TextFieldProps,
    ThemeProvider,
    Typography,
} from '@mui/material'
import {
    createCustomTheme,
    createThemeModel,
    createThemeOptions,
    defaultThemeModel,
} from 'branding/theme-factory'
import { FC, useCallback, useContext, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { PhraseContext } from 'phrases'
import { ThemeModel } from 'branding/types'
import { ImageBrowseButton } from 'admin/content/components/ImageBrowseButton'
import type { Option } from '../../options/types'
import { ColorSelect } from './components/ColorSelect'
import { CreateMenuItems, RegularSelect } from './components/RegularSelect'
import { PreviewButton } from './preview/Button'
import { PreviewAlert } from './preview/Alert'
import { PreviewTextField } from './preview/TextField'
import { PreviewSelect } from './preview/Select'

const arrayWithNumbers = (max: number) => Array.from(Array(max).keys())

const AlertColumn: AlertProps[] = [
    { severity: 'success' },
    { severity: 'info' },
    { severity: 'warning' },
    { severity: 'error' },
]

const ButtonColumn: ButtonProps[] = [
    {
        color: 'primary',
    },
    {
        color: 'secondary',
    },
    {
        disabled: true,
    },
]
const TextFieldColumn: Array<TextFieldProps> = [
    {
        color: 'primary',
        helperText: 'Some helpertext',
    },
    {
        color: 'secondary',
    },
    {
        disabled: true,
    },
    {
        error: true,
        helperText: 'Some helpertext',
    },
]
const SelectColumn: Array<SelectProps> = [
    {
        color: 'primary',
    },
    {
        color: 'secondary',
    },
    {
        disabled: true,
    },
    {
        error: true,
    },
]

export const EditThemeForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))

    const apply = (name: keyof ThemeModel, value: string) =>
        setModel({
            ...model,
            [name]: value,
        })

    const renderCardActions = useCallback(
        () => (
            <CardActions>
                <Button
                    onClick={() => {
                        setModel({ ...defaultThemeModel })
                    }}
                    id="THEME_ACTION_RESTORE"
                >
                    {phrase('THEME_ACTION_RESTORE', 'Återställ')}
                </Button>
                <Box flex={1} />
                <Button
                    type="submit"
                    id="THEME_ACTION_SAVE"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => {
                        onUpdate(createThemeOptions(model))
                    }}
                >
                    {phrase('THEME_ACTION_SAVE', 'Spara')}
                </Button>
            </CardActions>
        ),
        [model, phrase, onUpdate, createThemeOptions]
    )

    return (
        <Card>
            {renderCardActions()}
            <CardContent>
                <ThemeProvider theme={createCustomTheme(model)}>
                    <CssBaseline />
                    <Typography variant="h6" py={2}>
                        Palett
                    </Typography>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Primär färg"
                                value={model['palette.primary']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.primary', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Sekundär färg"
                                value={model['palette.secondary']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.secondary', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Information"
                                value={model['palette.info']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.info', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Varning"
                                value={model['palette.warning']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.warning', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Fel"
                                value={model['palette.error']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.error', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Genomfört"
                                value={model['palette.success']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.success', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Bakgrund"
                                value={model['palette.background']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.background', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Förgrund"
                                value={model['palette.paper']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('palette.paper', color)
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Text och kort
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={12}>
                            <Card sx={{ p: 2 }}>
                                <Typography fontWeight="bold">
                                    Primär färg:
                                </Typography>
                                <Typography gutterBottom>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip
                                    ex ea commodo consequat.
                                </Typography>
                                <Typography
                                    fontWeight="bold"
                                    color="text.secondary"
                                >
                                    Sekundär färg
                                </Typography>
                                <Typography color="text.secondary" gutterBottom>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip
                                    ex ea commodo consequat.
                                </Typography>
                                <Typography
                                    fontWeight="bold"
                                    color="text.disabled"
                                >
                                    Inaktiverad färg
                                </Typography>
                                <Typography color="text.disabled" gutterBottom>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit, sed do eiusmod tempor
                                    incididunt ut labore et dolore magna aliqua.
                                    Ut enim ad minim veniam, quis nostrud
                                    exercitation ullamco laboris nisi ut aliquip
                                    ex ea commodo consequat.
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Primär textfärg"
                                value={model['palette.text.primary']}
                                onColorChange={(color) =>
                                    apply('palette.text.primary', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Sekundär textfärg"
                                value={model['palette.text.secondary']}
                                onColorChange={(color) =>
                                    apply('palette.text.secondary', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <ColorSelect
                                label="Inaktiverad textfärg"
                                value={model['palette.text.disabled']}
                                onColorChange={(color) =>
                                    apply('palette.text.disabled', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Storlek brödtext"
                                value={model['typography.body1.fontsize']}
                                onChange={({ target: { value } }) =>
                                    apply('typography.body1.fontsize', value)
                                }
                            >
                                {CreateMenuItems([
                                    ['Liten', '0.875'],
                                    ['Stor', '1.0'],
                                ])}
                            </RegularSelect>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Skuggning kort"
                                value={model['component.paper.variant']}
                                onChange={({ target: { value } }) =>
                                    apply('component.paper.variant', value)
                                }
                            >
                                {CreateMenuItems<PaperProps['variant']>([
                                    ['Nej', 'outlined'],
                                    ['Ja', 'elevation'],
                                ])}
                            </RegularSelect>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Radie på komponenter"
                                value={model['shape.radius']}
                                onChange={({ target: { value } }) =>
                                    apply('shape.radius', value)
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
                    <Typography variant="h6" py={2}>
                        Menybar
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={12}>
                            <AppBar position="static" sx={{ p: 3 }}>
                                <Typography variant="h6">HAFFA</Typography>
                            </AppBar>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Skuggning"
                                value={model['component.appbar.variant']}
                                onChange={({ target: { value } }) =>
                                    apply('component.appbar.variant', value)
                                }
                            >
                                {CreateMenuItems<AppBarProps['variant']>([
                                    ['Nej', 'outlined'],
                                    ['Ja', 'elevation'],
                                ])}
                            </RegularSelect>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Ram"
                                value={model['component.appbar.border']}
                                onChange={({ target: { value } }) =>
                                    apply('component.appbar.border', value)
                                }
                            >
                                {CreateMenuItems([
                                    ['Nej', '0'],
                                    ['Ja', '1'],
                                ])}
                            </RegularSelect>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Färg"
                                value={model['component.appbar.color']}
                                onChange={({ target: { value } }) =>
                                    apply('component.appbar.color', value)
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
                    <Typography variant="h6" py={2}>
                        Avatar
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={12}>
                            <Avatar sx={{ p: 3 }}>
                                <Typography variant="h6">H</Typography>
                            </Avatar>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Variant"
                                value={model['component.avatar.variant']}
                                onChange={({ target: { value } }) =>
                                    apply('component.avatar.variant', value)
                                }
                            >
                                {CreateMenuItems<AvatarProps['variant']>([
                                    ['Cirkulär', 'circular'],
                                    ['Kvadratisk', 'square'],
                                    ['Rundad', 'rounded'],
                                ])}
                            </RegularSelect>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <ColorSelect
                                label="Förgrundsfärg"
                                value={model['component.avatar.color']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('component.avatar.color', color)
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <ColorSelect
                                label="Bakgrundsfärg"
                                value={model['component.avatar.bgcolor']}
                                disableAlpha
                                onColorChange={(color) =>
                                    apply('component.avatar.bgcolor', color)
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Bilder och media
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Bildförhållande"
                                value={model['advert.image.aspectRatio']}
                                onChange={({ target: { value } }) =>
                                    apply('advert.image.aspectRatio', value)
                                }
                            >
                                {CreateMenuItems([
                                    ['1:1'],
                                    ['3:2'],
                                    ['4:3'],
                                    ['5:3'],
                                    ['5:4'],
                                    ['16:9'],
                                    ['2:3'],
                                    ['3:4'],
                                    ['3:5'],
                                    ['4:5'],
                                ])}
                            </RegularSelect>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Logotype
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={2} pr={1}>
                            <Box>
                                <Box
                                    component="img"
                                    border="1px dotted black"
                                    src={model['custom.image.logotype']}
                                    sx={{ p: 2 }}
                                />
                                <ImageBrowseButton
                                    onUpdate={(e) =>
                                        apply('custom.image.logotype', e)
                                    }
                                />
                            </Box>
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Knappar
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Outlined</Typography>
                            {ButtonColumn.map((props, key) =>
                                PreviewButton({
                                    ...props,
                                    key,
                                    variant: 'outlined',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Contained</Typography>
                            {ButtonColumn.map((props, key) =>
                                PreviewButton({
                                    ...props,
                                    key,
                                    variant: 'contained',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Text</Typography>
                            {ButtonColumn.map((props, key) =>
                                PreviewButton({
                                    ...props,
                                    key,
                                    variant: 'text',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Skuggning"
                                value={model['component.button.elevation']}
                                onChange={({ target: { value } }) =>
                                    apply('component.button.elevation', value)
                                }
                            >
                                {CreateMenuItems([
                                    ['Nej', 'true'],
                                    ['Ja', 'false'],
                                ])}
                            </RegularSelect>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <RegularSelect
                                label="Radie"
                                value={model['component.button.radius']}
                                onChange={({ target: { value } }) =>
                                    apply('component.button.radius', value)
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
                    <Typography variant="h6" py={2}>
                        Notiser
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Outlined</Typography>
                            {AlertColumn.map((props, key) =>
                                PreviewAlert({
                                    ...props,
                                    key,
                                    variant: 'outlined',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Filled</Typography>
                            {AlertColumn.map((props, key) =>
                                PreviewAlert({
                                    ...props,
                                    key,
                                    variant: 'filled',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Standard</Typography>
                            {AlertColumn.map((props, key) =>
                                PreviewAlert({
                                    ...props,
                                    key,
                                    variant: 'standard',
                                })
                            )}
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Textfält
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Outlined</Typography>
                            {TextFieldColumn.map((props, key) =>
                                PreviewTextField({
                                    ...props,
                                    key,
                                    variant: 'outlined',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Filled</Typography>
                            {TextFieldColumn.map((props, key) =>
                                PreviewTextField({
                                    ...props,
                                    key,
                                    variant: 'filled',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Standard</Typography>
                            {TextFieldColumn.map((props, key) =>
                                PreviewTextField({
                                    ...props,
                                    key,
                                    variant: 'standard',
                                })
                            )}
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Nedrullningsbar listruta
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Outlined</Typography>
                            {SelectColumn.map((props, key) =>
                                PreviewSelect({
                                    ...props,
                                    key,
                                    variant: 'outlined',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Filled</Typography>
                            {SelectColumn.map((props, key) =>
                                PreviewSelect({
                                    ...props,
                                    key,
                                    variant: 'filled',
                                })
                            )}
                        </Grid>
                        <Grid item xs={12} sm={4} pr={1}>
                            <Typography>Standard</Typography>
                            {SelectColumn.map((props, key) =>
                                PreviewSelect({
                                    ...props,
                                    key,
                                    variant: 'standard',
                                })
                            )}
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </CardContent>
            {renderCardActions()}
        </Card>
    )
}
