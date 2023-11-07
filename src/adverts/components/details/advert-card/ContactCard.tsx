import { Avatar, Card, CardProps, Grid, Typography } from '@mui/material'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import { Advert } from 'adverts'

export const ContactCard = (props: CardProps & { advert: Advert }) => {
    const { organization, phone, email } = props.advert.contact

    return (
        email && (
            <Card {...props}>
                <Grid container>
                    <Grid item p={2}>
                        <Avatar>
                            <ContactMailOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item pt={2} pb={2}>
                        <Typography variant="subtitle1">Kontakt</Typography>
                        <Typography variant="body2">{email}</Typography>
                        {phone && (
                            <Typography variant="body2">{phone}</Typography>
                        )}
                        {organization && (
                            <Typography variant="body2">
                                {organization}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
            </Card>
        )
    )
}
