import { Chip, PaperProps } from '@mui/material'
import { Advert } from 'adverts'

export const TagCard = (props: PaperProps & { advert: Advert }) => {
    const { tags } = props.advert

    return (
        tags.length > 0 && (
            <>
                {tags.map((v) => (
                    <Chip label={v} sx={{ mr: 1 }} />
                ))}
            </>
        )
    )
}
