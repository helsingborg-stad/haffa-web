import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { Advert } from 'adverts'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import useLocalStorage from 'hooks/use-local-storage'
import { FC, useContext, useState } from 'react'
import QRCode from 'react-qr-code'

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
    const [initialSize, setInitialSize] = useLocalStorage<number>(
        'initial-qr-size',
        40
    )
    const [size, setSize] = useState<number>(initialSize)
    console.log("We're in dev.", link)
    return (
        <div
            style={{
                display: 'grid',
                placeItems: 'center',
                width: '100%',
                height: 'auto',
            }}
        >
            <NonPrintableComponent>
                <Box sx={{ width: 300, paddingTop: 5, paddingBottom: 2 }}>
                    <Slider
                        min={10}
                        max={500}
                        step={1}
                        value={size}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        onChangeCommitted={(_, value) =>
                            setInitialSize(firstElement(value))
                        }
                        onChange={(_, value) => setSize(firstElement(value))}
                    />
                </Box>
            </NonPrintableComponent>
            <div
                style={{
                    padding: 1,
                    textAlign: 'center',
                    overflow: 'clip',
                }}
            >
                <QRCode size={size} value={link} style={{}} />
                <div
                    style={{
                        fontSize: size / 4,
                        fontFamily: 'Arial, Helvetica, sans-serif',
                        breakInside: 'avoid',
                    }}
                >
                    {advert.title}
                </div>
            </div>
        </div>
    )
}
