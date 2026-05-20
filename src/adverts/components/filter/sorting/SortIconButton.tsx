import SortOutlinedIcon from '@mui/icons-material/SortOutlined'
import { Box, Button, Stack } from '@mui/material'
import type { FC } from 'react'

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
