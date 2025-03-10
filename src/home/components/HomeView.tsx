import { Grid } from '@mui/material'
import { ViewComposition } from 'content/types'
import { ContentCard } from 'content/components/ContentCard'
import { Fragment } from 'react'

export const HomeView = (props: { composition: ViewComposition }) => (
    <Grid container rowSpacing={3} columnSpacing={3}>
        {props.composition.rows.map((row, index) => (
            <Fragment key={index}>
                {row.columns.map((column, index) => (
                    <Grid key={index} item xs={12} md={12 / row.columns.length}>
                        <ContentCard module={column.module} />
                    </Grid>
                ))}
            </Fragment>
        ))}
    </Grid>
)
