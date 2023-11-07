import { Avatar, Card, CardProps, Grid, Typography } from '@mui/material'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import { Advert } from 'adverts'
import { useContext } from 'react'
import { PhraseContext } from 'phrases'

export const ContactCard = (props: CardProps & { advert: Advert }) => {
    const { phrase } = useContext(PhraseContext)
    const { organization, phone, email } = props.advert.contact

    return (
        email && (
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
                            <ContactMailOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item pt={2} pb={2} pl={1}>
                        <Typography variant="subtitle1">
                            {phrase('ADVERT_FIELD_CONTACT_TITLE', 'Kontakt')}
                        </Typography>
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
