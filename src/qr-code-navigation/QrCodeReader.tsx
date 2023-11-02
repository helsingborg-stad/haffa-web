import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { FC, useContext } from 'react'
import { QrReader } from 'react-qr-reader'

export const QrCodeReader: FC<{
    onSameDomain: (url: URL) => any
    onOtherDomain: (url: URL) => any
    onNothing: () => any
    onError: (error: any) => any
}> = ({ onSameDomain, onOtherDomain, onNothing, onError }) => {
    const { actOnLink } = useContext(DeepLinkContext)

    return (
        <QrReader
            constraints={{ facingMode: 'environment' }}
            containerStyle={{ width: '100%', height: '100%' }}
            onResult={(result) =>
                actOnLink<any>(result?.getText(), {
                    sameDomain: onSameDomain,
                    otherDomain: onOtherDomain,
                    none: onNothing,
                    error: onError,
                })
            }
        />
    )
}
