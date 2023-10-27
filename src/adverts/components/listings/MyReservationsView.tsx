import { FC, useContext, useMemo } from 'react'
import { PhraseContext } from 'phrases'
import { AdvertsTab, TabbedAdvertsView } from './TabbedAdvertsView'

export const MyReservationsView: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const tabs = useMemo<AdvertsTab[]>(
        () => [
            {
                label: phrase('MYRESERVATIONS_RESERVED', 'Reserverade'),
                restrictions: { reservedByMe: true },
                name: 'reserved',
            },
            {
                label: phrase('MYRESERVATIONS_COLLECTED', 'Uthämtat'),
                restrictions: { collectedByMe: true },
                name: 'collected',
            },
        ],
        [phrase]
    )

    return <TabbedAdvertsView tabs={tabs} />
}
