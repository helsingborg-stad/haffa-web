import { ButtonGroup, Stack, useMediaQuery, useTheme } from '@mui/material'
import { AdvertFilterInput } from 'adverts/types'
import { PhraseContext } from 'phrases'
import { FC, PropsWithChildren, useContext } from 'react'
import { RestrictionButton } from './RestrictionButton'
import { SelectPickupLocation } from './SelectPickupLocation'
import { SelectArchived } from './SelectArchived'
import { SelectPlace } from './SelectPlace'

export const RestrictionsPanel: FC<
    {
        filter: AdvertFilterInput
        setFilter: (p: AdvertFilterInput) => void
    } & PropsWithChildren
> = ({ filter, setFilter }) => {
    const theme = useTheme()
    const horizontalGroup = useMediaQuery(theme.breakpoints.up('md'))
    const { phrase } = useContext(PhraseContext)
    return (
        <>
            <SelectArchived filter={filter} setFilter={setFilter} />
            <Stack direction="row" spacing={2}>
                <SelectPickupLocation filter={filter} setFilter={setFilter} />
                <SelectPlace filter={filter} setFilter={setFilter} />
            </Stack>
            <ButtonGroup
                orientation={horizontalGroup ? 'horizontal' : 'vertical'}
                fullWidth
            >
                <RestrictionButton
                    label={phrase('MYADVERTS_RESERVED', 'Reserverade')}
                    value={filter.restrictions?.hasReservations}
                    setValue={(c) =>
                        setFilter({
                            ...filter,
                            restrictions: {
                                ...filter.restrictions,
                                hasReservations: c,
                            },
                        })
                    }
                />

                <RestrictionButton
                    label={phrase('MYADVERTS_COLLECTED', 'Uthämtade')}
                    value={filter.restrictions?.hasCollects}
                    setValue={(c) =>
                        setFilter({
                            ...filter,
                            restrictions: {
                                ...filter.restrictions,
                                hasCollects: c,
                            },
                        })
                    }
                />
                <RestrictionButton
                    label={phrase('MYADVERTS_PICKED', 'Plockade')}
                    value={filter.restrictions?.isPicked}
                    setValue={(c) =>
                        setFilter({
                            ...filter,
                            restrictions: {
                                ...filter.restrictions,
                                isPicked: c,
                            },
                        })
                    }
                />
            </ButtonGroup>
        </>
    )
}
