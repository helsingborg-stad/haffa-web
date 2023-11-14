import { FC, useContext } from 'react'
import {
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
import { Advert } from '../../types'

const join = (sep: string, ...parts: (string | number | undefined)[]) =>
    parts.filter((p) => p !== undefined && p !== '').join(sep)

export const AdvertListItem: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
    sx?: SxProps<Theme>
}> = ({ advert, categories, sx }) => {
    const { phrase } = useContext(PhraseContext)
    const imageUrl = advert.images[0]?.url || '/empty-advert.svg'

    const {
        title,
        unit,
        meta: { reservableQuantity },
    } = advert
    const categoryLabel = categories.findById(advert.category)?.label

    return (
        <Card sx={{ ...sx, display: 'flex', justifyContent: 'stretch' }}>
            <CardActionArea component={Link} to={`/advert/${advert.id}`}>
                <Grid container direction="column" sx={{ height: '100%' }}>
                    <Grid item sx={{ width: '100%', aspectRatio: 4 / 3 }}>
                        <CardMedia
                            component="img"
                            src={imageUrl}
                            alt={title}
                            sx={{
                                aspectRatio: 4 / 3,
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
                        <Typography variant="h5" component="div">
                            {title}
                        </Typography>
                    </Grid>
                    <Grid item sx={{ mx: 2, mb: 2 }}>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div"
                        >
                            {join(', ', join(' ', reservableQuantity, unit))}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.disabled"
                            component="div"
                        >
                            {phrase(
                                `ADVERT_TYPE_${advert.type.toUpperCase()}`,
                                'Återbruk'
                            )}
                            <RecyclingIcon
                                sx={{
                                    pl: 0.5,
                                    fontSize: 18,
                                    verticalAlign: 'middle',
                                }}
                            />
                        </Typography>
                    </Grid>
                </Grid>
            </CardActionArea>
        </Card>
    )
}
