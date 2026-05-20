import ContactMailOutlinedIcon from '@mui/icons-material/ContactMailOutlined'
import {
    Avatar,
    Grid,
    Link,
    Paper,
    type PaperProps,
    Typography,
} from '@mui/material'
import type { Advert } from 'adverts'
import { PhraseContext } from 'phrases'
import { useContext } from 'react'

export const ContactCard = (props: PaperProps & { advert: Advert }) => {
    const { phrase } = useContext(PhraseContext)
    const { organization, phone, email } = props.advert.contact

    return (
        email && (
            <Paper {...props}>
                <Grid
                    container
                    spacing={2}
                    sx={{ p: 2, height: '100%', alignItems: 'center' }}
                >
                    <Grid sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Avatar
                            sx={{
                                width: 48,
                                height: 48,
                            }}
                        >
                            <ContactMailOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid>
                        <Typography variant="subtitle1">
                            {phrase('ADVERT_FIELD_CONTACT_TITLE', 'Kontakt')}
                        </Typography>
                        <Typography>
                            <Link href={`mailto:${email}`}>{email}</Link>
                        </Typography>
                        {phone
                            ?.split(',')
                            .map((v) => v.trim())
                            .filter((v) => v.length > 0)
                            .map((v, key) => (
                                <Typography key={key}>
                                    <Link href={`tel:${v}`}>{v}</Link>
                                </Typography>
                            ))}
                        {organization && (
                            <Typography>{organization}</Typography>
                        )}
                    </Grid>
                </Grid>
            </Paper>
        )
    )
}
