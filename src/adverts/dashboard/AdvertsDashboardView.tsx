import { SimpleTab, SimpleTabs, makeSimpleTab } from 'components/SimpleTabs'
import { PhraseContext } from 'phrases'
import { FC, useCallback, useContext, useMemo } from 'react'
import { useUrlParams } from 'url-params'
import { AdvertFieldsContext } from 'advert-field-config'
import { AdvertFieldConfig } from 'advert-field-config/types'
import useAsync from 'hooks/use-async'
import { ErrorView } from 'errors'
import { AdvertsTableView } from './AdvertsTableView'

export const AdvertsDashboardView: FC = () => {
    const { phrase } = useContext(PhraseContext)

    const { getFieldConfig } = useContext(AdvertFieldsContext)

    interface DashboardModel {
        fields: AdvertFieldConfig
        tabs: SimpleTab[]
    }

    const createTabs = useCallback(
        (fields: AdvertFieldConfig) => {
            const usePickup =
                !!fields.find(
                    ({ label, visible }) =>
                        label === 'markedAsReadyForPickup' && visible
                ) || true
            return [
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_NOT_ARCHIVED', 'Alla'),
                    () => (
                        <AdvertsTableView
                            prefix="d"
                            fieldConfig={fields}
                            advertFilter={{
                                restrictions: { editableByMe: true },
                            }}
                        />
                    )
                ),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_ACTIVE', 'Aktiva'),
                    () => (
                        <AdvertsTableView
                            prefix="a"
                            fieldConfig={fields}
                            advertFilter={{
                                restrictions: {
                                    editableByMe: true,
                                    canBeReserved: true,
                                },
                            }}
                        />
                    )
                ),
                !usePickup &&
                    makeSimpleTab(
                        true,
                        phrase('MYADVERTS_RESERVED', 'Reserverade'),
                        () => (
                            <AdvertsTableView
                                prefix="r"
                                fieldConfig={fields}
                                advertFilter={{
                                    restrictions: {
                                        editableByMe: true,
                                        hasReservations: true,
                                    },
                                }}
                            />
                        )
                    ),
                usePickup &&
                    makeSimpleTab(true, 'reserverade ej plockade', () => (
                        <AdvertsTableView
                            prefix="r"
                            fieldConfig={fields}
                            advertFilter={{
                                fields: {
                                    markedAsReadyForPickup: { ne: true },
                                },
                                restrictions: {
                                    editableByMe: true,
                                    hasReservations: true,
                                },
                            }}
                        />
                    )),
                usePickup &&
                    makeSimpleTab(true, 'reserverade och plockade', () => (
                        <AdvertsTableView
                            prefix="r"
                            fieldConfig={fields}
                            advertFilter={{
                                fields: {
                                    markedAsReadyForPickup: { eq: true },
                                },
                                restrictions: {
                                    editableByMe: true,
                                    hasReservations: true,
                                },
                            }}
                        />
                    )),
                makeSimpleTab(
                    true,
                    phrase('MYADVERTS_COLLECTED', 'Uthämtade'),
                    () => (
                        <AdvertsTableView
                            prefix="c"
                            fieldConfig={fields}
                            advertFilter={{
                                restrictions: {
                                    editableByMe: true,
                                    hasCollects: true,
                                },
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
                            fieldConfig={fields}
                            advertFilter={{
                                restrictions: {
                                    editableByMe: true,
                                    isArchived: true,
                                },
                            }}
                        />
                    )
                ),
            ]
                .filter((v) => v)
                .map((v) => v! as SimpleTab)
        },
        [phrase]
    )

    const modelPromise = useMemo<Promise<DashboardModel>>(
        async () =>
            getFieldConfig().then((fields) => ({
                fields,
                tabs: createTabs(fields),
            })),
        [getFieldConfig]
    )

    const view = useAsync<DashboardModel>(() => modelPromise, {
        fields: [],
        tabs: [],
    })

    const [tabIndex, setTabIndex] = useUrlParams<number>(
        '',
        ({ t }) => parseInt(t, 10),
        (t) => (t > 0 ? { t } : { t: '' })
    )

    return view({
        pending: () => null,
        rejected: (e) => <ErrorView error={e} />,
        resolved: ({ tabs }) => (
            <SimpleTabs tabs={tabs} value={tabIndex} onChange={setTabIndex} />
        ),
    })
}
