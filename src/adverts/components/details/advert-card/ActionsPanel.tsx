import { Button } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { QrCodeCollectButton } from './QrCodeCollectButton'
import { SelectCountButton } from './SelectCountButton'

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
                <QrCodeCollectButton
                    key="collect"
                    advert={advert}
                    onCollect={() => onUpdate(collectAdvert(advert.id, 1))}
                    buttonProps={{
                        fullWidth: true,
                        color: 'primary',
                        variant: 'contained',
                    }}
                    sx={{ mb: 1 }}
                />
            )}
            <SelectCountButton
                endIcon={<FavoriteBorderIcon />}
                key="reserve"
                fullWidth
                color="primary"
                variant="outlined"
                disabled={!meta.canReserve}
                minCount={1}
                maxCount={meta.reservableQuantity}
                onSelectCount={(n) => onUpdate(reserveAdvert(advert.id, n))}
                sx={{ mb: 1 }}
            >
                {phrase('ADVERT_RESERVE', 'Reservera')}
            </SelectCountButton>

            <Button
                key="cancel"
                fullWidth
                color="primary"
                variant="outlined"
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
