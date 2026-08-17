import { Grid } from '@mui/material'
import type { Category } from 'categories/types'
import type { TreeAdapter } from 'lib/types'
import type { FC } from 'react'
import type { Advert } from '../../types'
import { AdvertListItem } from './AdvertListItem'

export const AdvertsList: FC<{
    adverts: Advert[]
    categories: TreeAdapter<Category>
    itemWidth?: { xs: number; sm: number }
}> = ({ adverts, categories, itemWidth = { xs: 6, sm: 3 } }) => (
    <Grid
        container
        alignItems="stretch"
        sx={{ display: 'flex', my: 2 }}
        spacing={2}
    >
        {adverts.map((advert) => (
            <Grid item xs={itemWidth.xs} sm={itemWidth.sm} key={advert.id}>
                <AdvertListItem
                    sx={{ height: '100%' }}
                    advert={advert}
                    categories={categories}
                />
            </Grid>
        ))}
    </Grid>
)
