import { Button } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import { ReserveButton } from './action-butttons/ReserveButton'
import { CollectButton } from './action-butttons/CollectButton'

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
