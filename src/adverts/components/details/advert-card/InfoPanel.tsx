import { Alert, Typography } from '@mui/material'
import { Advert } from 'adverts'
import { Category } from 'categories/types'
import { Markdown } from 'components/Markdown'
import { TreeAdapter } from 'lib/types'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const InfoPanel: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
    error?: string
    hideTitle?: boolean
    hideDescription?: boolean
}> = ({ advert, categories, error, hideTitle, hideDescription }) => {
    const { fromNow, phrase } = useContext(PhraseContext)
    const categoryLabel = categories.findById(advert.category)?.label
    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}

            {advert.meta.reservedyMe > 0 && (
                <Alert severity="success">
                    {phrase(
                        'ADVERT_IS_RESERVED_BY_YOU',
                        'Du har reserverat {count} {unit}',
                        {
                            count: advert.meta.reservedyMe,
                            unit: advert.unit,
                        }
                    )}
                </Alert>
            )}
            {advert.meta.collectedByMe > 0 && (
                <Alert severity="success">
                    {phrase(
                        'ADVERT_IS_COLLECTED_BY_YOU',
                        'Du har hämtat {count} {unit}',
                        {
                            count: advert.meta.collectedByMe,
                            unit: advert.unit,
                        }
                    )}
                </Alert>
            )}
            {!hideTitle && (
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
            )}
            {hideTitle && (
                <Typography variant="subtitle1" color="primary" gutterBottom>
                    {categoryLabel ? `${categoryLabel}, ` : ''}
                    {`${advert.meta.reservableQuantity} ${
                        advert.unit
                    } ${fromNow(advert.createdAt)}`}
                </Typography>
            )}
            {!hideDescription && <Markdown markdown={advert.description} />}
        </>
    )
}
