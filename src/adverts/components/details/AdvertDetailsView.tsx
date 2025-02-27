import { FC, useContext } from 'react'
import { LinearProgress } from '@mui/material'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { Category } from 'categories/types'
import { createTreeAdapter } from 'lib/tree-adapter'
import { AdvertFieldConfig } from 'advert-field-config/types'
import { Terms } from 'terms/types'
import { TagDescription } from 'tags/types'
import { AuthContext } from 'auth'
import { getEffectiveTagDescriptions } from 'tags'
import { PickupLocation } from 'pickup-locations/types'
import { Advert, AdvertMutationResult } from '../../types'
import { AdvertCard } from './advert-card/AdvertCard'

export const AdvertDetailsView: FC<{
    advert: Advert
    terms: Terms
    categories: Category[]
    fields: AdvertFieldConfig
    tagDescriptions: TagDescription[]
    pickupLocations: PickupLocation[]
}> = ({
    advert,
    terms,
    categories,
    fields,
    tagDescriptions,
    pickupLocations,
}) => {
    const { roles } = useContext(AuthContext)
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
                terms={terms}
                advert={advert}
                categories={createTreeAdapter(
                    categories,
                    (c) => c.id,
                    (c) => c.categories
                )}
                fields={fields}
                tagDescriptions={getEffectiveTagDescriptions(
                    tagDescriptions,
                    terms.tags,
                    roles
                )}
                pickupLocations={pickupLocations}
                error={status?.message}
                onUpdate={update}
            />
        ),
    })
}
