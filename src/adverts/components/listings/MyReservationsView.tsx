import { PhraseContext } from 'phrases'
import { type FC, useContext, useMemo } from 'react'
import { type AdvertsTab, TabbedAdvertsView } from './TabbedAdvertsView'

export const MyReservationsView: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const tabs = useMemo<AdvertsTab[]>(
        () => [
            {
                label: phrase('MYRESERVATIONS_RESERVED', 'Reserverade'),
                restrictions: { reservedByMe: true },
                name: 'reserved',
                hideFilter: true,
            },
            {
                label: phrase('MYRESERVATIONS_COLLECTED', 'Uthämtat'),
                restrictions: { collectedByMe: true },
                name: 'collected',
                hideFilter: true,
            },
        ],
        [phrase]
    )

    return <TabbedAdvertsView tabs={tabs} scrollTopOnFilterChange />
}
