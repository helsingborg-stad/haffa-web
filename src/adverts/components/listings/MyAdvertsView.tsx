import { FC, useContext, useMemo } from 'react'
import { PhraseContext } from 'phrases/PhraseContext'
import { AdvertsTab, TabbedAdvertsView } from './TabbedAdvertsView'

export const MyAdvertsView: FC = () => {
    const { phrase } = useContext(PhraseContext)

    const tabs = useMemo<AdvertsTab[]>(
        () => [
            {
                label: phrase('', 'Aktiva'),
                restrictions: { createdByMe: true, canBeReserved: true },
                name: 'active',
            },
            {
                label: phrase('', 'Reserverade'),
                name: 'reserved',
                restrictions: { createdByMe: true, hasReservations: true },
            },
            {
                label: phrase('', 'Arkiverade'),
                name: 'archived',
                restrictions: { createdByMe: true, isArchived: true },
            },
            {
                label: phrase('', 'Uthämtade'),
                name: 'collected',
                restrictions: { createdByMe: true, hasCollects: true },
            },
        ],
        [phrase]
    )

    return <TabbedAdvertsView baseCacheName="my-adverts" tabs={tabs} />
}
