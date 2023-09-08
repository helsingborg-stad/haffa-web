import { Backdrop, Box, Grid } from '@mui/material'
import { Advert } from 'adverts/types'
import { FC, useState } from 'react'

export const ImagesPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const [backdropImage, setBackdropImage] = useState(-1)
    return (
        <Grid container spacing={2}>
            {advert.images.map(({ url }, index) => (
                <Grid key={index} item xs={12} sm={6}>
                    <Box
                        component="img"
                        src={url}
                        sx={{
                            objectFit: 'contain',
                            width: '100%',
                            height: '100%',
                            cursor: 'pointer',
                        }}
                        onClick={() => setBackdropImage(index)}
                    />
                    <Backdrop
                        open={backdropImage === index}
                        onClick={() => setBackdropImage(-1)}
                        sx={{
                            cursor: 'pointer',
                            background: (theme) => theme.palette.primary.light,
                            zIndex: (theme) => theme.zIndex.drawer + 1,
                        }}
                    >
                        <Box
                            component="img"
                            src={url}
                            sx={{
                                objectFit: 'contain',
                                width: '100%',
                                height: '100%',
                            }}
                        />
                    </Backdrop>
                </Grid>
            ))}
        </Grid>
    )
}
