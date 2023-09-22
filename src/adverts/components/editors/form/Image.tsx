import { Box, ButtonGroup, Grid, IconButton } from '@mui/material'
import { FC, PropsWithChildren } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import MoveUpIcon from '@mui/icons-material/MoveUp'
import MoveDownIcon from '@mui/icons-material/MoveDown'

export const ImageContainer: FC<PropsWithChildren> = ({ children }) => (
    <Grid container spacing={2}>
        {children}
    </Grid>
)
export const ImageInput: FC<{
    url: string
    onRemove?: () => void
    onMoveup?: () => void
    onMovedown?: () => void
}> = ({ url, onRemove, onMoveup, onMovedown }) => (
    <Grid item xs={6} sm={4} sx={{ position: 'relative' }}>
        <Box
            component="img"
            src={url}
            sx={{ objectFit: 'contain', width: '100%', height: '100%' }}
        />
        <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
            <ButtonGroup>
                {onRemove && (
                    <IconButton onClick={onRemove}>
                        <DeleteIcon />
                    </IconButton>
                )}
                {onMoveup && (
                    <IconButton onClick={onMoveup}>
                        <MoveUpIcon />
                    </IconButton>
                )}
                {onMovedown && (
                    <IconButton onClick={onMovedown}>
                        <MoveDownIcon />
                    </IconButton>
                )}
            </ButtonGroup>
        </Box>
    </Grid>
)
