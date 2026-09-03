import RecyclingIcon from '@mui/icons-material/Recycling'
import ScheduleIcon from '@mui/icons-material/Schedule'
import {
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Stack,
    type SxProps,
    type Theme,
    Typography,
} from '@mui/material'
import { AdvertImageSettingsContext } from 'branding'
import type { Category } from 'categories/types'
import { isValidString } from 'lib/string-utils'
import type { TreeAdapter } from 'lib/types'
import { PhraseContext } from 'phrases'
import { type FC, useContext } from 'react'
import { Link } from 'react-router-dom'
import type { Advert } from '../../types'

const join = (sep: string, ...parts: (string | number | undefined)[]) =>
    parts.filter((p) => p !== undefined && p !== '').join(sep)

export const AdvertListItem: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
    sx?: SxProps<Theme>
}> = ({ advert, categories, sx }) => {
    const { advertImageAspectRatio } = useContext(AdvertImageSettingsContext)
    const { phrase, prettyDate } = useContext(PhraseContext)
    const imageUrl = advert.images[0]?.url || '/empty-advert.svg'

    const {
        title,
        unit,
        reference,
        meta: {
            reservableQuantity,
            canBook,
            returnInfo,
            isLendingAdvert,
            isReservedBySome,
            isCollectedBySome,
        },
    } = advert

    let aggregatedStatusText = ''
    let backgroundColor = 'success.main'
    if (isCollectedBySome) {
        aggregatedStatusText = phrase('ADVERT_CLAIMS_HAS_COLLECTS', 'Utlånad')
    } else if (isReservedBySome) {
        backgroundColor = 'warning.main'
        aggregatedStatusText = phrase(
            'ADVERT_CLAIMS_HAS_RESERVATIONS',
            'Reserverad'
        )
    }
    const category = categories.findById(advert.category)
    const effectiveCo2kg =
        advert.co2kg > 0 ? advert.co2kg : (category?.co2kg ?? 0)
    const categoryLabel = category?.label

    return (
        <Card
            sx={[
                ...(Array.isArray(sx) ? sx : [sx]),
                { display: 'flex', justifyContent: 'stretch' },
            ]}
        >
            <CardActionArea component={Link} to={`/advert/${advert.id}`}>
                <Stack sx={{ height: '100%' }}>
                    <Box
                        sx={{
                            width: '100%',
                            aspectRatio: advertImageAspectRatio,
                        }}
                    >
                        {isLendingAdvert && !canBook && (
                            <Typography
                                variant="subtitle2"
                                component="div"
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    padding: '4px 0px 4px 12px',
                                    backgroundColor,
                                    color: 'white',
                                }}
                            >
                                {aggregatedStatusText}
                            </Typography>
                        )}
                        <CardMedia
                            component="img"
                            src={imageUrl}
                            alt={title}
                            sx={{
                                aspectRatio: advertImageAspectRatio,
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                        />
                    </Box>
                    <Box sx={{ flex: 1, m: 2 }}>
                        <Typography
                            variant="subtitle2"
                            component="div"
                            sx={{
                                color: 'text.secondary',
                            }}
                        >
                            {categoryLabel || 'Övrigt'}
                        </Typography>
                        <Box sx={{ display: 'grid' }}>
                            <Typography variant="h5" component="div" noWrap>
                                {title}
                            </Typography>
                            {effectiveCo2kg > 0 && (
                                <Typography
                                    component="div"
                                    color="success"
                                    variant="caption"
                                    sx={{
                                        fontSize: 18,
                                    }}
                                >
                                    🌱 {effectiveCo2kg.toLocaleString('sv-SE')}{' '}
                                    <Typography
                                        component="span"
                                        variant="caption"
                                    >
                                        CO₂e
                                    </Typography>
                                </Typography>
                            )}
                        </Box>
                    </Box>
                    <Box sx={{ mx: 2, mb: 3 }}>
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{
                                color: 'text.disabled',
                            }}
                        >
                            {join(
                                ' - ',
                                reservableQuantity > 1
                                    ? join(' ', reservableQuantity, unit)
                                    : '',
                                isValidString(advert.size)
                                    ? join(' ', 'stl', advert.size)
                                    : '',
                                isValidString(reference)
                                    ? join(' ', 'ref', reference)
                                    : ''
                            )}
                        </Typography>
                        {!canBook &&
                            returnInfo.map((info, index) => (
                                <Typography
                                    variant="caption"
                                    component="div"
                                    noWrap
                                    key={index}
                                    sx={{
                                        color: 'text.disabled',
                                        position: 'absolute',
                                        bottom: '4px',
                                    }}
                                >
                                    {phrase(
                                        'ADVERT_WILL_BE_RETURNED',
                                        'Åter {at}',
                                        { at: prettyDate(info.at) }
                                    )}
                                    <ScheduleIcon
                                        sx={{
                                            pl: 0.5,
                                            fontSize: 18,
                                            verticalAlign: 'top',
                                        }}
                                    />
                                </Typography>
                            ))}
                        {returnInfo.length === 0 && isLendingAdvert && (
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{
                                    color: 'text.disabled',
                                    position: 'absolute',
                                    bottom: '4px',
                                }}
                            >
                                {phrase('ADVERT_TYPE_LENDING', 'Utlåning')}
                                <ScheduleIcon
                                    sx={{
                                        pl: 0.5,
                                        fontSize: 18,
                                        verticalAlign: 'top',
                                    }}
                                />
                            </Typography>
                        )}
                        {!isLendingAdvert && (
                            <Typography
                                variant="caption"
                                component="div"
                                sx={{
                                    color: 'text.disabled',
                                    position: 'absolute',
                                    bottom: '4px',
                                }}
                            >
                                {phrase('ADVERT_TYPE_RECYCLE', 'Återbruk')}
                                <RecyclingIcon
                                    sx={{
                                        pl: 0.5,
                                        fontSize: 18,
                                        verticalAlign: 'top',
                                    }}
                                />
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </CardActionArea>
        </Card>
    )
}
