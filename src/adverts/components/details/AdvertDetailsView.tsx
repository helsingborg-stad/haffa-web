import { FC } from 'react'
import { LinearProgress } from '@mui/material'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { Category } from 'categories/types'
import { createTreeAdapter } from 'lib/tree-adapter'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { Advert, AdvertMutationResult } from '../../types'
import { AdvertCard } from './advert-card/AdvertCard'

export const AdvertDetailsView: FC<{
    advert: Advert
    categories: Category[]
    fields: AdvertFieldConfig
}> = ({ advert, categories, fields }) => {
    const inspect = useAsync<AdvertMutationResult>(async () => ({
        advert,
        categories,
        fields,
        status: null,
    }))

    return inspect({
        pending: () => <LinearProgress />,
        rejected: (e) => <ErrorView error={e} />,
        resolved: ({ advert, status }, _, update) => (
            <AdvertCard
                advert={advert}
                categories={createTreeAdapter(
                    categories,
                    (c) => c.id,
                    (c) => c.parentId,
                    (c) => c.categories
                )}
                fields={fields}
                error={status?.message}
                onUpdate={update}
            />
        ),
    })
}
