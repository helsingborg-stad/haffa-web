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
        <Alert sx={{ mb: 2 }}>
            <AlertTitle>
                {' '}
                {phrase(
                    'USER_INFO_ADVERT_IS_ARCHIVED',
                    'Annonsen är arkiverad och syns inte i annonsflödet'
                )}
            </AlertTitle>
            <Button
                fullWidth
                variant="contained"
                sx={{ ml: 'auto' }}
                color="primary"
                onClick={async () => onUpdate(unarchiveAdvert(advert.id))}
            >
                {phrase('USER_ACTION_UNARCHIVE_ADVERT', 'Återställ')}
            </Button>
        </Alert>
    ) : null
}
