import {
    AlertProps,
    AppBar,
    AppBarProps,
    Avatar,
    AvatarProps,
    Box,
    ButtonProps,
    Card,
    CardContent,
    CssBaseline,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    MenuItem,
    PaperProps,
    Radio,
    RadioGroup,
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
import { FC, useState } from 'react'
import { ThemeModel } from 'branding/types'
import { ImageBrowseButton } from 'admin/content/components/ImageBrowseButton'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { AdminEditorialPanel } from 'components/AdminEditorialPanel'
import type { Option } from '../../options/types'
import { ColorSelect } from './components/ColorSelect'
import { CreateMenuItems, RegularSelect } from './components/RegularSelect'
import { PreviewButton } from './preview/Button'
import { PreviewAlert } from './preview/Alert'
import { PreviewTextField } from './preview/TextField'

const MAX_FILE_SIZE = 1024 * 1024

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
    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))

    const apply = (name: keyof ThemeModel, value: string) =>
        setModel({
            ...model,
            [name]: value,
        })
    return (
        <>
            <AdminEditorialPanel
                headline="ADMIN_THEME_HEADLINE"
                body="ADMIN_THEME_BODY"
            />
            <AdminActionPanel
                disabled={false}
                onSave={() => onUpdate(createThemeOptions(model))}
                onRestore={() => setModel({ ...defaultThemeModel })}
            />
            <Card>
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
                                        incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea commodo consequat.
                                    </Typography>
                                    <Typography
                                        fontWeight="bold"
                                        color="text.secondary"
                                    >
                                        Sekundär färg
                                    </Typography>
                                    <Typography
                                        color="text.secondary"
                                        gutterBottom
                                    >
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea commodo consequat.
                                    </Typography>
                                    <Typography
                                        fontWeight="bold"
                                        color="text.disabled"
                                    >
                                        Inaktiverad färg
                                    </Typography>
                                    <Typography
                                        color="text.disabled"
                                        gutterBottom
                                    >
                                        Lorem ipsum dolor sit amet, consectetur
                                        adipiscing elit, sed do eiusmod tempor
                                        incididunt ut labore et dolore magna
                                        aliqua. Ut enim ad minim veniam, quis
                                        nostrud exercitation ullamco laboris
                                        nisi ut aliquip ex ea commodo consequat.
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
                                        apply(
                                            'typography.body1.fontsize',
                                            value
                                        )
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
                                        height={96}
                                        border="1px dotted black"
                                        src={model['custom.image.logotype']}
                                        sx={{ p: 2 }}
                                    />
                                    <ImageBrowseButton
                                        maxSize={MAX_FILE_SIZE}
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
                            <Grid item xs={12} sm={6} pr={1}>
                                <RegularSelect
                                    label="Skuggning"
                                    value={model['component.button.elevation']}
                                    onChange={({ target: { value } }) =>
                                        apply(
                                            'component.button.elevation',
                                            value
                                        )
                                    }
                                >
                                    {CreateMenuItems([
                                        ['Nej', 'true'],
                                        ['Ja', 'false'],
                                    ])}
                                </RegularSelect>
                            </Grid>
                            <Grid item xs={12} sm={6} pr={1}>
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
                            <Grid item xs={12} sm={4} pr={1}>
                                <Typography>Kontur</Typography>
                                {ButtonColumn.map((props, key) =>
                                    PreviewButton({
                                        ...props,
                                        key,
                                        variant: 'outlined',
                                    })
                                )}
                            </Grid>
                            <Grid item xs={12} sm={4} pr={1}>
                                <Typography>Fylld</Typography>
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
                        </Grid>
                        <Typography variant="h6" py={2}>
                            Notiser
                        </Typography>
                        <FormControl>
                            <FormLabel id="radio-buttons-alert-variant">
                                Typ
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="radio-buttons-alert-variant"
                                name="radio-buttons-group"
                                value={model['component.alert.variant']}
                                onChange={({ target: { value } }) =>
                                    apply('component.alert.variant', value)
                                }
                            >
                                <FormControlLabel
                                    value="outlined"
                                    control={<Radio />}
                                    label="Kontur"
                                />
                                <FormControlLabel
                                    value="filled"
                                    control={<Radio />}
                                    label="Fylld"
                                />
                                <FormControlLabel
                                    value="standard"
                                    control={<Radio />}
                                    label="Standard"
                                />
                            </RadioGroup>
                        </FormControl>
                        {AlertColumn.map((props, key) =>
                            PreviewAlert({
                                ...props,
                                key,
                                variant: model['component.alert.variant'],
                            })
                        )}
                        <Typography variant="h6" py={2}>
                            Textfält
                        </Typography>
                        <FormControl>
                            <FormLabel id="radio-buttons-textfield-variant">
                                Typ
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="radio-buttons-textfield-variant"
                                name="radio-buttons-group"
                                value={model['component.textfield.variant']}
                                onChange={({ target: { value } }) =>
                                    apply('component.textfield.variant', value)
                                }
                            >
                                <FormControlLabel
                                    value="outlined"
                                    control={<Radio />}
                                    label="Kontur"
                                />
                                <FormControlLabel
                                    value="filled"
                                    control={<Radio />}
                                    label="Fylld"
                                />
                                <FormControlLabel
                                    value="standard"
                                    control={<Radio />}
                                    label="Standard"
                                />
                            </RadioGroup>
                        </FormControl>
                        {TextFieldColumn.map((props, key) =>
                            PreviewTextField({
                                ...{
                                    ...props,
                                    helperText: 'En hjälptext',
                                },
                                key,
                                variant: model['component.textfield.variant'],
                            })
                        )}
                    </ThemeProvider>
                </CardContent>
            </Card>
            <AdminActionPanel
                disabled={false}
                onSave={() => onUpdate(createThemeOptions(model))}
                onRestore={() => setModel({ ...defaultThemeModel })}
            />
        </>
    )
}
