import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined'
import {
    Avatar,
    Paper,
    type PaperProps,
    Stack,
    Typography,
} from '@mui/material'
import type { Advert, AdvertLocation } from 'adverts'
import { PhraseContext } from 'phrases'
import { type FC, useContext } from 'react'

export const AddressCard: FC<
    PaperProps & { advert: Advert; locations: AdvertLocation[] }
> = ({ advert, locations, ...props }) => {
    const { phrase } = useContext(PhraseContext)

    return (
        locations.length > 0 && (
            <Paper {...props}>
                <Stack direction="column" spacing={2} sx={{ height: '100%', p: 2 }}>
                    <Typography variant="subtitle1">
                        {phrase(
                            'ADVERT_FIELD_ADDRESS_TITLE',
                            'Adress för avhämtning'
                        )}
                    </Typography>

                    {locations.map(({ name, adress, zipCode, city }, index) => (
                        <Stack key={index} direction="row" spacing={1}>
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
