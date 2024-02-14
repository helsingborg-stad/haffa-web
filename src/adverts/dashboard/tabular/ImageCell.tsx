import { Box } from '@mui/material'
import { FC } from 'react'

export const ImageCell: FC<{ url?: string }> = ({ url }) =>
    url ? (
        <Box
            component="img"
            src={url}
            sx={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
                maxWidth: '128px',
                maxHeight: '128px',
            }}
        />
    ) : null
