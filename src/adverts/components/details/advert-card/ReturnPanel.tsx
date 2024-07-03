import { FC, useContext } from 'react'
import { Card, CardContent } from '@mui/material'
import { AdvertsContext } from 'adverts'
import { Editorial } from 'editorials'
import { PhraseContext } from 'phrases'
import { Advert, AdvertMutationResult } from '../../../types'
import { ReturnButton } from './action-butttons/ReturnButton'

export const ReturnPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { returnAdvert } = useContext(AdvertsContext)
    const { prettyDate } = useContext(PhraseContext)
    const {
        meta: { canReturn, waitlistCount, returnInfo },
    } = advert
    const [date = { at: 'Okänt datum' }] = returnInfo

    return canReturn ? (
        <Card>
            <CardContent>
                <Editorial
                    phraseKey="ADVERT_RETURN_EDITORIAL"
                    templateVariables={{
                        waitlistCount,
                        returnDate: prettyDate(date.at),
                    }}
                    severity="info"
                >
                    {
                        'Artikeln är utlånad till och med {returnDate} och har {waitlistCount}st bevakning(ar). Den kan efter mottagningskontroll återföras till lagret.'
                    }
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
