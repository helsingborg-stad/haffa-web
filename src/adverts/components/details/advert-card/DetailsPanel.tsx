import { Grid, GridProps, Typography } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases'
import { useContext } from 'react'

export const DetailsPanel = (props: GridProps & { advert: Advert }) => {
    const { phrase, fromNow } = useContext(PhraseContext)

    const {
        condition,
        depth,
        height,
        width,
        weight,
        material,
        usage,
        createdAt,
    } = props.advert

    const fields = [
        [height, phrase('ADVERT_FIELD_HEIGHT', 'Höjd')],
        [width, phrase('ADVERT_FIELD_WIDTH', 'Bredd')],
        [depth, phrase('ADVERT_FIELD_DEPTH', 'Djup')],
        [weight, phrase('ADVERT_FIELD_WEIGHT', 'Vikt')],
        [material, phrase('ADVERT_FIELD_MATERIAL', 'Material')],
        [condition, phrase('ADVERT_FIELD_CONDITION', 'Skick')],
        [usage, phrase('ADVERT_FIELD_USAGE', 'Användning')],
        [fromNow(createdAt), phrase('ADVERT_FIELD_CREATED', 'Publicerades')],
    ].filter((item) => item[0])

    return (
        <>
            <Typography gutterBottom variant="h6">
                Produktinformation
            </Typography>
            <Typography component="span">
                <Grid container columns={2} pb={2}>
                    {fields.map(([value, label]) => (
                        <>
                            <Grid xs={1} item>
                                {label}
                            </Grid>
                            <Grid xs={1} textAlign="right" item>
                                {value}
                            </Grid>
                        </>
                    ))}
                </Grid>
            </Typography>
        </>
    )
}
