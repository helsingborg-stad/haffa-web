import { FC } from 'react'

import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { Button } from '@mui/material'

export const RestrictionButton: FC<{
    label: string
    value: boolean | undefined
    setValue: (checked: boolean | undefined) => void
}> = ({ label, value, setValue }) => {
    const mapValue = <T,>(truthy: T, falsy: T, undefinedly: T) =>
        // eslint-disable-next-line no-nested-ternary
        value === true ? truthy : value === false ? falsy : undefinedly

    return (
        <Button
            startIcon={mapValue(<AddIcon />, <RemoveIcon />, <AddIcon />)}
            variant={mapValue('contained', 'contained', 'outlined')}
            color={mapValue('primary', 'primary', 'secondary')}
            onClick={() => setValue(mapValue(false, undefined, true))}
        >
            {label}
        </Button>
    )
}
