import { Avatar, Card, CardProps, Grid, Typography } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Advert } from 'adverts'

export const AddressCard = (props: CardProps & { advert: Advert }) => {
    const { adress, zipCode, city } = props.advert.location

    return (
        adress &&
        zipCode &&
        city && (
            <Card {...props}>
                <Grid container>
                    <Grid item p={2}>
                        <Avatar>
                            <HomeOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item pt={2} pb={2}>
                        <Typography variant="subtitle1">
                            Adress för avhämtning
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
