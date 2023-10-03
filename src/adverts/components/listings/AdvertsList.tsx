import { FC } from 'react'
import { TreeAdapter } from 'lib/types'
import { Category } from 'categories/types'
import { Advert } from '../../types'
import { AdvertListItem } from './AdvertListItem'

export const AdvertsList: FC<{
    adverts: Advert[]
    categories: TreeAdapter<Category>
}> = ({ adverts, categories }) => (
    <>
        {adverts.map((advert) => (
            <AdvertListItem
                key={advert.id}
                advert={advert}
                categories={categories}
            />
        ))}
    </>
)
