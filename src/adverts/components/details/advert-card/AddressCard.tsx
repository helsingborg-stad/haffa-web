import { Avatar, Grid, Paper, PaperProps, Typography } from '@mui/material'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import { Advert, AdvertLocation } from 'adverts'
import { FC, useContext } from 'react'
import { PhraseContext } from 'phrases'

export const AddressCard: FC<
    PaperProps & { advert: Advert; locations: AdvertLocation[] }
> = ({ advert, locations, ...props }) => {
    const { phrase } = useContext(PhraseContext)

    return (
        locations.length > 0 && (
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
                    </Grid>
                    {locations.map(({ name, adress, zipCode, city }, index) => (
                        <Grid item key={index}>
                            <Typography>{name}</Typography>
                            <Typography>{adress}</Typography>
                            <Typography>{`${zipCode} ${city}`}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Paper>
        )
    )
}
