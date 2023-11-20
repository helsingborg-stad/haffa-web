import { Avatar, Grid, Paper, PaperProps, Typography } from '@mui/material'
import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import { Advert } from 'adverts'
import { useContext } from 'react'
import { PhraseContext } from 'phrases'

export const ContactCard = (props: PaperProps & { advert: Advert }) => {
    const { phrase } = useContext(PhraseContext)
    const { organization, phone, email } = props.advert.contact

    return (
        email && (
            <Paper {...props}>
                <Grid
                    container
                    p={2}
                    spacing={2}
                    height="100%"
                    alignItems="center"
                >
                    <Grid item sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                                color: 'black',
                            }}
                        >
                            <ContactMailOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">
                            {phrase('ADVERT_FIELD_CONTACT_TITLE', 'Kontakt')}
                        </Typography>
                        <Typography>{email}</Typography>
                        {phone && <Typography>{phone}</Typography>}
                        {organization && (
                            <Typography>{organization}</Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        )
    )
}
