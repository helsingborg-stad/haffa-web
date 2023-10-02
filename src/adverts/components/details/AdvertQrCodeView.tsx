import { Advert } from 'adverts'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { FC, useContext } from 'react'
import QRCode from 'react-qr-code'

export const AdvertQrCodeView: FC<{ advert: Advert }> = ({ advert }) => {
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const link = getAdvertLinkForQrCode(advert)
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
            <div>
                <QRCode size={55} value={link} style={{}} />
            </div>
        </div>
    )
}
