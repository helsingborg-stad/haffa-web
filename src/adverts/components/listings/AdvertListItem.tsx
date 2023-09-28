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
    const imageUrl = advert.images[0]?.url || '/empty-advert.svg'

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
                    }}
                >
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
