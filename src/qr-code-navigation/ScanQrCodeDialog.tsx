import { FC, useContext, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import {
    Alert,
    Dialog,
    DialogContent,
    DialogProps,
    DialogTitle,
    IconButton,
} from '@mui/material'
import { QrReader } from 'react-qr-reader'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases'

export const ScanQrCodeDialog: FC<
    DialogProps & {
        label: string
        matchAdvert?: Advert
        onScan: (url: string) => void
    }
> = (props) => {
    const { label, matchAdvert, onScan, ...dialogProps } = props
    const { open, onClose } = dialogProps
    const { actOnLink } = useContext(DeepLinkContext)
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const { phrase, ERROR_UNKNOWN } = useContext(PhraseContext)
    const [message, setMessage] = useState('')
    return (
        <Dialog {...dialogProps}>
            <DialogTitle color="primary" sx={{ m: 0, p: 2 }}>
                <QrCodeScannerIcon /> {label}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={(e) => onClose?.(e, 'backdropClick')}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent>
                {open && (
                    <QrReader
                        constraints={{ facingMode: 'environment' }}
                        containerStyle={{ width: '100%', height: '100%' }}
                        onResult={(result) =>
                            actOnLink<any>(result?.getText(), {
                                sameDomain: (url) => {
                                    if (matchAdvert) {
                                        if (
                                            url.toString() !==
                                            getAdvertLinkForQrCode(matchAdvert)
                                        ) {
                                            return setMessage(
                                                phrase(
                                                    '',
                                                    'QR koden matchar inte denna annons'
                                                )
                                            )
                                        }
                                        return onScan(url.toString())
                                    }
                                },
                                otherDomain: () =>
                                    setMessage(
                                        phrase('', 'Detta är ingen Haffa länk')
                                    ),
                                none: () => setMessage(''),
                                error: () => setMessage(ERROR_UNKNOWN),
                            })
                        }
                    />
                )}
            </DialogContent>
            <DialogContent>
                {message && <Alert>{message}</Alert>}
                {props.children}
            </DialogContent>
        </Dialog>
    )
}
