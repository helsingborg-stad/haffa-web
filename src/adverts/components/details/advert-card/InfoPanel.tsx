import { Alert, Typography } from '@mui/material'
import { Advert } from 'adverts'
import { Markdown } from 'components/Markdown'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const InfoPanel: FC<{ advert: Advert; error?: string }> = ({
    advert,
    error,
}) => {
    const { fromNow, phrase } = useContext(PhraseContext)
    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}

            {advert.meta.reservedyMe > 0 && (
                <Alert severity="info">
                    {phrase('', 'Du har haffat {count} {unit}', {
                        count: advert.meta.reservedyMe,
                        unit: advert.unit,
                    })}
                </Alert>
            )}
            {advert.meta.collectedByMe > 0 && (
                <Alert severity="info">
                    {phrase('', 'Du har hämtat {count} {unit}', {
                        count: advert.meta.collectedByMe,
                        unit: advert.unit,
                    })}
                </Alert>
            )}
            <Typography variant="h5" component="div">
                {advert.title}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
                {`${advert.meta.reservableQuantity} ${advert.unit} ${fromNow(
                    advert.createdAt
                )}`}
            </Typography>
            <Markdown markdown={advert.description} />
        </>
    )
}
