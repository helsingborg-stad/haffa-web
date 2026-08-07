import { Box, Stack, type StackProps, Typography } from '@mui/material'
import { getField } from 'advert-field-config/repository/mappers'
import type { AdvertFieldConfig, FieldConfig } from 'advert-field-config/types'
import type { Advert } from 'adverts'
import { isValidString } from 'lib/string-utils'
import { PhraseContext } from 'phrases'
import { Fragment, useContext } from 'react'

export const DetailsPanel = (
    props: StackProps & { advert: Advert; fields: AdvertFieldConfig }
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
        lendingPeriod,
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
            field: getField(props.fields, 'lendingPeriod'),
            value: lendingPeriod > 0 ? String(lendingPeriod) : '',
        },
    ].filter((a) => isValidString(a.value) && a.field.visible)

    const format = (field: FieldData) =>
        `${field.value} ${field.field.adornment}`.trim()
    return (
        <>
            <Typography gutterBottom variant="h6">
                {phrase('ADVERT_FIELD_HEADING', 'Produktinformation')}
            </Typography>
            <Stack spacing={0.5} sx={{ pb: 2 }}>
                {mapper.map((v, key) => (
                    <Fragment key={key}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                            <Box>{v.field.label}</Box>
                            <Box sx={{ textAlign: 'right' }}>{format(v)}</Box>
                        </Box>
                    </Fragment>
                ))}
                <Fragment key="ADVERT_FIELD_CREATED">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                        <Box>{phrase('ADVERT_FIELD_CREATED', 'Publicerades')}</Box>
                        <Box sx={{ textAlign: 'right' }}>{fromNow(createdAt)}</Box>
                    </Box>
                </Fragment>
            </Stack>
        </>
    )
}
