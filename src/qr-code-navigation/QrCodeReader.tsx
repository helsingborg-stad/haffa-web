import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { FC, useContext } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'

export const QrCodeReader: FC<{
    onSameDomain: (url: URL) => any
    onOtherDomain: (url: URL) => any
    onNothing: () => any
    onError: (error: any) => any
}> = ({ onSameDomain, onOtherDomain, onNothing, onError }) => {
    const { actOnLink } = useContext(DeepLinkContext)
    return (
        <Scanner
            scanDelay={5000}
            allowMultiple
            constraints={{
                facingMode: 'environment',
            }}
            formats={['qr_code']}
            styles={{
                finderBorder: 75,
            }}
            components={{
                audio: false,
            }}
            onScan={(result) =>
                actOnLink<any>(result?.[0].rawValue, {
                    sameDomain: onSameDomain,
                    otherDomain: onOtherDomain,
                    none: onNothing,
                    error: onError,
                })
            }
        />
    )
}
