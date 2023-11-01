import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
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
                    <Paper elevation={4}>
                        <Container sx={{ pb: 2 }}>
                            <Button fullWidth sx={{ mt: 3 }} variant="outlined">
                                Outlined
                            </Button>
                            <Button
                                fullWidth
                                sx={{ mt: 3 }}
                                variant="contained"
                            >
                                Contained
                            </Button>
                            <Button fullWidth sx={{ mt: 3 }} variant="text">
                                Text
                            </Button>
                        </Container>
                        <Container sx={{ pb: 2 }}>
                            <TextField
                                fullWidth
                                sx={{ mt: 3 }}
                                variant="filled"
                                label="Filled"
                                value="Filled"
                            />
                            <TextField
                                fullWidth
                                sx={{ mt: 3 }}
                                variant="outlined"
                                label="Outlined"
                                value="Outlined"
                            />
                            <TextField
                                fullWidth
                                sx={{ mt: 3 }}
                                variant="standard"
                                label="Standard"
                                value="Standard"
                            />
                        </Container>
                        <Container sx={{ pb: 2 }}>
                            <FormControl
                                variant="filled"
                                fullWidth
                                sx={{ mt: 3 }}
                            >
                                <InputLabel id="Filled">Filled</InputLabel>
                                <Select
                                    label="Filled"
                                    labelId="Filled"
                                    value="Filled"
                                >
                                    <MenuItem value="Filled">Filled</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl
                                variant="outlined"
                                fullWidth
                                sx={{ mt: 3 }}
                            >
                                <InputLabel id="Outlined">Outlined</InputLabel>
                                <Select
                                    label="Outlined"
                                    labelId="Outlined"
                                    value="Outlined"
                                >
                                    <MenuItem value="Outlined">
                                        Outlined
                                    </MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl
                                variant="standard"
                                fullWidth
                                sx={{ mt: 3 }}
                            >
                                <InputLabel id="Standard">Standard</InputLabel>
                                <Select
                                    label="Standard"
                                    labelId="Standard"
                                    value="Standard"
                                >
                                    <MenuItem value="Standard">
                                        Standard
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Container>
                        <Container sx={{ pb: 2 }}>
                            <Editorial severity="error">Fel</Editorial>
                            <Editorial severity="warning">Varning</Editorial>
                            <Editorial severity="info">Info</Editorial>
                            <Editorial severity="success">Genomfört</Editorial>
                        </Container>
                    </Paper>
                </ThemeProvider>
            </CardContent>
            {renderCardActions()}
        </Card>
    )
}
