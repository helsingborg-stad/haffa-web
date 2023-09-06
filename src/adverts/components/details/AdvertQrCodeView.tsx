import { Typography } from '@mui/material'
import { Advert } from 'adverts'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { FC, useContext } from 'react'
import QRCode from 'react-qr-code'

export const AdvertQrCodeView: FC<{ advert: Advert }> = ({ advert }) => {
    const {getAdvertLinkForQrCode} = useContext(DeepLinkContext)
    const link = getAdvertLinkForQrCode(advert)
    console.log(link)
    return (
        <div
            style={{
                display: 'grid',
                placeItems: 'center',
                width: '100vw',
                height: '100vh',
            }}
        >
            <div>
                <QRCode
                    value={link}
                    style={{ maxHeight: '10cm', maxWidth: '10cm' }}
                />
                <div style={{ textAlign: 'center' }}>
                    <Typography variant="h3">{advert.title}</Typography>
                </div>
            </div>
        </div>
    )
}