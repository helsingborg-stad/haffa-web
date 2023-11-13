import {
    Alert,
    AlertProps,
    AppBar,
    Box,
    Button,
    ButtonProps,
    Card,
    CardActions,
    CardContent,
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
import { BrandingOptions, ThemeModel } from 'branding/types'
import { ColorResult, SketchPicker } from 'react-color'
import { nanoid } from 'nanoid'
import type { Option } from '../../options/types'

const isValid = (color: string) => /^#[A-Fa-f0-9]{2,6}$/.test(color)

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
    const onClose = () =>
        setState({
            ...state,
            isOpen: !state.isOpen,
        })
    const onChange = (color: ColorResult) => {
        setState({
            ...state,
            color: color.hex,
        })
        onColorChange(color.hex)
    }
    return (
        <>
            <TextField
                {...props}
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
                        onChange={onChange}
                        color={props.value as string}
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
    options: Option<BrandingOptions>[]
    onUpdate: (options: Option<BrandingOptions>[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))

    const validateFields = useCallback(() => {
        let result = true
        Object.entries(model.colors).forEach(([_, value]) => {
            if (!isValid(value)) {
                result = false
            }
        })
        if (Number.isNaN(model.layout.radius)) {
            result = false
        }
        return result
    }, [model])

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
                    disabled={!validateFields()}
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
                    <Grid item xs={12} sm={4} p={1}>
                        <ColorTextField
                            key={nanoid()}
                            label={phrase(
                                'THEME_FIELD_PRIMARY_COLOR',
                                'Primär färg'
                            )}
                            value={model.colors.primary}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        primary: color,
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <ColorTextField
                            key={nanoid()}
                            label={phrase(
                                'THEME_FIELD_SECONDARY_COLOR',
                                'Sekundär färg'
                            )}
                            value={model.colors.secondary}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        secondary: color,
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <ColorTextField
                            key={nanoid()}
                            label={phrase(
                                'THEME_FIELD_INFO_COLOR',
                                'Information'
                            )}
                            value={model.colors.info}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        info: color,
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <ColorTextField
                            key={nanoid()}
                            label={phrase(
                                'THEME_FIELD_WARNING_COLOR',
                                'Varning'
                            )}
                            value={model.colors.warning}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        warning: color,
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <ColorTextField
                            key={nanoid()}
                            label={phrase('THEME_FIELD_ERROR_COLOR', 'Fel')}
                            value={model.colors.error}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        error: color,
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} p={1}>
                        <ColorTextField
                            key={nanoid()}
                            label={phrase(
                                'THEME_FIELD_SUCCESS_COLOR',
                                'Genomfört'
                            )}
                            value={model.colors.success}
                            onColorChange={(color) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        success: color,
                                    },
                                })
                            }}
                        />
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
                            value={model.layout.radius}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    layout: {
                                        ...model.layout,
                                        radius: Number(e.target.value),
                                    },
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
                            id="THEME_FIELD_APPBAR_BOXSHADOW"
                            label="Appbar skuggning"
                            value={model.layout.appbarshadow}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    layout: {
                                        ...model.layout,
                                        appbarshadow: Number(e.target.value),
                                    },
                                })
                            }}
                        >
                            {arrayWithNumbers(24).map((i) => (
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
                            value={model.layout.papervariant}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    layout: {
                                        ...model.layout,
                                        papervariant: e.target
                                            .value as PaperProps['variant'],
                                    },
                                })
                            }}
                        >
                            <MenuItem value="outlined">Flat</MenuItem>
                            <MenuItem value="elevation">Förhöjd</MenuItem>
                        </InputSelectField>
                    </Grid>
                </Grid>
            </CardContent>
            {renderCardActions()}

            <CardContent>
                <ThemeProvider theme={createTheme(createCustomTheme(model))}>
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
