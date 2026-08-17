import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
} from '@mui/material'
import type { Advert } from 'adverts'
import { NotificationsContext } from 'notifications'
import { PhraseContext } from 'phrases/PhraseContext'
import { PickupLocationContext } from 'pickup-locations'
import type { PickupLocation } from 'pickup-locations/types'
import { type FC, useContext, useState } from 'react'
import { ClaimDialog, canShowClaimDialog } from './ClaimDialog'

export const ReserveButton: FC<{
    advert: Advert
    onReserve: (n: number, l?: PickupLocation) => void
}> = ({ advert, onReserve }) => {
    const [claimDialog, setClaimDialog] = useState<{
        open: boolean
        pickupLocations: PickupLocation[]
    }>({ open: false, pickupLocations: [] })
    const [ownAdvertWarningOpen, setOwnAdvertWarningOpen] = useState(false)
    const { phrase } = useContext(PhraseContext)
    const { getPickupLocationsByAdvert } = useContext(PickupLocationContext)
    const { notifyIfError } = useContext(NotificationsContext)

    const {
        meta: { canReserve, reservableQuantity, isMine },
    } = advert

    const proceedToReserve = () =>
        notifyIfError(async () => {
            const pickupLocations = await getPickupLocationsByAdvert(advert)
            canShowClaimDialog({
                minCount: 1,
                maxCount: reservableQuantity,
                pickupLocations,
            })
                ? setClaimDialog({
                      open: true,
                      pickupLocations,
                  })
                : onReserve(1)
        })

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
                    isMine ? setOwnAdvertWarningOpen(true) : proceedToReserve()
                }
            >
                {phrase('ADVERT_RESERVE', 'Reservera')}
            </Button>

            <Dialog
                open={ownAdvertWarningOpen}
                onClose={() => setOwnAdvertWarningOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    {phrase(
                        'ADVERT_RESERVE_OWN_ADVERT_WARNING_TITLE',
                        'Reservera din egen annons?'
                    )}
                </DialogTitle>
                <DialogContent>
                    {phrase(
                        'ADVERT_RESERVE_OWN_ADVERT_WARNING_TEXT',
                        'Du håller på att reservera en annons som du själv har skapat. Vill du fortsätta?'
                    )}
                </DialogContent>
                <DialogActions>
                    <Stack spacing={2} direction="row" sx={{ width: '100%' }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setOwnAdvertWarningOpen(false)}
                        >
                            {phrase('CONFIRM_DIALOG_CANCEL', 'Nej, avbryt')}
                        </Button>
                        <Button
                            fullWidth
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                setOwnAdvertWarningOpen(false)
                                proceedToReserve()
                            }}
                        >
                            {phrase('CONFIRM_DIALOG_PROCEED', 'Ja, fortsätt')}
                        </Button>
                    </Stack>
                </DialogActions>
            </Dialog>

            <ClaimDialog
                minCount={1}
                title={phrase('ADVERT_RESERVE', 'Reservera')}
                maxCount={reservableQuantity}
                open={claimDialog.open}
                pickupLocations={claimDialog.pickupLocations}
                onClose={() => setClaimDialog({ ...claimDialog, open: false })}
                renderConfirmButton={(n, pickupLocation) => (
                    <Button
                        endIcon={<FavoriteBorderIcon />}
                        key={`reserve-${n}`}
                        color="primary"
                        variant="contained"
                        sx={{ mb: 1 }}
                        onClick={() => onReserve(n, pickupLocation)}
                    >
                        {phrase('ADVERT_RESERVE', 'Reservera')}
                    </Button>
                )}
            />
        </>
    )
}
