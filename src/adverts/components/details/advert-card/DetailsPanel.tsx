import { Grid, GridProps, Typography } from '@mui/material'
import { getField } from 'advert-field-config/repository/mappers'
import { AdvertFieldConfig, FieldConfig } from 'advert-field-config/types'
import { Advert } from 'adverts'
import { isValidString } from 'lib/string-utils'
import { PhraseContext } from 'phrases'
import { Fragment, useContext } from 'react'

export const DetailsPanel = (
    props: GridProps & { advert: Advert; fields: AdvertFieldConfig }
) => {
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
        stockItem,
    } = props.advert

    type FieldData = {
        field: FieldConfig
        value: string
    }
    const mapper = [
        { field: getField(props.fields, 'size'), value: size },
        { field: getField(props.fields, 'height'), value: height },
        { field: getField(props.fields, 'width'), value: width },
        { field: getField(props.fields, 'depth'), value: depth },
        { field: getField(props.fields, 'weight'), value: weight },
        { field: getField(props.fields, 'material'), value: material },
        { field: getField(props.fields, 'condition'), value: condition },
        { field: getField(props.fields, 'usage'), value: usage },
        { field: getField(props.fields, 'reference'), value: reference },
        {
            field: getField(props.fields, 'stockItem'),
            value: stockItem === true ? 'Ja' : 'Nej',
        },
    ].filter((a) => isValidString(a.value) && a.field.visible)

    const format = (field: FieldData) =>
        `${field.value} ${field.field.adornment}`.trim()
    return (
        <>
            <Typography gutterBottom variant="h6">
                {phrase('ADVERT_FIELD_HEADING', 'Produktinformation')}
            </Typography>
            <Grid container columns={2} pb={2}>
                {mapper.map((v, key) => (
                    <Fragment key={key}>
                        <Grid item xs={1}>
                            {v.field.label}
                        </Grid>
                        <Grid item xs={1} textAlign="right">
                            {format(v)}
                        </Grid>
                    </Fragment>
                ))}
                <Fragment key="ADVERT_FIELD_CREATED">
                    <Grid item xs={1}>
                        {phrase('ADVERT_FIELD_CREATED', 'Publicerades')}
                    </Grid>
                    <Grid item xs={1} textAlign="right">
                        {fromNow(createdAt)}
                    </Grid>
                </Fragment>
            </Grid>
        </>
    )
}
