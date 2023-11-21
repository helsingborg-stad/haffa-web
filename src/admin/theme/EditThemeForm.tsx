import {
    Alert,
    AlertProps,
    AppBar,
    AppBarProps,
    Avatar,
    Box,
    Button,
    ButtonProps,
    Card,
    CardActions,
    CardContent,
    CssBaseline,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    MenuItem,
    PaperProps,
    Select,
    SelectProps,
    TextField,
    TextFieldProps,
    ThemeProvider,
    Typography,
    createTheme,
} from '@mui/material'
import {
    createCustomTheme,
    createThemeModel,
    createThemeOptions,
    defaultThemeModel,
} from 'branding/theme-factory'
import { FC, PropsWithChildren, useCallback, useContext, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import { PhraseContext } from 'phrases'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { ThemeModel } from 'branding/types'
import { SketchPicker } from 'react-color'
import { nanoid } from 'nanoid'
import type { Option } from '../../options/types'

const arrayWithNumbers = (max: number) => Array.from(Array(max).keys())

const PreviewAlert = (props: AlertProps) => (
    <Alert {...props} sx={{ mt: 1 }}>
        {props.severity}
    </Alert>
)
const PreviewButton = (props: ButtonProps) => (
    <Button {...props} fullWidth sx={{ mt: 1 }}>
        {props.disabled ? 'disabled' : props.color}
    </Button>
)
const PreviewTextField = (props: TextFieldProps) => {
    let text = 'N/A'
    if (props.color) {
        text = props.color
    } else if (props.disabled) {
        text = 'disabled'
    } else if (props.error) {
        text = 'error'
    }
    const mt = props.variant === 'standard' ? 3 : 2
    return (
        <TextField {...props} fullWidth sx={{ mt }} label={text} value={text} />
    )
}
const PreviewSelect = (props: SelectProps & { key: number }) => {
    let text = 'N/A'
    if (props.color) {
        text = props.color
    } else if (props.disabled) {
        text = 'disabled'
    } else if (props.error) {
        text = 'error'
    }
    const mt = props.variant === 'standard' ? 3 : 2
    return (
        <FormControl
            key={props.key}
            variant={props.variant}
            fullWidth
            sx={{ mt }}
        >
            <InputLabel id={text}>{text}</InputLabel>
            <Select {...props} label={text} labelId={text}>
                <MenuItem>{text}</MenuItem>
            </Select>
        </FormControl>
    )
}
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

const InputColorButton = (props: SvgIconProps & ButtonProps) => (
    <IconButton onClick={props.onClick}>
        <SvgIcon sx={props.sx}>
            <ellipse cx="12" cy="12" rx="12" ry="12" />
        </SvgIcon>
    </IconButton>
)
const InputColorField = ({
    onColorChange,
    ...props
}: TextFieldProps & { onColorChange: (color: string) => void }) => {
    const [state, setState] = useState<{
        color: string
        isOpen: boolean
    }>({
        color: props.value as string,
        isOpen: false,
    })
    const onClose = () => {
        if (state.isOpen) {
            onColorChange(state.color)
        }
        setState({
            ...state,
            isOpen: !state.isOpen,
        })
    }
    return (
        <>
            <TextField
                {...props}
                key={nanoid()}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <InputColorButton
                                sx={{ color: props.value as string }}
                                onClick={onClose}
                            />
                        </InputAdornment>
                    ),
                }}
            />
            <Dialog open={state.isOpen} onClose={onClose}>
                <DialogTitle>Välj färg</DialogTitle>
                <DialogContent>
                    <SketchPicker
                        onChange={(color) => {
                            setState({
                                ...state,
                                color: color.hex,
                            })
                        }}
                        color={state.color}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
const InputSelectField = (props: SelectProps<string> & PropsWithChildren) => {
    const { children, label, id = nanoid() } = props
    return (
        <FormControl fullWidth>
            <InputLabel id={id}>{label}</InputLabel>
            <Select {...props} key={nanoid()} labelId={id} label={label}>
                {children}
            </Select>
        </FormControl>
    )
}
export const EditThemeForm: FC<{
    options: Option[]
    onUpdate: (options: Option[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))

    const apply = (patch: Partial<ThemeModel>) =>
        setModel({
            ...model,
            ...patch,
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
                <ThemeProvider theme={createTheme(createCustomTheme(model))}>
                    <CssBaseline />
                    <Typography variant="h6" py={2}>
                        Palett
                    </Typography>
                    <Grid container rowSpacing={2}>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Primär färg"
                                value={model['palette.primary']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.primary': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Sekundär färg"
                                value={model['palette.secondary']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.secondary': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Information"
                                value={model['palette.info']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.info': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Varning"
                                value={model['palette.warning']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.warning': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Fel"
                                value={model['palette.error']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.error': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Genomfört"
                                value={model['palette.success']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.success': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Bakgrund"
                                value={model['palette.background']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.background': color,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} pr={1}>
                            <InputColorField
                                label="Bakgrund kort"
                                value={model['palette.paper']}
                                onColorChange={(color) =>
                                    apply({
                                        'palette.paper': color,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Text och kort
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={12}>
                            <Card>
                                <Typography p={2}>
                                    Lorem ipsum dolor sit amet, consectetur
                                    adipiscing elit. Praesent sit amet
                                    pellentesque odio. Morbi non dolor auctor,
                                    placerat tellus vitae, volutpat tellus.
                                    Etiam eget interdum libero, quis tempus
                                    eros. Etiam porttitor vel tellus eu
                                    fermentum. Suspendisse volutpat sit amet leo
                                    non imperdiet. Nulla aliquam sem vitae urna
                                    rhoncus rhoncus. Vivamus pretium eleifend
                                    tincidunt. Phasellus enim risus, facilisis
                                    nec dui eu, sodales porttitor sapien. Donec
                                    nunc quam, rutrum a orci vel, tincidunt
                                    dapibus mi. In vitae aliquet augue. Ut ac
                                    sem vel metus vehicula hendrerit. Cras non
                                    erat vitae nunc aliquam molestie id in mi.
                                    Maecenas dictum neque ante, quis consequat
                                    mi feugiat venenatis. Duis tempor arcu eu
                                    velit pharetra, a porttitor sapien gravida.
                                </Typography>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Skuggning"
                                value={model['component.paper.variant']}
                                onChange={(e) =>
                                    apply({
                                        'component.paper.variant': e.target
                                            .value as PaperProps['variant'],
                                    })
                                }
                            >
                                <MenuItem value="outlined">Nej</MenuItem>
                                <MenuItem value="elevation">Ja</MenuItem>
                            </InputSelectField>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Brödtext"
                                value={model['typography.body1.fontsize']}
                                onChange={(e) =>
                                    apply({
                                        'typography.body1.fontsize':
                                            e.target.value,
                                    })
                                }
                            >
                                <MenuItem key={nanoid()} value="0.875rem">
                                    Liten
                                </MenuItem>
                                <MenuItem key={nanoid()} value="1.0rem">
                                    Stor
                                </MenuItem>
                            </InputSelectField>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Radie på komponenter"
                                value={model['shape.radius']}
                                onChange={(e) =>
                                    apply({
                                        'shape.radius': e.target.value,
                                    })
                                }
                            >
                                {arrayWithNumbers(25).map((i) => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </InputSelectField>
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
                            <InputSelectField
                                label="Skuggning"
                                value={model['component.appbar.variant']}
                                onChange={(e) =>
                                    apply({
                                        'component.appbar.variant': e.target
                                            .value as AppBarProps['variant'],
                                    })
                                }
                            >
                                <MenuItem key={nanoid()} value="outlined">
                                    Nej
                                </MenuItem>
                                <MenuItem key={nanoid()} value="elevation">
                                    Ja
                                </MenuItem>
                            </InputSelectField>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Ram"
                                value={model['component.appbar.border']}
                                onChange={(e) =>
                                    apply({
                                        'component.appbar.border':
                                            e.target.value,
                                    })
                                }
                            >
                                <MenuItem key={nanoid()} value={0}>
                                    Nej
                                </MenuItem>
                                <MenuItem key={nanoid()} value={1}>
                                    Ja
                                </MenuItem>
                            </InputSelectField>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Bakgrund"
                                value={model['component.appbar.color']}
                                onChange={(e) =>
                                    apply({
                                        'component.appbar.color': e.target
                                            .value as AppBarProps['color'],
                                    })
                                }
                            >
                                <MenuItem key={nanoid()} value="default">
                                    Standard
                                </MenuItem>
                                <MenuItem key={nanoid()} value="inherit">
                                    Bakgrund
                                </MenuItem>
                                <MenuItem key={nanoid()} value="transparent">
                                    Genomskinlig
                                </MenuItem>
                                <MenuItem key={nanoid()} value="primary">
                                    Primär
                                </MenuItem>
                                <MenuItem key={nanoid()} value="secondary">
                                    Sekundär
                                </MenuItem>
                            </InputSelectField>
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
                            <InputColorField
                                label="Bakgrundsfärg"
                                value={model['component.avatar.bgcolor']}
                                onColorChange={(color) =>
                                    apply({
                                        'component.avatar.bgcolor': color,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="h6" py={2}>
                        Bilder och media
                    </Typography>
                    <Grid container rowSpacing={4}>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Bildförhållande"
                                value={model['advert.image.aspectRatio']}
                                onChange={(e) =>
                                    apply({
                                        'advert.image.aspectRatio':
                                            e.target.value,
                                    })
                                }
                            >
                                <MenuItem key={nanoid()} value="3:2">
                                    3:2
                                </MenuItem>
                                <MenuItem key={nanoid()} value="4:3">
                                    4:3
                                </MenuItem>
                                <MenuItem key={nanoid()} value="5:3">
                                    5:3
                                </MenuItem>
                                <MenuItem key={nanoid()} value="5:4">
                                    5:4
                                </MenuItem>
                                <MenuItem key={nanoid()} value="16:9">
                                    16:9
                                </MenuItem>
                            </InputSelectField>
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
                            <InputSelectField
                                label="Skuggning"
                                value={model['component.button.elevation']}
                                onChange={(e) =>
                                    apply({
                                        'component.button.elevation':
                                            e.target.value,
                                    })
                                }
                            >
                                <MenuItem key={nanoid()} value="true">
                                    Nej
                                </MenuItem>
                                <MenuItem key={nanoid()} value="false">
                                    Ja
                                </MenuItem>
                            </InputSelectField>
                        </Grid>
                        <Grid item xs={12} sm={2} pr={1}>
                            <InputSelectField
                                label="Radie"
                                value={model['component.button.radius']}
                                onChange={(e) =>
                                    apply({
                                        'component.button.radius':
                                            e.target.value,
                                    })
                                }
                            >
                                {arrayWithNumbers(25).map((i) => (
                                    <MenuItem key={i} value={i}>
                                        {i}
                                    </MenuItem>
                                ))}
                            </InputSelectField>
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
