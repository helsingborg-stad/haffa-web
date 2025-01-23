import { Button, ButtonProps } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext, useState } from 'react'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { ScanQrCodeDialog } from 'qr-code-navigation/ScanQrCodeDialog'
import { Editorial } from 'editorials'
import { SelectCountDialog } from '../SelectCountDialog'

export const CollectButton: FC<
    ButtonProps & { advert: Advert; onCollect: (n: number) => void }
> = (props) => {
    const { advert, onCollect, ...buttonProps } = props
    const {
        meta: { canCollect, collectableQuantity, reservedyMe },
    } = advert
    const { ADVERT_COLLECT } = useContext(PhraseContext)
    const [{ scanDialog, countDialog }, setModel] = useState<{
        scanDialog?: boolean
        countDialog?: boolean
    }>({})

    return (
        <>
            <Button
                key="collect"
                disabled={!canCollect}
                endIcon={<QrCodeScannerIcon />}
                onClick={() => setModel({ scanDialog: true })}
                fullWidth
                color="primary"
                variant="contained"
                {...buttonProps}
            >
                {ADVERT_COLLECT}
            </Button>
            <ScanQrCodeDialog
                key="scan"
                open={!!scanDialog}
                fullWidth
                maxWidth="xs"
                label={ADVERT_COLLECT}
                matchAdvert={advert}
                onScan={() => {
                    if (collectableQuantity > 1) {
                        return setModel({ countDialog: true })
                    }
                    onCollect(1)
                    return setModel({})
                }}
                onClose={() => setModel({})}
            >
                <Editorial phraseKey="ADVERT_COLLECT_SCAN_EDITORIAL">
                    Skanna QR koden på prylen du vill hämta ut.
                </Editorial>
            </ScanQrCodeDialog>
            <SelectCountDialog
                key="select-count"
                title={ADVERT_COLLECT}
                open={!!countDialog}
                count={reservedyMe || 1}
                minCount={1}
                maxCount={collectableQuantity}
                onClose={() => setModel({})}
                onSelectCount={(n) => onCollect(n)}
                renderConfirmButton={(n) => (
                    <Button
                        key="collect"
                        disabled={!canCollect}
                        endIcon={<QrCodeScannerIcon />}
                        onClick={() => onCollect(n)}
                        {...buttonProps}
                        fullWidth={false}
                    >
                        {ADVERT_COLLECT}
                    </Button>
                )}
            />
        </>
    )
}
