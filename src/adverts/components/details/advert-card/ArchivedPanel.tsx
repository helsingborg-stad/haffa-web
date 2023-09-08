import { Alert, Button, Grid } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { Typography } from 'antd'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

export const ArchivedPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const { unarchiveAdvert } = useContext(AdvertsContext)
    return advert.meta.canUnarchive ? (
        <Alert severity="info">
            <Grid container flexDirection="row" flex={1}>
                <Grid item xs={12}>
                    <Typography>
                        {phrase(
                            '',
                            'Annonsen är arkiverad och syns inte i annonsflödet'
                        )}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button
                        fullWidth
                        variant="outlined"
                        sx={{ ml: 'auto' }}
                        color="primary"
                        onClick={async () =>
                            onUpdate(unarchiveAdvert(advert.id))
                        }
                    >
                        {phrase('', 'Återställ')}
                    </Button>
                </Grid>
            </Grid>
        </Alert>
    ) : null
}
