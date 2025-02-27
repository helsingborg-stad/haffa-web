import { Avatar, Paper, PaperProps, Stack, Typography } from '@mui/material'
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
                <Stack direction="column" spacing={2} height="100%" p={2}>
                    <Typography variant="subtitle1">
                        {phrase(
                            'ADVERT_FIELD_ADDRESS_TITLE',
                            'Adress för avhämtning'
                        )}
                    </Typography>

                    {locations.map(({ name, adress, zipCode, city }, index) => (
                        <Stack direction="row" spacing={1}>
                            <Avatar
                                sx={{
                                    display: { xs: 'none', sm: 'inherit' },
                                    width: 48,
                                    height: 48,
                                }}
                            >
                                <HomeOutlinedIcon />
                            </Avatar>

                            <div key={index}>
                                <Typography>{name}</Typography>
                                <Typography>{adress}</Typography>
                                <Typography>{`${zipCode} ${city}`}</Typography>
                            </div>
                        </Stack>
                    ))}
                </Stack>
            </Paper>
        )
    )
}
