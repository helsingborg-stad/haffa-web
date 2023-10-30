import { FC, useContext, useMemo } from 'react'
import { PhraseContext } from 'phrases/PhraseContext'
import { AdvertsTab, TabbedAdvertsView } from './TabbedAdvertsView'

export const MyAdvertsView: FC = () => {
    const { phrase } = useContext(PhraseContext)

    const tabs = useMemo<AdvertsTab[]>(
        () => [
            {
                label: phrase('MYADVERTS_ACTIVE', 'Aktiva'),
                restrictions: { createdByMe: true, canBeReserved: true },
                name: 'active',
            },
            {
                label: phrase('MYADVERTS_RESERVED', 'Reserverade'),
                name: 'reserved',
                restrictions: { createdByMe: true, hasReservations: true },
            },
            {
                label: phrase('MYADVERTS_COLLECTED', 'Uthämtade'),
                name: 'collected',
                restrictions: { createdByMe: true, hasCollects: true },
            },
            {
                label: phrase('MYADVERTS_ARCHIVED', 'Arkiverade'),
                name: 'archived',
                restrictions: { createdByMe: true, isArchived: true },
            },
        ],
        [phrase]
    )

    return <TabbedAdvertsView tabs={tabs} />
}
