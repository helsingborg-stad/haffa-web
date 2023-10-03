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
                <Box sx={{ width: 300, padding: 5 }}>
                    <Slider
                        min={10}
                        max={400}
                        defaultValue={size}
                        aria-label="Default"
                        valueLabelDisplay="auto"
                        onChange={(_, value) =>
                            setSize(Array.isArray(value) ? value[0] : value)
                        }
                    />
                </Box>
            </NonPrintableComponent>
            <div>
                <QRCode size={size} value={link} style={{}} />
            </div>
        </div>
    )
}
