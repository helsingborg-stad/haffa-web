import {
    Alert,
    AlertProps,
    Box,
    Button,
    ButtonProps,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
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
import { FC, useCallback, useContext, useState } from 'react'
import { Editorial } from 'editorials'
import SaveIcon from '@mui/icons-material/Save'
import { PhraseContext } from 'phrases'
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { BrandingOptions, ThemeModel } from 'branding/types'
import type { Option } from '../../options/types'

const NS = 'THEME'

const isValid = (color: string) => /^#[A-Fa-f0-9]{2,6}$/.test(color)

const ColorIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <ellipse cx="12" cy="12" rx="12" ry="12" />
    </SvgIcon>
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
const TextFieldColumn: Array<SelectProps & TextFieldProps> = [
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
const PreviewSelect = (props: SelectProps) => {
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
        <FormControl variant={props.variant} fullWidth sx={{ mt }}>
            <InputLabel id={text}>{text}</InputLabel>
            <Select {...props} label={text} labelId={text}>
                <MenuItem>{text}</MenuItem>
            </Select>
        </FormControl>
    )
}

const ColorTextField = (props: TextFieldProps) => (
    <TextField
        {...props}
        required
        fullWidth
        error={!isValid(props.value as string)}
        variant="outlined"
        InputProps={{
            startAdornment: (
                <InputAdornment position="start">
                    <ColorIcon sx={{ color: props.value as string }} />
                </InputAdornment>
            ),
        }}
    />
)

export const EditThemeForm: FC<{
    options: Option<BrandingOptions>[]
    onUpdate: (options: Option<BrandingOptions>[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))

    const validateFields = useCallback(() => {
        let result = true
        Object.entries(model.colors).forEach(([_, value]) => {
            console.log(value)
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
                    id={`${NS}RESTORE`}
                >
                    {phrase(`${NS}_ACTION_RESTORE`, 'Återställ')}
                </Button>
                <Box flex={1} />
                <Button
                    type="submit"
                    disabled={!validateFields()}
                    id={`${NS}_ACTION_SAVE`}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => {
                        onUpdate(createThemeOptions(model))
                    }}
                >
                    {phrase(`${NS}_ACTION_SAVE`, 'Spara')}
                </Button>
            </CardActions>
        ),
        [model, phrase, onUpdate, createThemeOptions]
    )

    return (
        <Card>
            <Editorial>
                {phrase(`${NS}_SECTION_EDITORIAL`, 'Definitioner för tema')}
            </Editorial>
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {phrase(`${NS}_SECTION_COLORS`, 'Färger')}
                </Typography>
                <Grid container direction="row" sx={{ pb: 5 }}>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorTextField
                            key={`${NS}_FIELD_PRIMARY_COLOR`}
                            label={phrase(
                                `${NS}_FIELD_PRIMARY_COLOR`,
                                'Primär färg'
                            )}
                            value={model.colors.primary}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        primary: e.target.value.trim(),
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorTextField
                            key={`${NS}_FIELD_SECONDARY_COLOR`}
                            label={phrase(
                                `${NS}_FIELD_SECONDARY_COLOR`,
                                'Sekundär färg'
                            )}
                            value={model.colors.secondary}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        secondary: e.target.value.trim(),
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorTextField
                            key={`${NS}_FIELD_INFO_COLOR`}
                            label={phrase(
                                `${NS}_FIELD_INFO_COLOR`,
                                'Information'
                            )}
                            value={model.colors.info}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        info: e.target.value.trim(),
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorTextField
                            key={`${NS}_FIELD_WARNING_COLOR`}
                            label={phrase(
                                `${NS}_FIELD_WARNING_COLOR`,
                                'Varning'
                            )}
                            value={model.colors.warning}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        warning: e.target.value.trim(),
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorTextField
                            key={`${NS}_FIELD_ERROR_COLOR`}
                            label={phrase(`${NS}_FIELD_ERROR_COLOR`, 'Fel')}
                            value={model.colors.error}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        error: e.target.value.trim(),
                                    },
                                })
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorTextField
                            key={`${NS}_FIELD_SUCCESS_COLOR`}
                            label={phrase(
                                `${NS}_FIELD_SUCCESS_COLOR`,
                                'Genomfört'
                            )}
                            value={model.colors.success}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    colors: {
                                        ...model.colors,
                                        success: e.target.value.trim(),
                                    },
                                })
                            }}
                        />
                    </Grid>
                </Grid>
                <Typography gutterBottom variant="h5" component="div">
                    {phrase(`${NS}_SECTION_LOOKS`, 'Utseende')}
                </Typography>
                <Grid container direction="row" sx={{ paddingBottom: 5 }}>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <TextField
                            key={`${NS}_FIELD_RADIUS`}
                            label="Radius på knappar"
                            type="number"
                            value={model.layout.radius}
                            onChange={(e) => {
                                setModel({
                                    ...model,
                                    layout: {
                                        ...model.layout,
                                        radius: Number(e.target.value.trim()),
                                    },
                                })
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            {renderCardActions()}

            <CardContent>
                {validateFields() && (
                    <ThemeProvider
                        theme={createTheme(createCustomTheme(model))}
                    >
                        <Paper elevation={4} sx={{ p: 2 }}>
                            <Typography variant="h6" mb={2} mt={1}>
                                Buttons
                            </Typography>
                            <Grid container xs={12} mt={1}>
                                <Grid item pr={1} xs={4}>
                                    <Typography>Outlined</Typography>
                                    {ButtonColumn.map((props) =>
                                        PreviewButton({
                                            ...props,
                                            variant: 'outlined',
                                        })
                                    )}
                                </Grid>
                                <Grid item pr={1} xs={4}>
                                    <Typography>Contained</Typography>
                                    {ButtonColumn.map((props) =>
                                        PreviewButton({
                                            ...props,
                                            variant: 'contained',
                                        })
                                    )}
                                </Grid>
                                <Grid item pr={1} xs={4}>
                                    <Typography>Text</Typography>
                                    {ButtonColumn.map((props) =>
                                        PreviewButton({
                                            ...props,
                                            variant: 'text',
                                        })
                                    )}
                                </Grid>
                            </Grid>
                            <Typography variant="h6" mb={2} mt={1}>
                                Alerts
                            </Typography>
                            <Grid container xs={12} mt={1}>
                                <Grid item pr={1} xs={4}>
                                    <Typography>Outlined</Typography>
                                    {AlertColumn.map((props) =>
                                        PreviewAlert({
                                            ...props,
                                            variant: 'outlined',
                                        })
                                    )}
                                </Grid>
                                <Grid item pr={1} xs={4}>
                                    <Typography>Filled</Typography>
                                    {AlertColumn.map((props) =>
                                        PreviewAlert({
                                            ...props,
                                            variant: 'filled',
                                        })
                                    )}
                                </Grid>
                                <Grid item pr={1} xs={4}>
                                    <Typography>Standard</Typography>
                                    {AlertColumn.map((props) =>
                                        PreviewAlert({
                                            ...props,
                                            variant: 'standard',
                                        })
                                    )}
                                </Grid>
                            </Grid>
                            <Typography variant="h6" mb={2} mt={1}>
                                TextFields
                            </Typography>
                            <Grid container xs={12} mt={1}>
                                <Grid item xs={4} pr={1}>
                                    <Typography mb={2}>Outlined</Typography>
                                    {TextFieldColumn.map((props) =>
                                        PreviewTextField({
                                            ...props,
                                            variant: 'outlined',
                                        })
                                    )}
                                </Grid>
                                <Grid item xs={4} pr={1}>
                                    <Typography mb={2}>Filled</Typography>
                                    {TextFieldColumn.map((props) =>
                                        PreviewTextField({
                                            ...props,
                                            variant: 'filled',
                                        })
                                    )}
                                </Grid>
                                <Grid item xs={4} pr={1}>
                                    <Typography mb={2}>Standard</Typography>
                                    {TextFieldColumn.map((props) =>
                                        PreviewTextField({
                                            ...props,
                                            variant: 'standard',
                                        })
                                    )}
                                </Grid>
                            </Grid>
                            <Typography variant="h6" mb={2} mt={1}>
                                Selects
                            </Typography>
                            <Grid container xs={12} mt={1}>
                                <Grid item xs={4} pr={1}>
                                    <Typography mb={1}>Outlined</Typography>
                                    {TextFieldColumn.map((props) =>
                                        PreviewSelect({
                                            ...props,
                                            variant: 'outlined',
                                        })
                                    )}
                                </Grid>
                                <Grid item xs={4} pr={1}>
                                    <Typography mb={1}>Filled</Typography>
                                    {TextFieldColumn.map((props) =>
                                        PreviewSelect({
                                            ...props,
                                            variant: 'filled',
                                        })
                                    )}
                                </Grid>
                                <Grid item xs={4} pr={1}>
                                    <Typography mb={1}>Standard</Typography>
                                    {TextFieldColumn.map((props) =>
                                        PreviewSelect({
                                            ...props,
                                            variant: 'standard',
                                        })
                                    )}
                                </Grid>
                            </Grid>
                        </Paper>
                    </ThemeProvider>
                )}
            </CardContent>
            {renderCardActions()}
        </Card>
    )
}
