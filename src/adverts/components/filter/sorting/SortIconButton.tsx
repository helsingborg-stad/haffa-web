import { Box, Button, Stack } from '@mui/material'
import { FC } from 'react'

import SortOutlinedIcon from '@mui/icons-material/SortOutlined'

export const SortIconButton: FC<{
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
            <SortOutlinedIcon />
            <Box>Sortering</Box>
        </Stack>
    </Button>
)
