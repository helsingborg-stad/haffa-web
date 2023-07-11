import { FC, useContext, useState } from 'react'
import {
    Alert,
    Backdrop,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from '@mui/material'
import { NavLink, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Delete'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { Markdown } from 'components/Markdown'
import { Advert, AdvertMutationResult } from '../../types'
import { PhraseContext } from '../../../phrases/PhraseContext'

export const AdvertCard: FC<{
    advert: Advert
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, error, onUpdate }) => {
    const { removeAdvert, reserveAdvert, cancelAdvertReservation } =
        useContext(AdvertsContext)
    const { fromNow, EDIT_ADVERT, REMOVE_ADVERT } = useContext(PhraseContext)
    const [backdropImage, setBackdropImage] = useState(-1)
    const { meta } = advert
    const navigate = useNavigate()
    return (
        <Card sx={{ mb: 2 }}>
            <CardContent>
                {error && <Alert severity="error">{error}</Alert>}
                <Typography color="text.secondary" gutterBottom>
                    {`${advert.meta.reservableQuantity} ${
                        advert.unit
                    } ${fromNow(advert.createdAt)}`}
                </Typography>
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
                <Markdown markdown={advert.description} />
            </CardContent>
            <CardContent>
                <Grid container spacing={2} xs={12} sx={{ p: 2 }}>
                    <Button
                        fullWidth
                        color="primary"
                        variant="outlined"
                        disabled={!meta.canReserve}
                        onClick={() => onUpdate(reserveAdvert(advert.id, 1))}
                    >
                        HAFFA!
                    </Button>
                    {meta.canCancelReservation && (
                        <Button
                            fullWidth
                            color="primary"
                            variant="outlined"
                            onClick={() =>
                                onUpdate(cancelAdvertReservation(advert.id))
                            }
                        >
                            Ångra mina haffningar!
                        </Button>
                    )}
                </Grid>
            </CardContent>
            <CardContent>
                <Grid container spacing={2} xs={12}>
                    {advert.images.map(({ url }, index) => (
                        <Grid key={index} item xs={12} sm={6}>
                            <Box
                                component="img"
                                src={url}
                                sx={{
                                    objectFit: 'contain',
                                    width: '100%',
                                    height: '100%',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setBackdropImage(index)}
                            />
                            <Backdrop
                                open={backdropImage === index}
                                onClick={() => setBackdropImage(-1)}
                                sx={{
                                    cursor: 'pointer',
                                    background: (theme) =>
                                        theme.palette.primary.light,
                                    zIndex: (theme) => theme.zIndex.drawer + 1,
                                }}
                            >
                                <Box
                                    component="img"
                                    src={url}
                                    sx={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </Backdrop>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <CardActions>
                {meta.canEdit && (
                    <Button
                        color="primary"
                        component={NavLink}
                        to={`/advert/edit/${advert?.id}`}
                    >
                        <EditIcon />
                        {EDIT_ADVERT}
                    </Button>
                )}
                {meta.canRemove && (
                    <Button
                        sx={{ ml: 'auto' }}
                        color="primary"
                        onClick={async () =>
                            onUpdate(
                                removeAdvert(advert.id).then((r) => {
                                    navigate('/')
                                    return r
                                })
                            )
                        }
                    >
                        <RemoveIcon /> {REMOVE_ADVERT}
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}
