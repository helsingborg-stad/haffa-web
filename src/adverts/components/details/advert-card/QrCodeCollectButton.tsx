import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'
import { Alert, ButtonProps, SxProps, Theme } from '@mui/material'
import { QrCodeButton } from 'qr-code-navigation'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { Advert } from 'adverts'
import { Editorial } from 'editorials'

export const QrCodeCollectButton: FC<{
    advert: Advert
    onCollect: () => void
    buttonProps: ButtonProps
    sx?: SxProps<Theme> | undefined
}> = ({ advert, onCollect, buttonProps, sx }) => {
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const { phrase, PICKUP_ADVERT } = useContext(PhraseContext)
    const [message, setMessage] = useState('')

    return (
        <QrCodeButton
            buttonProps={buttonProps}
            label={PICKUP_ADVERT}
            sx={sx}
            onSameDomain={(url, close) => {
                if (url.toString() === getAdvertLinkForQrCode(advert)) {
                    onCollect()
                    return close()
                }
                setMessage(phrase('', 'QR koden matchar inte denna annons'))
            }}
            onOtherDomain={() =>
                setMessage(phrase('', 'Detta är ingen Haffa länk'))
            }
            onNothing={() => setMessage('')}
        >
            {message && <Alert>{message}</Alert>}

            <Editorial>Skanna QR koden på prylen du vill hämta ut.</Editorial>
        </QrCodeButton>
    )
}
