import { FC, useContext } from 'react'
import { Card, CardContent } from '@mui/material'
import { AdvertsContext } from 'adverts'
import { Editorial } from 'editorials'
import { Advert, AdvertMutationResult } from '../../../types'
import { ReturnButton } from './action-butttons/ReturnButton'

export const ReturnPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { returnAdvert } = useContext(AdvertsContext)
    const {
        meta: { canReturn },
    } = advert
    return canReturn ? (
        <Card>
            <CardContent>
                <Editorial phraseKey="ADVERT_RETURN_EDITORIAL" severity="info">
                    Artikeln är utlånad och kan efter mottagningskontroll
                    återföras till lagret.
                </Editorial>
                <ReturnButton
                    advert={advert}
                    onReturn={() => onUpdate(returnAdvert(advert.id))}
                    fullWidth
                    variant="contained"
                />
            </CardContent>
        </Card>
    ) : null
}
