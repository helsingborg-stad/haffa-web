import { Box, IconButton } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import YouTubeIcon from '@mui/icons-material/YouTube'
import { isYoutubeUrl } from 'lib/string-utils'

export const ImageThumbnail = (props: {
    url: string
    height?: number
    onDelete: () => void
}) => (
    <Box component="div" sx={{ position: 'relative' }}>
        {isYoutubeUrl(props.url) && (
            <YouTubeIcon
                sx={{
                    fontSize: props.height ?? 128,
                }}
            />
        )}
        {!isYoutubeUrl(props.url) && (
            <Box component="img" src={props.url} height={props.height ?? 128} />
        )}
        <IconButton
            color="warning"
            size="small"
            onClick={props.onDelete}
            sx={{ position: 'absolute', top: 0, left: 0 }}
        >
            <DeleteIcon />
        </IconButton>
    </Box>
)
