import { Button, ButtonProps } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner'
import { ScanQrCodeDialog } from 'qr-code-navigation/ScanQrCodeDialog'
import { Editorial } from 'editorials'
import { SelectCountDialog } from './SelectCountDialog'

const ReserveButton: FC<{
    advert: Advert
    onReserve: (n: number) => void
}> = ({ advert, onReserve }) => {
    const [reservationDialog, setReservationDialog] = useState(false)
    const { phrase } = useContext(PhraseContext)

    const {
        meta: { canReserve, reservableQuantity },
    } = advert
    return (
        <>
            <Button
                endIcon={<FavoriteBorderIcon />}
                key="reserve"
                fullWidth
                color="primary"
                variant="outlined"
                disabled={!canReserve}
                sx={{ mb: 1 }}
                onClick={() =>
                    reservableQuantity > 1
                        ? setReservationDialog(true)
                        : onReserve(1)
                }
            >
                {phrase('ADVERT_RESERVE', 'Reservera')}
            </Button>
            <SelectCountDialog
                minCount={1}
                maxCount={reservableQuantity}
                open={reservationDialog}
                onSelectCount={(n) => onReserve(n)}
                onClose={() => setReservationDialog(false)}
                renderConfirmButton={(n) => (
                    <Button
                        endIcon={<FavoriteBorderIcon />}
                        key={`reserve-${n}`}
                        color="primary"
                        variant="contained"
                        sx={{ mb: 1 }}
                        onClick={() => onReserve(n)}
                    >
                        {phrase('ADVERT_RESERVE', 'Reservera')}
                    </Button>
                )}
            />
        </>
    )
}

const CollectButton: FC<
    ButtonProps & { advert: Advert; onCollect: (n: number) => void }
> = (props) => {
    const { advert, onCollect, ...buttonProps } = props
    const {
        meta: { canCollect, reservableQuantity },
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
                    if (reservableQuantity > 1) {
                        return setModel({ countDialog: true })
                    }
                    onCollect(1)
                    return setModel({})
                }}
                onClose={() => setModel({})}
            >
                <Editorial>
                    Skanna QR koden på prylen du vill hämta ut.
                </Editorial>
            </ScanQrCodeDialog>
            <SelectCountDialog
                key="select-count"
                open={!!countDialog}
                minCount={1}
                maxCount={reservableQuantity}
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

export const ActionsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { meta } = advert
    const { reserveAdvert, cancelAdvertReservation, collectAdvert } =
        useContext(AdvertsContext)
    const { phrase } = useContext(PhraseContext)
    return (
        <>
            {meta.canCollect && (
                <CollectButton
                    advert={advert}
                    fullWidth
                    color="primary"
                    variant="contained"
                    sx={{ mb: 1 }}
                    onCollect={(n) => onUpdate(collectAdvert(advert.id, n))}
                />
            )}

            <ReserveButton
                key="reserve"
                advert={advert}
                onReserve={(n) => onUpdate(reserveAdvert(advert.id, n))}
            />

            <Button
                key="cancel"
                fullWidth
                color="secondary"
                variant="text"
                disabled={!meta.canCancelReservation}
                onClick={() => onUpdate(cancelAdvertReservation(advert.id))}
            >
                {phrase(
                    'ADVERT_CANCEL_RESERVATION',
                    'Ångra mina reservationer'
                )}
            </Button>
        </>
    )
}
