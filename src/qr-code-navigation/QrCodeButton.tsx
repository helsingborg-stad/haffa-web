import { FC, PropsWithChildren, useContext, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import {
    Button,
    ButtonProps,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    SxProps,
    Theme,
} from '@mui/material'
import { Scanner } from '@yudiel/react-qr-scanner'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'

interface QrCodeScanEvents {
    onSameDomain: (url: URL, close: () => void) => any
    onOtherDomain: (url: URL, close: () => void) => any
    onNothing: (close: () => void) => any
}

export const QrCodeButton: FC<
    PropsWithChildren &
        QrCodeScanEvents & {
            sx?: SxProps<Theme> | undefined
            buttonProps?: ButtonProps
            label: string
        }
> = ({
    children,
    sx,
    buttonProps,
    label,
    onSameDomain,
    onOtherDomain,
    onNothing,
}) => {
    const { actOnLink } = useContext(DeepLinkContext)
    const [scanning, setScanning] = useState(false)
    return (
        <>
            <Button
                color="inherit"
                endIcon={<QrCodeScannerIcon />}
                {...buttonProps}
                onClick={() => setScanning(true)}
                sx={sx}
            >
                {label}
            </Button>

            <Dialog
                onClose={() => setScanning(false)}
                open={scanning}
                fullScreen
            >
                <DialogTitle color="primary" sx={{ m: 0, p: 2 }}>
                    <QrCodeScannerIcon /> {label}
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setScanning(false)}
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
                    {scanning && (
                        <Scanner
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
                                    sameDomain: (url) =>
                                        onSameDomain(url, () =>
                                            setScanning(false)
                                        ),
                                    otherDomain: (url) =>
                                        onOtherDomain(url, () =>
                                            setScanning(false)
                                        ),
                                    none: () =>
                                        onNothing(() => setScanning(false)),
                                    error: () =>
                                        onNothing(() => setScanning(false)),
                                })
                            }
                        />
                    )}
                </DialogContent>
                <DialogContent>{children}</DialogContent>
            </Dialog>
        </>
    )
}
