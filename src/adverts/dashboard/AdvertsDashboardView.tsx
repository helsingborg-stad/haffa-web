import { SimpleTab, SimpleTabs, makeSimpleTab } from 'components/SimpleTabs'
import { PhraseContext } from 'phrases'
import { FC, useContext, useMemo, useState } from 'react'
import { AdvertsTableView } from './AdvertsTableView'

export const AdvertsDashboardView: FC = () => {
    const { phrase } = useContext(PhraseContext)

    const [tabIndex, setTabIndex] = useState(0)
    const tabs = useMemo<SimpleTab[]>(
        () =>
            [
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_ACTIVE', 'Aktiva'),
                    () => (
                        <AdvertsTableView
                            restrictions={{ createdByMe: true }}
                        />
                    )
                ),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_RESERVED', 'Reserverade'),
                    () => (
                        <AdvertsTableView
                            restrictions={{
                                createdByMe: true,
                                hasReservations: true,
                            }}
                        />
                    )
                ),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_COLLECTED', 'Uthämtade'),
                    () => (
                        <AdvertsTableView
                            restrictions={{
                                createdByMe: true,
                                hasCollects: true,
                            }}
                        />
                    )
                ),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_ARCHIVED', 'Arkiverade'),
                    () => (
                        <AdvertsTableView
                            restrictions={{
                                createdByMe: true,
                                isArchived: true,
                            }}
                        />
                    )
                ),
            ]
                .filter((v) => v)
                .map((v) => v!),
        [phrase]
    )

    return <SimpleTabs tabs={tabs} value={tabIndex} onChange={setTabIndex} />
}
