import { FC } from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Advert } from '../types'

export const AdvertListItem: FC<{ advert: Advert }> = ({ advert }) => {
    const imageUrl = advert.images[0]?.url || null
    return (
        <Card sx={{ mb: 2 }}>
            <CardActionArea
                sx={{ display: 'flex' }}
                component={Link}
                to={`/advert/${advert.id}`}
            >
                {imageUrl && (
                    <CardMedia
                        component="img"
                        sx={{ flexGrow: 1, maxWidth: '30%', m: 3 }}
                        image={imageUrl}
                        alt={advert.title}
                    />
                )}
                <CardContent sx={{ flexGrow: 2 }}>
                    <Typography variant="h5" component="div">
                        {advert.title}
                    </Typography>
                    <Typography component="p">{advert.description}</Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
