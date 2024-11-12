import { Button } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { SelectCountDialog } from '../SelectCountDialog'

export const ReserveButton: FC<{
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
                title={phrase('ADVERT_RESERVE', 'Reservera')}
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
