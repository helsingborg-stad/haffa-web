import { Button } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const ActionsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { meta } = advert
    const { reserveAdvert, cancelAdvertReservation } =
        useContext(AdvertsContext)
    const { phrase } = useContext(PhraseContext)
    return (
        <>
            <Button
                fullWidth
                color="primary"
                variant="outlined"
                disabled={!meta.canReserve}
                onClick={() => onUpdate(reserveAdvert(advert.id, 1))}
            >
                {phrase('', 'HAFFA!')}
            </Button>
            <Button
                fullWidth
                color="primary"
                variant="outlined"
                disabled={!meta.canCancelReservation}
                onClick={() => onUpdate(cancelAdvertReservation(advert.id))}
            >
                {phrase('', 'Ångra mina haffningar!')}
            </Button>
        </>
    )
}
