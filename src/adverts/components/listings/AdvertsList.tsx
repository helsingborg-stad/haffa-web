import { Box } from '@mui/material'
import type { Category } from 'categories/types'
import type { TreeAdapter } from 'lib/types'
import type { FC } from 'react'
import type { Advert } from '../../types'
import { AdvertListItem } from './AdvertListItem'

export const AdvertsList: FC<{
    adverts: Advert[]
    categories: TreeAdapter<Category>
}> = ({ adverts, categories }) => (
    <Box
        sx={{
            display: 'grid',
            my: 2,
            gap: 2,
            gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
            },
            alignItems: 'stretch',
        }}
    >
        {adverts.map((advert) => (
            <Box key={advert.id}>
                <AdvertListItem
                    sx={{ height: '100%' }}
                    advert={advert}
                    categories={categories}
                />
            </Box>
        ))}
    </Box>
)
