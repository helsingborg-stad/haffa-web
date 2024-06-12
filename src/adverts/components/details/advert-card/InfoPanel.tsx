import { Alert, Box, Typography, useTheme } from '@mui/material'
import { Advert } from 'adverts'
import { Category } from 'categories/types'
import { Markdown } from 'components/Markdown'
import { TreeAdapter } from 'lib/types'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import { lightGreen } from '@mui/material/colors'

const Descriptions: FC<{ advert: Advert; category: Category | null }> = ({
    advert,
    category,
}) => {
    const { palette } = useTheme()
    return (
        <>
            <Markdown markdown={advert.description} />
            {category && category.co2kg > 0 && (
                <Box
                    sx={{
                        mb: 2,
                        p: 1,
                        borderRadius: '20px',
                        background: `linear-gradient(90deg, ${lightGreen[50]} 20%, ${palette.background.paper} 80%)`,
                    }}
                >
                    <Typography>
                        🌱 Denna vara sparar <b>{category.co2kg} kg</b> CO₂e
                    </Typography>
                </Box>
            )}
            <Typography gutterBottom>
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
        </>
    )
}

const Notifications: FC<{ advert: Advert }> = ({ advert }) => {
    const { phrase, prettyDate } = useContext(PhraseContext)
    const myReturns = advert.meta.returnInfo
        .filter(({ isMine }) => isMine)
        .map(({ at, quantity }) => (
            <Alert severity="success">
                {phrase(
                    'ADVERT_IS_BORROWED_BY_YOU',
                    'Du har lånat {count} {unit} till och med {at}',
                    {
                        count: quantity,
                        unit: advert.unit,
                        at: prettyDate(at),
                    }
                )}
            </Alert>
        ))
    const myCollects = myReturns.length === 0 &&
        advert.meta.collectedByMe > 0 && (
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
        )

    return (
        <>
            {myReturns}
            {myCollects}
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
        </>
    )
}
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
    const category = categories.findById(advert.category)

    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}

            {!hideTitle && (
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
            )}
            {!hideDescription && (
                <Descriptions advert={advert} category={category} />
            )}
            {!hideNotifications && <Notifications advert={advert} />}
        </>
    )
}
