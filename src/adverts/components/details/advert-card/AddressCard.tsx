import { Avatar, Card, CardProps, Grid, Typography } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Advert } from 'adverts'
import { useContext } from 'react'
import { PhraseContext } from 'phrases'

export const AddressCard = (props: CardProps & { advert: Advert }) => {
    const { phrase } = useContext(PhraseContext)
    const { adress, zipCode, city } = props.advert.location

    return (
        adress &&
        zipCode &&
        city && (
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
                            <HomeOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item pt={2} pb={2} pl={1}>
                        <Typography variant="subtitle1">
                            {phrase(
                                'ADVERT_FIELD_ADDRESS_TITLE',
                                'Adress för avhämtning'
                            )}
                        </Typography>
                        <Typography variant="body2">{adress}</Typography>
                        <Typography variant="body2">
                            {`${zipCode} ${city}`}
                        </Typography>
                    </Grid>
                </Grid>
            </Card>
        )
    )
}
