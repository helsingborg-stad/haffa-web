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
    hideNotifications?: boolean
}> = ({
    advert,
    categories,
    error,
    hideTitle,
    hideDescription,
    hideNotifications,
}) => {
    const { fromNow, phrase } = useContext(PhraseContext)
    const category = categories.findById(advert.category)
    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}

            {!hideTitle && (
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
            )}
            {!hideDescription && <Markdown markdown={advert.description} />}
            {!hideDescription && (
                <Typography variant="body2" gutterBottom>
                    {category ? `${category.label} | ` : ''}
                    {`${advert.meta.reservableQuantity} ${
                        advert.unit
                    } ${fromNow(advert.createdAt)}`}{' '}
                    {category?.co2kg
                        ? `| Sparar ${category?.co2kg} kg CO2`
                        : ''}
                </Typography>
            )}
            {!hideNotifications && advert.meta.reservedyMe > 0 && (
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
            {!hideNotifications && advert.meta.collectedByMe > 0 && (
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
        </>
    )
}
