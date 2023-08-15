import {
    Button,
    Grid,
    LinearProgress,
    TextField,
    Typography,
} from '@mui/material'
import { Advert, AdvertsContext } from 'adverts'
import { ErrorAlert } from 'errors/ErrorAlert'
import useAsync from 'hooks/use-async'
import { FC, useContext, useState } from 'react'
import { Markdown } from 'components/Markdown'
import { PhraseContext } from 'phrases/PhraseContext'

const Details: FC<{
    advert: Advert
    onCollect: (quantity: number) => void
}> = ({ advert, onCollect }) => {
    const { phrase, PICKUP_ADVERT } = useContext(PhraseContext)
    const [quantity, setQuantity] = useState(advert.meta.collectableQuantity)
    return (
        <>
            <Typography variant="h5" component="div">
                {advert.title}
            </Typography>
            <Markdown markdown={advert.description} />
            <Grid container spacing={2} sx={{ p: 2 }}>
                <TextField
                    type="number"
                    value={quantity}
                    label={phrase('', 'Antal')}
                    placeholder={phrase('', 'Antal')}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                />
                <Button
                    color="primary"
                    variant="outlined"
                    disabled={!advert.meta.canCollect}
                    onClick={() => onCollect(quantity)}
                >
                    {PICKUP_ADVERT}
                </Button>
            </Grid>
        </>
    )
}

export const StepConfirmPickup: FC<{ qrCode: string }> = ({ qrCode }) => {
    const { getAdvert, collectAdvert } = useContext(AdvertsContext)
    const render = useAsync<Advert, string>(() => getAdvert(qrCode))

    return render({
        rejected: (error) => <ErrorAlert error={error} />,
        pending: () => <LinearProgress />,
        resolved: (advert, _, update) => (
            <Details
                advert={advert}
                onCollect={(quantity) =>
                    update(
                        collectAdvert(advert.id, quantity).then(
                            ({ advert }) => advert
                        )
                    )
                }
            />
        ),
    })
}
