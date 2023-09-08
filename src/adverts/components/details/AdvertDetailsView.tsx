import { FC } from 'react'
import { LinearProgress } from '@mui/material'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { Advert, AdvertMutationResult } from '../../types'
import { AdvertCard } from './advert-card/AdvertCard'

export const AdvertDetailsView: FC<{ advert: Advert }> = ({ advert }) => {
    const inspect = useAsync<AdvertMutationResult>(async () => ({
        advert,
        status: null,
    }))

    return inspect({
        pending: () => <LinearProgress />,
        rejected: (e) => <ErrorView error={e} />,
        resolved: ({ advert, status }, _, update) => (
            <AdvertCard
                advert={advert}
                error={status?.message}
                onUpdate={update}
            />
        ),
    })
}
