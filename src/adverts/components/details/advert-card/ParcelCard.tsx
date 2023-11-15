import { Avatar, Card, CardProps, Grid, Typography } from '@mui/material'
import { Advert } from 'adverts'
import { useContext, useMemo } from 'react'
import { PhraseContext } from 'phrases'

import LocalShippingIcon from '@mui/icons-material/LocalShipping'

export const ParcelCard = (props: CardProps & { advert: Advert }) => {
    const { phrase } = useContext(PhraseContext)
    const { width, height, depth, weight } = props.advert

    const infos = useMemo(
        () =>
            [
                { value: width, label: phrase('ADVERT_FIELD_WIDTH', 'Bredd') },
                { value: height, label: phrase('ADVERT_FIELD_HEIGHT', 'Höjd') },
                { value: depth, label: phrase('ADVERT_FIELD_DEPTH', 'Djup') },
                { value: weight, label: phrase('ADVERT_FIELD_WEIGHT', 'Vikt') },
            ].filter((v) => v.value.trim()),
        [width, height, depth, weight]
    )

    return (
        infos.length > 0 && (
            <Card {...props}>
                <Grid container height="100%" alignItems="center">
                    <Grid item p={2}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                color: 'black',
                                bgcolor: '#f6f3eb',
                            }}
                        >
                            <LocalShippingIcon />
                        </Avatar>
                    </Grid>
                    <Grid item pt={2} pb={2} pl={1}>
                        {infos.map(({ label, value }, index) => (
                            <Typography key={index}>
                                {`${label}: ${value}`}
                            </Typography>
                        ))}
                    </Grid>
                </Grid>
            </Card>
        )
    )
}
