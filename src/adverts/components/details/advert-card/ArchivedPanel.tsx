import { Alert, AlertTitle, Button } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const ArchivedPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { unarchiveAdvert } = useContext(AdvertsContext)
    return advert.meta.canUnarchive ? (
        <Alert severity="info">
            <AlertTitle>
                {' '}
                {phrase(
                    '',
                    'Annonsen är arkiverad och syns inte i annonsflödet'
                )}
            </AlertTitle>
            <Button
                fullWidth
                variant="outlined"
                sx={{ ml: 'auto' }}
                color="primary"
                onClick={async () => onUpdate(unarchiveAdvert(advert.id))}
            >
                {phrase('', 'Återställ')}
            </Button>
        </Alert>
    ) : null
}
