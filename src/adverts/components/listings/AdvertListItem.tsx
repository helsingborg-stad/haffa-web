import { FC } from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Markdown } from 'components/Markdown'
import { Category } from 'categories/types'
import { TreeAdapter } from 'lib/types'
import { Advert } from '../../types'

export const AdvertListItem: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
}> = ({ advert, categories }) => {
    const imageUrl = advert.images[0]?.url || '/empty-advert.svg'

    const categoryLabel = categories.findById(advert.category)?.label

    return (
        <Card sx={{ mb: 2 }}>
            <CardActionArea
                sx={{ display: 'flex', alignItems: 'stretch' }}
                component={Link}
                to={`/advert/${advert.id}`}
            >
                <CardMedia
                    sx={{
                        flexGrow: 1,
                        m: 1,
                        aspectRatio: 1,
                        flex: '1 0 0px',
                        height: 'auto',
                    }}
                >
                    <img
                        src={imageUrl}
                        alt={advert.title}
                        style={{
                            objectFit: 'cover',
                            objectPosition: 'center',
                            overflow: 'hidden',
                            minHeight: '100%',
                            minWidth: '100%',
                            maxWidth: '100%',
                            maxHeight: '100%',
                        }}
                    />
                </CardMedia>
                <CardContent
                    sx={{
                        flexGrow: 2,
                        m: 1,
                        aspectRatio: 2,
                        flex: '2 0 0px',
                        height: 'auto',
                        overflow: 'hidden',
                        maxWidth: '768px',

                        maskImage:
                            'linear-gradient(180deg, #000 60%, transparent)',
                    }}
                >
                    <Typography variant="h5" component="div">
                        {advert.title}
                    </Typography>
                    <Typography
                        variant="subtitle1"
                        component="div"
                        color="primary"
                    >
                        {categoryLabel ? `${categoryLabel},` : ''}
                        {advert.meta.reservableQuantity} {advert.unit}
                    </Typography>
                    <Markdown markdown={advert.description} />
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
