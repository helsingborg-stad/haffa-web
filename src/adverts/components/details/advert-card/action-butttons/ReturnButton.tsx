import { Button, ButtonProps } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext, useState } from 'react'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { ScanQrCodeDialog } from 'qr-code-navigation/ScanQrCodeDialog'
import { Editorial } from 'editorials'
import { SelectCountDialog } from '../SelectCountDialog'

export const ReturnButton: FC<
    ButtonProps & { advert: Advert; onReturn: () => void }
> = (props) => {
    const { advert, onReturn, ...buttonProps } = props
    const {
        meta: { canReturn },
    } = advert
    const { ADVERT_RETURN } = useContext(PhraseContext)
    const [{ scanDialog, countDialog }, setModel] = useState<{
        scanDialog?: boolean
        countDialog?: boolean
    }>({})

    return (
        <>
            <Button
                key="collect"
                disabled={!canReturn}
                endIcon={<QrCodeScannerIcon />}
                onClick={() => setModel({ scanDialog: true })}
                {...buttonProps}
            >
                {ADVERT_RETURN}
            </Button>
            <ScanQrCodeDialog
                key="scan"
                open={!!scanDialog}
                fullWidth
                maxWidth="xs"
                label={ADVERT_RETURN}
                matchAdvert={advert}
                onScan={() => {
                    onReturn()
                    return setModel({})
                }}
                onClose={() => setModel({})}
            >
                <Editorial phraseKey="ADVERT_COLLECT_SCAN_EDITORIAL">
                    Skanna QR koden på prylen som återlämnats.
                </Editorial>
            </ScanQrCodeDialog>
            <SelectCountDialog
                key="select-count"
                title=""
                open={!!countDialog}
                count={1}
                minCount={1}
                maxCount={1}
                onClose={() => setModel({})}
                onSelectCount={() => onReturn()}
                renderConfirmButton={() => (
                    <Button
                        key="collect"
                        disabled={!canReturn}
                        endIcon={<QrCodeScannerIcon />}
                        onClick={() => onReturn()}
                        {...buttonProps}
                        fullWidth={false}
                    >
                        {ADVERT_RETURN}
                    </Button>
                )}
            />
        </>
    )
}
