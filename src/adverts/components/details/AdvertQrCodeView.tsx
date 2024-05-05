import {
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    GlobalStyles,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
    styled,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import Slider from '@mui/material/Slider'
import { Advert } from 'adverts'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { FC, useCallback, useContext } from 'react'
import QRCode from 'react-qr-code'
import useLocalStorage from 'hooks/use-local-storage'

type QRCodeLabel = {
    labelWidth: number
    labelHeight: number
    labelHeadline: string
    labelMargin: number
    textSize: number
    measurementUnit: string
    qrCodeSize: number
    showReference: boolean
    showTitle: boolean
}
const NonPrintableComponent = styled('div')({
    '@media print': {
        display: 'none',
    },
    '@media screen': {
        marginTop: '15px',
        marginBottom: '5px',
    },
})
const firstElement = <T,>(value: T | T[]): T =>
    Array.isArray(value) ? value[0] : value

export const AdvertQrCodeView: FC<{ advert: Advert }> = ({ advert }) => {
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const link = getAdvertLinkForQrCode(advert)
    /*    const [initialState] = useLocalStorage<QRCodeLabel>('haffa-qr-code-view', {
        labelWidth: 25,
        labelHeight: 25,
        labelHeadline: '',
        labelMargin: 1,
        measurementUnit: 'mm',
        size: 40,
    }) */
    const [state, setState] = useLocalStorage<QRCodeLabel>(
        'haffa-qr-code-view-v2',
        {
            labelWidth: 25,
            labelHeight: 25,
            labelHeadline: '',
            labelMargin: 1,
            textSize: 2,
            measurementUnit: 'mm',
            qrCodeSize: 15,
            showReference: true,
            showTitle: true,
        }
    )

    const patch = useCallback(
        (value: Partial<QRCodeLabel>) => {
            setState({
                ...state,
                ...value,
            })
        },
        [state, setState]
    )

    const toUnits = (value: number): string =>
        `${value}${state.measurementUnit}`

    const createFooter = (): string =>
        [
            state.showReference ? advert.reference : undefined,
            state.showTitle ? advert.title : undefined,
        ]
            .filter((s) => s)
            .map((s) => (s || '').trim())
            .join(' - ')
    return (
        <>
            <GlobalStyles
                styles={{
                    '@media print': {
                        '@page': {
                            margin: toUnits(state.labelMargin),
                            size: `${toUnits(state.labelWidth)} ${toUnits(
                                state.labelHeight
                            )}`,
                        },
                        'body,html,#root': {
                            margin: 0,
                            padding: 0,
                            width: toUnits(state.labelWidth),
                            height: toUnits(state.labelHeight),
                        },
                        '.label': {
                            border: 0,
                        },
                    },
                    '@media screen': {
                        '.label': {
                            border: '1px dotted black',
                        },
                    },
                }}
            />

            <div
                style={{
                    display: 'grid',
                    placeItems: 'center',
                }}
            >
                <NonPrintableComponent>
                    <Stack direction="column">
                        <Stack direction="row" spacing={2} mb={2}>
                            <TextField
                                select
                                variant="standard"
                                fullWidth
                                sx={{ mt: 2 }}
                                value={state.measurementUnit}
                                defaultValue="mm"
                                label="Enhet"
                                onChange={({ target: { value } }) =>
                                    patch({ measurementUnit: value })
                                }
                            >
                                <MenuItem value="mm">mm</MenuItem>
                                <MenuItem value="em">em</MenuItem>
                                <MenuItem value="px">px</MenuItem>
                            </TextField>
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Typography width={200}>Bredd:</Typography>
                            <Typography width={75} textAlign="right">
                                {toUnits(state.labelWidth)}
                            </Typography>
                            <Slider
                                min={1}
                                max={150}
                                step={1}
                                value={state.labelWidth}
                                aria-label="Default"
                                onChangeCommitted={(_, value) =>
                                    patch({ labelWidth: firstElement(value) })
                                }
                                onChange={(_, value) =>
                                    patch({ labelWidth: firstElement(value) })
                                }
                            />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Typography width={200}>Höjd:</Typography>
                            <Typography width={75} textAlign="right">
                                {toUnits(state.labelHeight)}
                            </Typography>
                            <Slider
                                min={1}
                                max={150}
                                step={1}
                                value={state.labelHeight}
                                aria-label="Default"
                                onChangeCommitted={(_, value) =>
                                    patch({ labelHeight: firstElement(value) })
                                }
                                onChange={(_, value) =>
                                    patch({ labelHeight: firstElement(value) })
                                }
                            />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Typography width={200}>Marginal:</Typography>
                            <Typography width={75} textAlign="right">
                                {toUnits(state.labelMargin)}
                            </Typography>

                            <Slider
                                min={0}
                                max={state.labelHeight / 2 - 1}
                                step={1}
                                value={state.labelMargin}
                                aria-label="Default"
                                onChangeCommitted={(_, value) =>
                                    patch({ labelMargin: firstElement(value) })
                                }
                                onChange={(_, value) =>
                                    patch({ labelMargin: firstElement(value) })
                                }
                            />
                        </Stack>

                        <Stack direction="row" spacing={2}>
                            <Typography width={200}>QR-storlek:</Typography>
                            <Typography width={75} textAlign="right">
                                {toUnits(state.qrCodeSize)}
                            </Typography>
                            <Slider
                                min={0}
                                max={Math.min(
                                    state.labelWidth,
                                    state.labelHeight
                                )}
                                step={1}
                                value={state.qrCodeSize}
                                aria-label="Default"
                                onChangeCommitted={(_, value) =>
                                    patch({ qrCodeSize: firstElement(value) })
                                }
                                onChange={(_, value) =>
                                    patch({ qrCodeSize: firstElement(value) })
                                }
                            />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <Typography width={200}>Textstorlek:</Typography>
                            <Typography width={75} textAlign="right">
                                {toUnits(state.textSize)}
                            </Typography>
                            <Slider
                                min={1}
                                max={10}
                                step={1}
                                value={state.textSize}
                                aria-label="Default"
                                onChangeCommitted={(_, value) =>
                                    patch({ textSize: firstElement(value) })
                                }
                                onChange={(_, value) =>
                                    patch({ textSize: firstElement(value) })
                                }
                            />
                        </Stack>
                        <FormControl component="fieldset" variant="standard">
                            <FormLabel component="legend">Footer</FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.showReference}
                                            onChange={({
                                                target: { checked },
                                            }) =>
                                                patch({
                                                    showReference: checked,
                                                })
                                            }
                                            name="reference"
                                        />
                                    }
                                    label="Visa referens"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={state.showTitle}
                                            onChange={({
                                                target: { checked },
                                            }) => patch({ showTitle: checked })}
                                            name="title"
                                        />
                                    }
                                    label="Visa annonstitel"
                                />
                            </FormGroup>
                        </FormControl>
                        <TextField
                            fullWidth
                            sx={{ my: 2 }}
                            label="Rubrik"
                            value={state.labelHeadline}
                            onChange={({ target: { value } }) =>
                                patch({ labelHeadline: value })
                            }
                        />
                    </Stack>
                    <IconButton
                        onClick={() => window.print()}
                        aria-label="skriv ut"
                        size="large"
                    >
                        <PrintIcon />
                    </IconButton>
                    <hr />
                </NonPrintableComponent>
                <div
                    className="label"
                    style={{
                        textAlign: 'center',
                        pageBreakAfter: 'always',
                        pageBreakBefore: 'auto',
                        pageBreakInside: 'avoid',
                        minWidth: toUnits(state.labelWidth),
                        maxWidth: toUnits(state.labelWidth),
                        minHeight: toUnits(state.labelHeight),
                        maxHeight: toUnits(state.labelHeight),
                        padding: toUnits(state.labelMargin),
                        overflow: 'clip',
                        position: 'relative',
                        boxSizing: 'border-box',
                    }}
                >
                    {state.labelHeadline !== '' && (
                        <div
                            style={{
                                fontSize: toUnits(state.textSize),
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                breakInside: 'avoid',
                                overflow: 'clip',
                                whiteSpace: 'nowrap',
                                lineHeight: toUnits(state.textSize),
                                position: 'absolute',
                                top: toUnits(state.labelMargin),
                                left: toUnits(state.labelMargin),
                                right: toUnits(state.labelMargin),
                                bottom: toUnits(state.textSize),
                            }}
                        >
                            {state.labelHeadline}
                        </div>
                    )}
                    {state.qrCodeSize !== 0 && (
                        <QRCode
                            value={link}
                            viewBox={`0 0 ${state.qrCodeSize} ${state.qrCodeSize}`}
                            style={{
                                breakInside: 'avoid',
                                height: toUnits(state.qrCodeSize),
                                maxHeight: toUnits(state.qrCodeSize),
                                maxWidth: toUnits(state.qrCodeSize),
                                width: toUnits(state.qrCodeSize),
                                position: 'absolute',
                                left: toUnits(
                                    state.labelWidth / 2 - state.qrCodeSize / 2
                                ),
                                bottom: toUnits(
                                    state.labelHeight / 2 - state.qrCodeSize / 2
                                ),
                            }}
                        />
                    )}
                    {(state.showTitle || state.showReference) && (
                        <div
                            style={{
                                fontSize: toUnits(state.textSize),
                                fontFamily: 'Arial, Helvetica, sans-serif',
                                breakInside: 'avoid',
                                overflow: 'clip',
                                whiteSpace: 'nowrap',
                                lineHeight: toUnits(state.textSize),
                                position: 'absolute',
                                bottom: toUnits(state.labelMargin),
                                left: toUnits(state.labelMargin),
                                right: toUnits(state.labelMargin),
                            }}
                        >
                            {createFooter()}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
