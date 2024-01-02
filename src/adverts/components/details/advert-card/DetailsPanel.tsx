import { Grid, GridProps, Typography } from '@mui/material'
import { Advert } from 'adverts'
import { PhraseContext } from 'phrases'
import { Fragment, useContext } from 'react'

export const DetailsPanel = (props: GridProps & { advert: Advert }) => {
    const { phrase, fromNow } = useContext(PhraseContext)

    const {
        condition,
        depth,
        height,
        width,
        weight,
        size,
        material,
        usage,
        reference,
        createdAt,
    } = props.advert

    const fields = [
        [size, phrase('ADVERT_FIELD_SIZE', 'Storlek')],
        [height, phrase('ADVERT_FIELD_HEIGHT', 'Höjd')],
        [width, phrase('ADVERT_FIELD_WIDTH', 'Bredd')],
        [depth, phrase('ADVERT_FIELD_DEPTH', 'Djup')],
        [weight, phrase('ADVERT_FIELD_WEIGHT', 'Vikt')],
        [material, phrase('ADVERT_FIELD_MATERIAL', 'Material')],
        [condition, phrase('ADVERT_FIELD_CONDITION', 'Skick')],
        [usage, phrase('ADVERT_FIELD_USAGE', 'Användning')],
        [reference, phrase('ADVERT_FIELD_REFERENCE', 'Egen referens')],
        [fromNow(createdAt), phrase('ADVERT_FIELD_CREATED', 'Publicerades')],
    ].filter(([item]) => item)

    return (
        <>
            <Typography gutterBottom variant="h6">
                {phrase('ADVERT_FIELD_HEADING', 'Produktinformation')}
            </Typography>
            <Grid container columns={2} pb={2}>
                {fields.map(([value, label], key) => (
                    <Fragment key={key}>
                        <Grid item xs={1}>
                            {label}
                        </Grid>
                        <Grid item xs={1} textAlign="right">
                            {value}
                        </Grid>
                    </Fragment>
                ))}
            </Grid>
        </>
    )
}
