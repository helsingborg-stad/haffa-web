import { Button, Grid } from '@mui/material'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { type FC, useContext } from 'react'
import { PhraseContext } from '../../../../phrases/PhraseContext'
import type { Advert, AdvertMutationResult } from '../../../types'

export const CollectPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { ADVERT_COLLECT: PICKUP_ADVERT } = useContext(PhraseContext)
    const { collectAdvert } = useContext(AdvertsContext)

    return (
        <Grid container spacing={2}>
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
