import { FC } from 'react'
import { TreeAdapter } from 'lib/types'
import { Category } from 'categories/types'
import { Grid } from '@mui/material'
import { Advert } from '../../types'
import { AdvertListItem } from './AdvertListItem'

export const AdvertsList: FC<{
    adverts: Advert[]
    categories: TreeAdapter<Category>
}> = ({ adverts, categories }) => (
    <Grid
        container
        alignItems="stretch"
        sx={{ display: 'flex', my: 2 }}
        spacing={2}
    >
        {adverts.map((advert) => (
            <Grid item xs={6} sm={3}>
                <AdvertListItem
                    sx={{ height: '100%' }}
                    advert={advert}
                    categories={categories}
                />
            </Grid>
        ))}
    </Grid>
)
