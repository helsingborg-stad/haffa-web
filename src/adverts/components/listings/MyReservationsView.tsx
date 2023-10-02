import { FC, useContext, useMemo } from 'react'
import { PhraseContext } from 'phrases'
import { AdvertsTab, TabbedAdvertsView } from './TabbedAdvertsView'

export const MyReservationsView: FC = () => {
    const { phrase } = useContext(PhraseContext)
    const tabs = useMemo<AdvertsTab[]>(
        () => [
            {
                label: phrase('', 'Reserverade'),
                restrictions: { reservedByMe: true },
                name: 'reserved',
            },
            {
                label: phrase('', 'Uthämtat'),
                restrictions: { collectedByMe: true },
                name: 'collected',
            },
        ],
        [phrase]
    )

    return <TabbedAdvertsView baseCacheName="my-reservations" tabs={tabs} />
}
