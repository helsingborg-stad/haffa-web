import {
    Container,
    Box,
    FormControl,
    MenuItem,
    Button,
    Select,
} from '@mui/material'
import { FC } from 'react'

export const AdvertPagingControls: FC<{
    limit: number
    onChangeLimit: (newLimit: number) => void
    onLoadMore: () => void
    nextCursor?: string | null
}> = ({ nextCursor, onLoadMore, limit, onChangeLimit }) => (
    <Container
        sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
        }}
    >
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
            }}
        >
            <span>Annonser per sida:</span>
            <FormControl variant="standard">
                <Select
                    value={limit}
                    onChange={(e) => onChangeLimit(e.target.value as number)}
                >
                    <MenuItem value={1}>1</MenuItem>
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={15}>15</MenuItem>
                </Select>
            </FormControl>
        </Box>
        {nextCursor ? (
            <Button variant="text" onClick={onLoadMore}>
                Ladda Fler
            </Button>
        ) : null}
    </Container>
)
