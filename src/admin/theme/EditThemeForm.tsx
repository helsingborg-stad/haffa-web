import {
    Alert,
    AlertProps,
    AppBar,
    AppBarProps,
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
    Paper,
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

const ColorButton = (props: SvgIconProps & ButtonProps) => (
    <IconButton onClick={props.onClick}>
        <SvgIcon sx={props.sx}>
            <ellipse cx="12" cy="12" rx="12" ry="12" />
        </SvgIcon>
    </IconButton>
)
const AlertColumn: AlertProps[] = [
    { severity: 'success' },
    { severity: 'info' },
    { severity: 'warning' },
    { severity: 'error' },
]
const PreviewAlert = (props: AlertProps) => (
    <Alert {...props} sx={{ mt: 1 }}>
        {props.severity}
    </Alert>
)
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
const PreviewButton = (props: ButtonProps) => (
    <Button {...props} fullWidth sx={{ mt: 1 }}>
        {props.disabled ? 'disabled' : props.color}
    </Button>
)
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
const PreviewTextField = (props: TextFieldProps) => {
    let text = 'N/A'
    if (props.color) {
        text = props.color
    } else if (props.disabled) {
        text = 'disabled'
    } else if (props.error) {
        text = 'error'
    }
    let mt = 2
    if (props.variant === 'standard') {
        mt += 1
    }
    return (
        <TextField {...props} fullWidth sx={{ mt }} label={text} value={text} />
    )
}
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
const PreviewSelect = (props: SelectProps & { key: number }) => {
    let text = 'N/A'
    if (props.color) {
        text = props.color
    } else if (props.disabled) {
        text = 'disabled'
    } else if (props.error) {
        text = 'error'
    }
    let mt = 2
    if (props.variant === 'standard') {
        mt += 1
    }
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

const ColorTextField = ({
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
    const { phrase } = useContext(PhraseContext)
    const label = phrase(props.id ?? '', (props.label as string) ?? 'N/A')

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
                label={label}
                disabled
                fullWidth
                variant="outlined"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <ColorButton
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
const InputSelectField = (props: SelectProps & PropsWithChildren) => {
    const { id = nanoid(), children } = props
    const { phrase } = useContext(PhraseContext)
    const label = phrase(id, (props.label as string) ?? 'N/A')

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
            <CardContent>
                <Typography gutterBottom variant="h5">
                    {phrase('THEME_SECTION_COLORS', 'Färger')}
                </Typography>
                <Grid container pb={1}>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_PRIMARY_COLOR"
                            label="Primär färg"
                            value={model['palette.primary']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.primary': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_SECONDARY_COLOR"
                            label="Sekundär färg"
                            value={model['palette.secondary']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.secondary': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_INFO_COLOR"
                            label="Information"
                            value={model['palette.info']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.info': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_WARNING_COLOR"
                            label="Varning"
                            value={model['palette.warning']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.warning': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_ERROR_COLOR"
                            label="Fel"
                            value={model['palette.error']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.error': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_SUCCESS_COLOR"
                            label="Genomfört"
                            value={model['palette.success']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.success': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_BACKGROUND_COLOR"
                            label="Bakgrund"
                            value={model['palette.background']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.background': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <ColorTextField
                            id="THEME_FIELD_PAPER_COLOR"
                            label="Bakgrund kort"
                            value={model['palette.paper']}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    'palette.paper': color,
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} p={1}>
                        <InputSelectField
                            id="THEME_FIELD_APPBAR_COLOR"
                            label="Appbar bakgrund"
                            value={model['component.appbar.color']}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    'component.appbar.color': String(
                                        e.target.value
                                    ) as AppBarProps['color'],
                                })
                            }}
                        >
                            <MenuItem key={nanoid()} value="default">
                                Standard
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
                <Typography gutterBottom variant="h5">
                    {phrase('THEME_SECTION_LAYOUT', 'Utseende')}
                </Typography>
                <Grid container pb={1}>
                    <Grid item xs={12} sm={4} p={1}>
                        <InputSelectField
                            id="THEME_FIELD_RADIUS"
                            label="Radie på knappar"
                            value={model['component.button.radius']}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    'component.button.radius': String(
                                        e.target.value
                                    ),
                                })
                            }}
                        >
                            {arrayWithNumbers(40).map((i) => (
                                <MenuItem key={nanoid()} value={i}>
                                    {i}
                                </MenuItem>
                            ))}
                        </InputSelectField>
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <InputSelectField
                            id="THEME_FIELD_PAPER_VARIANT"
                            label="Stil på omslag"
                            value={model['component.paper.variant']}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    'component.paper.variant': e.target
                                        .value as PaperProps['variant'],
                                })
                            }}
                        >
                            <MenuItem value="outlined">Flat</MenuItem>
                            <MenuItem value="elevation">Förhöjd</MenuItem>
                        </InputSelectField>
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <InputSelectField
                            id="THEME_FIELD_APPBAR_VARIANT"
                            label="Appbar skuggning"
                            value={model['component.appbar.variant']}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    'component.appbar.variant': String(
                                        e.target.value
                                    ) as AppBarProps['variant'],
                                })
                            }}
                        >
                            <MenuItem key={nanoid()} value="outlined">
                                Flat
                            </MenuItem>
                            <MenuItem key={nanoid()} value="elevation">
                                Förhöjd
                            </MenuItem>
                        </InputSelectField>
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <InputSelectField
                            id="THEME_FIELD_APPBAR_BORDER"
                            label="Appbar ram"
                            value={model['component.appbar.border']}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    'component.appbar.border': String(
                                        e.target.value
                                    ),
                                })
                            }}
                        >
                            <MenuItem key={nanoid()} value={0}>
                                Nej
                            </MenuItem>
                            <MenuItem key={nanoid()} value={1}>
                                Ja
                            </MenuItem>
                        </InputSelectField>
                    </Grid>
                </Grid>
            </CardContent>
            {renderCardActions()}

            <CardContent>
                <ThemeProvider theme={createTheme(createCustomTheme(model))}>
                    <CssBaseline />
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6" mt={1}>
                            Appbar
                        </Typography>
                        <Grid container>
                            <Grid item mt={1} pr={1} xs={12} sm={12}>
                                <AppBar position="static" sx={{ p: 3 }}>
                                    <Typography variant="h6">HAFFA</Typography>
                                </AppBar>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" mt={1}>
                            Buttons
                        </Typography>
                        <Grid container>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Outlined</Typography>
                                {ButtonColumn.map((props, key) =>
                                    PreviewButton({
                                        ...props,
                                        key,
                                        variant: 'outlined',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Contained</Typography>
                                {ButtonColumn.map((props, key) =>
                                    PreviewButton({
                                        ...props,
                                        key,
                                        variant: 'contained',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
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
                        <Typography variant="h6" mt={1}>
                            Alerts
                        </Typography>
                        <Grid container>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Outlined</Typography>
                                {AlertColumn.map((props, key) =>
                                    PreviewAlert({
                                        ...props,
                                        key,
                                        variant: 'outlined',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Filled</Typography>
                                {AlertColumn.map((props, key) =>
                                    PreviewAlert({
                                        ...props,
                                        key,
                                        variant: 'filled',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
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
                        <Typography variant="h6" mt={1}>
                            TextFields
                        </Typography>
                        <Grid container>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Outlined</Typography>
                                {TextFieldColumn.map((props, key) =>
                                    PreviewTextField({
                                        ...props,
                                        key,
                                        variant: 'outlined',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Filled</Typography>
                                {TextFieldColumn.map((props, key) =>
                                    PreviewTextField({
                                        ...props,
                                        key,
                                        variant: 'filled',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
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
                        <Typography variant="h6" mt={1}>
                            Selects
                        </Typography>
                        <Grid container mt={1}>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Outlined</Typography>
                                {SelectColumn.map((props, key) =>
                                    PreviewSelect({
                                        ...props,
                                        key,
                                        variant: 'outlined',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
                                <Typography>Filled</Typography>
                                {SelectColumn.map((props, key) =>
                                    PreviewSelect({
                                        ...props,
                                        key,
                                        variant: 'filled',
                                    })
                                )}
                            </Grid>
                            <Grid item mt={1} pr={1} xs={12} sm={4}>
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
                    </Paper>
                </ThemeProvider>
            </CardContent>
            {renderCardActions()}
        </Card>
    )
}
