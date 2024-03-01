import { Alert, Box, Typography } from '@mui/material'
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
    const { phrase } = useContext(PhraseContext)
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
                <Typography gutterBottom>
                    {category && category.co2kg > 0 && (
                        <Box
                            sx={{
                                mb: 2,
                                p: 1,
                                borderRadius: '20px',
                                background:
                                    'linear-gradient(90deg, rgba(210,231,195,1) 0%, rgba(239,242,234,1) 35%, rgba(255,255,255,1) 100%)',
                            }}
                        >
                            <Typography>
                                🌱 Denna vara sparar <b>{category.co2kg} kg</b>{' '}
                                CO₂e
                            </Typography>
                        </Box>
                    )}

                    {category && (
                        <>
                            {category.label}
                            <Typography
                                color="text.disabled"
                                component="span"
                                sx={{ pl: 1, pr: 1 }}
                            >
                                |
                            </Typography>
                        </>
                    )}
                    {`${advert.meta.reservableQuantity} ${advert.unit}`}
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
