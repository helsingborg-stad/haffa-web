import StorefrontIcon from '@mui/icons-material/Storefront'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { type ButtonProps, Card, CardContent } from '@mui/material'
import { AdvertsContext } from 'adverts/AdvertsContext'
import type { Advert, AdvertMutationResult } from 'adverts/types'
import { ConfirmButton } from 'components/ConfirmButton'
import { Editorial } from 'editorials'
import { PhraseContext } from 'phrases'
import { type FC, useContext } from 'react'

const PickButton: FC<
    ButtonProps & {
        editorialPhraseKey: string
    }
> = ({ editorialPhraseKey, ...buttonProps }) => (
    <Card>
        <CardContent>
            <Editorial phraseKey={editorialPhraseKey} severity="info" />
            <ConfirmButton
                fullWidth
                variant="contained"
                color="primary"
                sx={{ ml: 'auto' }}
                {...buttonProps}
            />
        </CardContent>
    </Card>
)

export const PickPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { markAdvertAsPicked, markAdvertAsUnpicked } =
        useContext(AdvertsContext)
    const {
        meta: { canPick, canUnpick },
    } = advert

    return (
        <>
            {canPick && (
                <PickButton
                    onClick={() => onUpdate(markAdvertAsPicked(advert.id))}
                    editorialPhraseKey="ADVERT_MARK_AS_PICKED_EDITORIAL"
                    endIcon={<StorefrontIcon />}
                >
                    {phrase('ADVERT_MARK_AS_PICKED', 'Markera som plockad')}
                </PickButton>
            )}
            {canUnpick && (
                <PickButton
                    onClick={() => onUpdate(markAdvertAsUnpicked(advert.id))}
                    editorialPhraseKey="ADVERT_MARK_AS_UNPICKED_EDITORIAL"
                    endIcon={<WarehouseIcon />}
                >
                    {phrase('ADVERT_MARK_AS_UNPICKED', 'Markera som oplockad')}
                </PickButton>
            )}
        </>
    )
}
