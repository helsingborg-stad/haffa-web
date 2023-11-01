import {
    Alert,
    AlertColor,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
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
import { SwatchesPicker } from 'react-color'
import type { Option } from '../../options/types'

const NS = 'THEME'

const ColorIcon = (props: SvgIconProps) => (
    <SvgIcon {...props}>
        <ellipse cx="12" cy="12" rx="12" ry="12" />
    </SvgIcon>
)

const ColorPicker = (
    props: React.PropsWithoutRef<{
        label: string
        color: string
        onChange: (color: string) => void
    }>
) => {
    const { label, color, onChange } = props

    const [isOpen, setIsOpen] = useState<boolean>(false)
    return (
        <>
            <Button
                fullWidth
                variant="outlined"
                startIcon={<ColorIcon sx={{ color }} />}
                onClick={() => {
                    setIsOpen(!isOpen)
                }}
            >
                {label}
            </Button>
            {isOpen && (
                <SwatchesPicker
                    color={color}
                    onChangeComplete={(color) => {
                        setIsOpen(false)
                        onChange(color.hex)
                    }}
                />
            )}
        </>
    )
}

export const EditThemeForm: FC<{
    options: Option<BrandingOptions>[]
    onUpdate: (options: Option<BrandingOptions>[]) => void
}> = ({ options, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)

    const [model, setModel] = useState<ThemeModel>(createThemeModel(options))
    const [canSave, setCanSave] = useState<boolean>(false)

    const renderCardActions = useCallback(
        () => (
            <CardActions>
                <Button
                    onClick={() => {
                        setModel({ ...defaultThemeModel })
                        setCanSave(true)
                    }}
                    id={`${NS}RESTORE`}
                >
                    {phrase(`${NS}_ACTION_RESTORE`, 'Återställ')}
                </Button>
                <Box flex={1} />
                <Button
                    type="submit"
                    disabled={canSave !== true}
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
        [model, phrase, canSave, setCanSave, onUpdate, createThemeOptions]
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
                        <ColorPicker
                            label={phrase(
                                `${NS}_FIELD_PRIMARY_COLOR`,
                                'Primär färg'
                            )}
                            color={model.colors.primary}
                            onChange={(color) => {
                                model.colors.primary = color
                                setModel({ ...model })
                                setCanSave(true)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorPicker
                            label={phrase(
                                `${NS}_FIELD_SECONDARY_COLOR`,
                                'Sekundär färg'
                            )}
                            color={model.colors.secondary}
                            onChange={(color) => {
                                model.colors.secondary = color
                                setModel({ ...model })
                                setCanSave(true)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorPicker
                            label={phrase(
                                `${NS}_FIELD_INFO_COLOR`,
                                'Information'
                            )}
                            color={model.colors.info}
                            onChange={(color) => {
                                model.colors.info = color
                                setModel({ ...model })
                                setCanSave(true)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorPicker
                            label={phrase(
                                `${NS}_FIELD_WARNING_COLOR`,
                                'Varning'
                            )}
                            color={model.colors.warning}
                            onChange={(color) => {
                                model.colors.warning = color
                                setModel({ ...model })
                                setCanSave(true)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorPicker
                            label={phrase(`${NS}_FIELD_ERROR_COLOR`, 'Fel')}
                            color={model.colors.error}
                            onChange={(color) => {
                                model.colors.error = color
                                setModel({ ...model })
                                setCanSave(true)
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ p: 1 }}>
                        <ColorPicker
                            label={phrase(
                                `${NS}_FIELD_SUCCESS_COLOR`,
                                'Genomfört'
                            )}
                            color={model.colors.success}
                            onChange={(color) => {
                                model.colors.success = color
                                setModel({ ...model })
                                setCanSave(true)
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
                            label="Radius på knappar"
                            type="number"
                            value={model.layout.radius}
                            onChange={(value) => {
                                const num = Number(value.target.value)
                                model.layout.radius = Number.isNaN(num)
                                    ? 0
                                    : num
                                setModel({ ...model })
                                setCanSave(true)
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            {renderCardActions()}

            <CardContent>
                <ThemeProvider theme={createTheme(createCustomTheme(model))}>
                    <Paper elevation={4} sx={{ p: 2 }}>
                        <Typography variant="h6" mb={2} mt={1}>
                            Buttons
                        </Typography>
                        <Grid container xs={12} mt={1}>
                            <Grid item pr={1} xs={4}>
                                <Typography>Outlined</Typography>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    color="primary"
                                >
                                    Primary
                                </Button>
                                <Button
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="outlined"
                                    color="secondary"
                                >
                                    Secondary
                                </Button>
                                <Button
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="outlined"
                                    disabled
                                >
                                    Disabled
                                </Button>
                            </Grid>
                            <Grid item pr={1} xs={4}>
                                <Typography>Contained</Typography>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Primary
                                </Button>
                                <Button
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="contained"
                                    color="secondary"
                                >
                                    Secondary
                                </Button>
                                <Button
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="contained"
                                    disabled
                                >
                                    Disabled
                                </Button>
                            </Grid>
                            <Grid item pr={1} xs={4}>
                                <Typography>Text</Typography>
                                <Button
                                    fullWidth
                                    variant="text"
                                    color="primary"
                                >
                                    Primary
                                </Button>
                                <Button
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="text"
                                    color="secondary"
                                >
                                    Secondary
                                </Button>
                                <Button
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="text"
                                    disabled
                                >
                                    Disabled
                                </Button>
                            </Grid>
                        </Grid>
                        <Typography variant="h6" mb={2} mt={1}>
                            Alerts
                        </Typography>
                        <Grid container xs={12} mt={1}>
                            <Grid item pr={1} xs={4}>
                                <Typography>Outlined</Typography>
                                {['success', 'info', 'warning', 'error'].map(
                                    (s) => (
                                        <Alert
                                            severity={s as AlertColor}
                                            variant="outlined"
                                            sx={{ mb: 1 }}
                                        >
                                            {s}
                                        </Alert>
                                    )
                                )}
                            </Grid>
                            <Grid item pr={1} xs={4}>
                                <Typography>Filled</Typography>
                                {['success', 'info', 'warning', 'error'].map(
                                    (s) => (
                                        <Alert
                                            severity={s as AlertColor}
                                            variant="filled"
                                            sx={{ mb: 1 }}
                                        >
                                            {s}
                                        </Alert>
                                    )
                                )}
                            </Grid>
                            <Grid item pr={1} xs={4}>
                                <Typography>Standard</Typography>
                                {['success', 'info', 'warning', 'error'].map(
                                    (s) => (
                                        <Alert
                                            severity={s as AlertColor}
                                            variant="standard"
                                            sx={{ mb: 1 }}
                                        >
                                            {s}
                                        </Alert>
                                    )
                                )}
                            </Grid>
                        </Grid>
                        <Typography variant="h6" mb={2} mt={1}>
                            TextFields
                        </Typography>
                        <Grid container xs={12} mt={1}>
                            <Grid item xs={4} pr={1}>
                                <Typography mb={2}>Outlined</Typography>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    label="Primary"
                                    value="Primary"
                                    color="primary"
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="outlined"
                                    label="Secondary"
                                    value="Secondary"
                                    color="secondary"
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="outlined"
                                    label="Disabled"
                                    value="Disabled"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={4} pr={1}>
                                <Typography mb={2}>Filled</Typography>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    label="Primary"
                                    value="Primary"
                                    color="primary"
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="filled"
                                    label="Secondary"
                                    value="Secondary"
                                    color="secondary"
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    variant="filled"
                                    label="Disabled"
                                    value="Disabled"
                                    disabled
                                />
                            </Grid>
                            <Grid item xs={4} pr={1}>
                                <Typography mb={2}>Standard</Typography>
                                <TextField
                                    fullWidth
                                    sx={{ mt: 1 }}
                                    variant="standard"
                                    label="Primary"
                                    value="Primary"
                                    color="primary"
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    variant="standard"
                                    label="Secondary"
                                    value="Secondary"
                                    color="secondary"
                                />
                                <TextField
                                    fullWidth
                                    sx={{ mt: 3 }}
                                    variant="standard"
                                    label="Disabled"
                                    value="Disabled"
                                    disabled
                                />
                            </Grid>
                        </Grid>
                        <Typography variant="h6" mb={2} mt={1}>
                            Selects
                        </Typography>
                        <Grid container xs={12} mt={1}>
                            <Grid item xs={4} pr={1}>
                                <Typography mb={2}>Outlined</Typography>
                                <FormControl variant="outlined" fullWidth>
                                    <InputLabel id="Primary">
                                        Primary
                                    </InputLabel>
                                    <Select
                                        label="Primary"
                                        labelId="Primary"
                                        color="primary"
                                    >
                                        <MenuItem>Primary</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 2 }}
                                    variant="outlined"
                                    fullWidth
                                >
                                    <InputLabel id="Secondary">
                                        Secondary
                                    </InputLabel>
                                    <Select
                                        label="Secondary"
                                        labelId="Secondary"
                                        color="secondary"
                                    >
                                        <MenuItem>Secondary</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 2 }}
                                    variant="outlined"
                                    fullWidth
                                >
                                    <InputLabel id="Disabled">
                                        Disabled
                                    </InputLabel>
                                    <Select
                                        label="Disabled"
                                        labelId="Disabled"
                                        defaultValue="Disabled"
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} pr={1}>
                                <Typography mb={2}>Filled</Typography>
                                <FormControl variant="filled" fullWidth>
                                    <InputLabel id="Primary">
                                        Primary
                                    </InputLabel>
                                    <Select
                                        label="Primary"
                                        labelId="Primary"
                                        color="primary"
                                    >
                                        <MenuItem>Primary</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 2 }}
                                    variant="filled"
                                    fullWidth
                                >
                                    <InputLabel id="Secondary">
                                        Secondary
                                    </InputLabel>
                                    <Select
                                        label="Secondary"
                                        labelId="Secondary"
                                        color="secondary"
                                    >
                                        <MenuItem>Secondary</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 2 }}
                                    variant="filled"
                                    fullWidth
                                >
                                    <InputLabel id="Disabled">
                                        Disabled
                                    </InputLabel>
                                    <Select
                                        label="Disabled"
                                        labelId="Disabled"
                                        defaultValue="Disabled"
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} pr={1}>
                                <Typography mb={2}>Standard</Typography>
                                <FormControl
                                    sx={{ mt: 1 }}
                                    variant="standard"
                                    fullWidth
                                >
                                    <InputLabel id="Primary">
                                        Primary
                                    </InputLabel>
                                    <Select
                                        label="Primary"
                                        labelId="Primary"
                                        color="primary"
                                    >
                                        <MenuItem>Primary</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 3 }}
                                    variant="standard"
                                    fullWidth
                                >
                                    <InputLabel id="Secondary">
                                        Secondary
                                    </InputLabel>
                                    <Select
                                        label="Secondary"
                                        labelId="Secondary"
                                        color="secondary"
                                    >
                                        <MenuItem>Secondary</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl
                                    sx={{ mt: 3 }}
                                    variant="standard"
                                    fullWidth
                                >
                                    <InputLabel id="Disabled">
                                        Disabled
                                    </InputLabel>
                                    <Select
                                        label="Disabled"
                                        labelId="Disabled"
                                        defaultValue="Disabled"
                                        disabled
                                    />
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Paper>
                </ThemeProvider>
            </CardContent>
            {renderCardActions()}
        </Card>
    )
}
