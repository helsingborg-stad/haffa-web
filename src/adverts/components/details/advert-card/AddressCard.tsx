import { Avatar, Grid, Paper, PaperProps, Typography } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Advert } from 'adverts'
import { useContext } from 'react'
import { PhraseContext } from 'phrases'

export const AddressCard = (props: PaperProps & { advert: Advert }) => {
    const { phrase } = useContext(PhraseContext)
    const { adress, zipCode, city } = props.advert.location

    return (
        adress &&
        zipCode &&
        city && (
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
                            <HomeOutlinedIcon />
                        </Avatar>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">
                            {phrase(
                                'ADVERT_FIELD_ADDRESS_TITLE',
                                'Adress för avhämtning'
                            )}
                        </Typography>
                        <Typography>{adress}</Typography>
                        <Typography>{`${zipCode} ${city}`}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        )
    )
}
