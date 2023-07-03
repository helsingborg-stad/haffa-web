import { FC, useContext } from 'react'
import {
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from '@mui/material'
import { NavLink } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import { Advert } from '../types'
import { PhraseContext } from '../../phrases/PhraseContext'

export const AdvertDetails: FC<{ advert: Advert }> = ({ advert }) => {
    const { EDIT_ADVERT } = useContext(PhraseContext)
    const { meta } = advert
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
                <Typography component="p">{advert.description}</Typography>

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
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <CardActions>
                {meta.canEdit && (
                    <Button
                        color="primary"
                        component={NavLink}
                        to={`/edit-advert/${advert.id}`}
                    >
                        <EditIcon />
                        {EDIT_ADVERT}
                    </Button>
                )}
            </CardActions>
        </Card>
    )
}
