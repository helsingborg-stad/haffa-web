import { PhraseContext } from 'phrases/PhraseContext'
import { type FC, useContext, useMemo } from 'react'
import { type AdvertsTab, TabbedAdvertsView } from './TabbedAdvertsView'

export const MyAdvertsView: FC = () => {
    const { phrase } = useContext(PhraseContext)

    const tabs = useMemo<AdvertsTab[]>(
        () => [
            {
                label: phrase('MYADVERTS_ACTIVE', 'Aktiva'),
                restrictions: { createdByMe: true, canBeReserved: true },
                name: 'active',
                hideFilter: true,
            },
            {
                label: phrase('MYADVERTS_RESERVED', 'Reserverade'),
                name: 'reserved',
                restrictions: { createdByMe: true, hasReservations: true },
                hideFilter: true,
            },
            {
                label: phrase('MYADVERTS_COLLECTED', 'Uthämtade'),
                name: 'collected',
                restrictions: { createdByMe: true, hasCollects: true },
                hideFilter: true,
            },
            {
                label: phrase('MYADVERTS_ARCHIVED', 'Arkiverade'),
                name: 'archived',
                restrictions: { createdByMe: true, isArchived: true },
                hideFilter: true,
            },
        ],
        [phrase]
    )

    return <TabbedAdvertsView tabs={tabs} scrollTopOnFilterChange />
}
