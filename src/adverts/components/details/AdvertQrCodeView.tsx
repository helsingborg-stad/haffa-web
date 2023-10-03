import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { Advert } from 'adverts'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { FC, useContext, useState } from 'react'
import QRCode from 'react-qr-code'

const NonPrintableComponent = styled('div')({
    '@media print': {
        display: 'none',
    },
})
const marks = [
    {
        value: 55,
        label: '51x38mm',
    },
    {
        value: 230,
        label: '89x127mm',
    },
    {
        value: 500,
        label: 'A4',
    },
]

export const AdvertQrCodeView: FC<{ advert: Advert }> = ({ advert }) => {
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const link = getAdvertLinkForQrCode(advert)
    const [size, setSize] = useState<number>(55)
    console.log(link)
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
                        marks={marks}
                        onChange={(_, value) =>
                            setSize(Array.isArray(value) ? value[0] : value)
                        }
                    />
                </Box>
            </NonPrintableComponent>
            <div
                style={{
                    padding: 1,
                }}
            >
                <QRCode size={size} value={link} style={{}} />
            </div>
        </div>
    )
}
