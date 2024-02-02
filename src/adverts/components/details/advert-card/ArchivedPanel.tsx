import { Button, Card, CardContent } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { Editorial } from 'editorials'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const ArchivedPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { unarchiveAdvert } = useContext(AdvertsContext)
    const {
        meta: { canUnarchive },
    } = advert
    return (
        canUnarchive && (
            <Card>
                <CardContent>
                    <Editorial
                        phraseKey="USER_INFO_ADVERT_IS_ARCHIVED"
                        severity="info"
                    >
                        Annonsen är arkiverad och syns inte i annonsflödet.
                    </Editorial>
                    <Button
                        fullWidth
                        variant="contained"
                        sx={{ ml: 'auto' }}
                        color="primary"
                        onClick={async () =>
                            onUpdate(unarchiveAdvert(advert.id))
                        }
                    >
                        {phrase('USER_ACTION_UNARCHIVE_ADVERT', 'Återställ')}
                    </Button>
                </CardContent>
            </Card>
        )
    )
}
