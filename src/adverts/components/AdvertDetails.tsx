import { FC, useContext } from 'react'
import {
    Alert,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    LinearProgress,
    Typography,
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import useAsync from 'hooks/use-async'
import { ErrorView, NotFoundView } from 'errors'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { Advert, AdvertMutationResult } from '../types'
import { PhraseContext } from '../../phrases/PhraseContext'

const AdvertCard: FC<{
    advert: Advert
    error?: string
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, error, onUpdate }) => {
    const { reserveAdvert, cancelAdvertReservation } =
        useContext(AdvertsContext)
    const { EDIT_ADVERT } = useContext(PhraseContext)
    const { meta } = advert
    return (
        <Card>
            <CardContent>
                {error && <Alert severity="error">{error}</Alert>}
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
                <Typography component="p">{advert.description}</Typography>

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
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
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
            <CardActions>
                {meta.canEdit && (
                    <Button
                        color="primary"
                        component={NavLink}
                        to={`/edit-advert/${advert?.id}`}
                    >
                        <EditIcon />
                        {EDIT_ADVERT}
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}

export const AdvertDetails: FC<{ advert: Advert }> = ({ advert }) => {
    const inspect = useAsync<AdvertMutationResult>(async () => ({
        advert,
        status: null,
    }))

    return inspect({
        pending: () => <LinearProgress />,
        rejected: (e) => <ErrorView error={e} />,
        resolved: ({ advert, status }, _, update) =>
            advert ? (
                <AdvertCard
                    advert={advert}
                    error={status?.message}
                    onUpdate={update}
                />
            ) : (
                <NotFoundView />
            ),
    })
}
