import { Grid } from '@mui/material'
import type { Category } from 'categories/types'
import type { TreeAdapter } from 'lib/types'
import type { FC } from 'react'
import type { Advert } from '../../types'
import { AdvertListItem } from './AdvertListItem'

export const AdvertsList: FC<{
    adverts: Advert[]
    categories: TreeAdapter<Category>
}> = ({ adverts, categories }) => (
    <Grid
        container
        sx={{ display: 'flex', alignItems: 'stretch', my: 2 }}
        spacing={2}
    >
        {adverts.map((advert) => (
            <Grid size={{ xs: 6, sm: 3 }} key={advert.id}>
                <AdvertListItem
                    sx={{ height: '100%' }}
                    advert={advert}
                    categories={categories}
                />
            </Grid>
        ))}
    </Grid>
)
