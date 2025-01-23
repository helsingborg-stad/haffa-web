import { Button } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const CancelButton: FC<{
    advert: Advert
    onCancel: () => void
}> = ({ advert, onCancel }) => {
    const { phrase } = useContext(PhraseContext)

    const {
        meta: { canCancelReservation },
    } = advert

    return (
        <Button
            key="cancel"
            fullWidth
            color="secondary"
            variant="text"
            disabled={!canCancelReservation}
            onClick={() => onCancel()}
        >
            {phrase('ADVERT_CANCEL_RESERVATION', 'Ångra mina reservationer')}
        </Button>
    )
}
