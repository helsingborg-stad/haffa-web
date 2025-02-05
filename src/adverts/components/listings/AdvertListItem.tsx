import { FC, useContext } from 'react'
import {
    Box,
    Card,
    CardActionArea,
    CardMedia,
    Grid,
    SxProps,
    Theme,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Category } from 'categories/types'
import { TreeAdapter } from 'lib/types'
import { PhraseContext } from 'phrases'
import RecyclingIcon from '@mui/icons-material/Recycling'
import { isValidString } from 'lib/string-utils'
import { AdvertImageSettingsContext } from 'branding'
import ScheduleIcon from '@mui/icons-material/Schedule'
import { Advert } from '../../types'

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
    const categoryLabel = categories.findById(advert.category)?.label
    return (
        <Card
            sx={{
                ...sx,
                display: 'flex',
                justifyContent: 'stretch',
            }}
        >
            <CardActionArea component={Link} to={`/advert/${advert.id}`}>
                <Grid container direction="column" sx={{ height: '100%' }}>
                    <Grid
                        item
                        sx={{
                            width: '100%',
                            aspectRatio: advertImageAspectRatio,
                        }}
                    >
                        {isLendingAdvert && !canBook && (
                            <Typography
                                variant="subtitle2"
                                color="white"
                                component="div"
                                sx={{
                                    position: 'absolute',
                                    width: '100%',
                                    padding: '4px 0px 4px 12px',
                                    backgroundColor,
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
                    </Grid>
                    <Grid item sx={{ flex: 1, m: 2 }}>
                        <Typography
                            variant="subtitle2"
                            color="text.secondary"
                            component="div"
                        >
                            {categoryLabel || 'Övrigt'}
                        </Typography>
                        <Box sx={{ display: 'grid' }}>
                            <Typography variant="h5" component="div" noWrap>
                                {title}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item sx={{ mx: 2, mb: 3 }}>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div"
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
                                    color="text.disabled"
                                    component="div"
                                    noWrap
                                    key={index}
                                    position="absolute"
                                    bottom="4px"
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
                                color="text.disabled"
                                component="div"
                                position="absolute"
                                bottom="4px"
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
                                color="text.disabled"
                                component="div"
                                position="absolute"
                                bottom="4px"
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
                    </Grid>
                </Grid>
            </CardActionArea>
        </Card>
    )
}
