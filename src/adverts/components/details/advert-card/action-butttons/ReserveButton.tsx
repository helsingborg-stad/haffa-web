import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Button } from '@mui/material'
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
    const { phrase } = useContext(PhraseContext)
    const { getPickupLocationsByAdvert } = useContext(PickupLocationContext)
    const { notifyIfError } = useContext(NotificationsContext)

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
                    notifyIfError(async () => {
                        const pickupLocations =
                            await getPickupLocationsByAdvert(advert)
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
                }
            >
                {phrase('ADVERT_RESERVE', 'Reservera')}
            </Button>

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
