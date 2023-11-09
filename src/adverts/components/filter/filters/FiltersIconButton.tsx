import { Box, Button, Stack } from '@mui/material'
import { FC } from 'react'

import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined'

export const FiltersIconButton: FC<{
    onClick: (anchor: HTMLElement) => void
}> = ({ onClick }) => (
    <Button color="inherit" onClick={(e) => onClick(e.currentTarget)}>
        <Stack
            direction="column"
            sx={{
                alignItems: 'center',
                fontSize: { xs: 'x-small', sm: '' },
                fontWeight: 'initial',
                textTransform: 'none',
            }}
        >
            <FilterListOutlinedIcon />
            <Box>Filter</Box>
        </Stack>
    </Button>
)
