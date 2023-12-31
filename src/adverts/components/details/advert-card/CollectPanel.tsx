import { FC, useContext } from 'react'
import { Button, Grid } from '@mui/material'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { Advert, AdvertMutationResult } from '../../../types'
import { PhraseContext } from '../../../../phrases/PhraseContext'

export const CollectPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { ADVERT_COLLECT: PICKUP_ADVERT } = useContext(PhraseContext)
    const { collectAdvert } = useContext(AdvertsContext)

    return (
        <Grid container spacing={2} color="primary">
            <Button
                color="primary"
                variant="contained"
                disabled={!advert.meta.canCollect}
                onClick={() => onUpdate(collectAdvert(advert.id, 1))}
            >
                {PICKUP_ADVERT}
            </Button>
        </Grid>
    )
}
