import { Stack } from '@mui/material'
import { Advert, AdvertFilterInput } from 'adverts'
import { FC, ReactNode } from 'react'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'

export const SortableHeader: FC<{
    field: keyof Advert
    label: string
    filter: AdvertFilterInput
    setFilter: (f: AdvertFilterInput) => void
}> = ({ field, label, filter, setFilter }) => {
    const isActive = filter.sorting?.field === field
    const isAscending = !!filter.sorting?.ascending

    const renderComp = (ascending: boolean, icon: ReactNode) => (
        <Stack
            direction="row"
            spacing={1}
            component="a"
            sx={{
                cursor: 'pointer',
            }}
            onClick={() =>
                setFilter({
                    ...filter,
                    sorting: {
                        ...filter.sorting,
                        field,
                        ascending: !ascending,
                    },
                })
            }
        >
            {icon}
            {label}
        </Stack>
    )

    return isActive
        ? renderComp(
              isAscending,
              isAscending ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />
          )
        : renderComp(true, <SwapVertIcon sx={{ opacity: 0.5 }} />)
}
