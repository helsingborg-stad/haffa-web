import { FC, useContext } from 'react'
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    Typography,
} from '@mui/material'
import { Link } from 'react-router-dom'
import { Markdown } from 'components/Markdown'
import { PhraseContext } from 'phrases/PhraseContext'
import { Advert } from '../../types'

export const AdvertListItem: FC<{ advert: Advert }> = ({ advert }) => {
    const { fromNow } = useContext(PhraseContext)
    const imageUrl = advert.images[0]?.url || null

    return (
        <Card sx={{ mb: 2 }}>
            <CardActionArea
                sx={{ display: 'flex', alignItems: 'stretch' }}
                component={Link}
                to={`/advert/${advert.id}`}
            >
                <CardMedia
                    component="img"
                    sx={{ flexGrow: 1, maxWidth: '33%', m: 1 }}
                    image={imageUrl || '/empty-advert.svg'}
                    alt={advert.title}
                />

                <CardContent sx={{ flexGrow: 2, m: 1 }}>
                    <Grid container flexDirection="column">
                        <Grid item sx={{ flex: 1 }}>
                            <Typography variant="h5" component="div">
                                {advert.title}
                            </Typography>
                            <Markdown markdown={advert.description} />
                        </Grid>

                        <Grid item sx={{ mt: 'auto' }}>
                            <Divider />
                            <Typography
                                color="text.secondary"
                                gutterBottom
                                sx={{ mt: 'auto' }}
                            >
                                {`${advert.meta.reservableQuantity} ${
                                    advert.unit
                                } ${fromNow(advert.createdAt)}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}
