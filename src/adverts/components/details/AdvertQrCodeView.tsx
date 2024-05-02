import {
    Box,
    GlobalStyles,
    Grid,
    IconButton,
    Typography,
    styled,
} from '@mui/material'
import PrintIcon from '@mui/icons-material/Print'
import Slider from '@mui/material/Slider'
import { Advert } from 'adverts'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import useLocalStorage from 'hooks/use-local-storage'
import { FC, useContext, useState } from 'react'
import QRCode from 'react-qr-code'

type State = {
    margin: number
    size: number
}
const NonPrintableComponent = styled('div')({
    '@media print': {
        display: 'none',
    },
})
const firstElement = <T,>(value: T | T[]): T =>
    Array.isArray(value) ? value[0] : value

export const AdvertQrCodeView: FC<{ advert: Advert }> = ({ advert }) => {
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const link = getAdvertLinkForQrCode(advert)
    const [initialState, setInitialState] = useLocalStorage<State>(
        'haffa-qr-code-view',
        {
            size: 40,
            margin: 15,
        }
    )
    const [state, setState] = useState<State>(initialState)

    return (
        <div
            style={{
                display: 'grid',
                placeItems: 'center',
            }}
        >
            <GlobalStyles
                styles={{
                    '@media print': {
                        '@page': {
                            margin: 0,
                            size: 'landscape',
                        },
                        'body,html,#root': {
                            margin: 0,
                            padding: 0,
                        },
                        '#container': {
                            border: 0,
                        },
                    },
                    '@media screen': {
                        '#container': {
                            borderTop: '1px dotted black',
                        },
                    },
                }}
            />

            <NonPrintableComponent>
                <Box sx={{ width: 300, paddingTop: 5, paddingBottom: 2 }}>
                    <Typography gutterBottom>Storlek</Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                min={10}
                                max={500}
                                step={1}
                                value={state.size}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                onChangeCommitted={(_, value) =>
                                    setInitialState({
                                        size: firstElement(value),
                                        margin: state.margin,
                                    })
                                }
                                onChange={(_, value) =>
                                    setState({
                                        size: firstElement(value),
                                        margin: state.margin,
                                    })
                                }
                            />
                        </Grid>
                    </Grid>
                    <Typography gutterBottom>Marginal</Typography>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs>
                            <Slider
                                min={0}
                                max={500}
                                step={1}
                                value={state.margin}
                                aria-label="Default"
                                valueLabelDisplay="auto"
                                onChangeCommitted={(_, value) =>
                                    setInitialState({
                                        margin: firstElement(value),
                                        size: state.size,
                                    })
                                }
                                onChange={(_, value) =>
                                    setState({
                                        margin: firstElement(value),
                                        size: state.size,
                                    })
                                }
                            />
                        </Grid>
                        <Grid item>
                            <IconButton
                                onClick={() => window.print()}
                                aria-label="skriv ut"
                            >
                                <PrintIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Box>
            </NonPrintableComponent>
            {[1, 2, 3].map(() => (
                <div
                    id="container"
                    style={{
                        textAlign: 'center',
                        breakAfter: 'always',
                        width: '100%',
                        paddingTop: state.margin,
                    }}
                >
                    <QRCode size={state.size} value={link} />
                    <div
                        style={{
                            fontSize: state.size / 5,
                            fontFamily: 'Arial, Helvetica, sans-serif',
                            breakInside: 'avoid',
                        }}
                    >
                        {[advert.reference, advert.title]
                            .map((s) => (s || '').trim())
                            .filter((v) => v)
                            .join(' - ')}
                    </div>
                </div>
            ))}
        </div>
    )
}
