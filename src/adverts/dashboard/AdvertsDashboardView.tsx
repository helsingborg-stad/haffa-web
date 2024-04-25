import { SimpleTab, SimpleTabs, makeSimpleTab } from 'components/SimpleTabs'
import { PhraseContext } from 'phrases'
import { FC, useContext, useMemo } from 'react'
import { useUrlParams } from 'url-params'
import { AdvertsTableView } from './AdvertsTableView'

export const AdvertsDashboardView: FC = () => {
    const { phrase } = useContext(PhraseContext)

    const tabs = useMemo<SimpleTab[]>(
        () =>
            [
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_NOT_ARCHIVED', 'Alla'),
                    () => (
                        <AdvertsTableView
                            prefix="d"
                            restrictions={{ createdByMe: true }}
                        />
                    )
                ),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_ACTIVE', 'Aktiva'),
                    () => (
                        <AdvertsTableView
                            prefix="a"
                            restrictions={{
                                createdByMe: true,
                                canBeReserved: true,
                            }}
                        />
                    )
                ),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_RESERVED', 'Reserverade'),
                    () => (
                        <AdvertsTableView
                            prefix="r"
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
                            prefix="c"
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
                            prefix="a"
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
    const [tabIndex, setTabIndex] = useUrlParams<number>(
        '',
        ({ t }) => {
            const n = parseInt(t, 10)
            return n >= 0 && n < tabs.length ? n : 0
        },
        (t) => (t > 0 ? { t } : { t: '' })
    )

    return <SimpleTabs tabs={tabs} value={tabIndex} onChange={setTabIndex} />
}
