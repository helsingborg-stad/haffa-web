import { Chip, PaperProps } from '@mui/material'
import { Advert } from 'adverts'
import { useNavigate } from 'react-router-dom'

export const TagCard = (props: PaperProps & { advert: Advert }) => {
    const { tags } = props.advert

    const nav = useNavigate()

    const clicked = (tag: string) => {
        nav(`/browse/#tags=${tag}`)
    }
    return (
        tags.length > 0 && (
            <>
                {tags.map((v) => (
                    <Chip
                        clickable
                        onClick={() => clicked(v)}
                        label={v}
                        sx={{ mr: 1 }}
                    />
                ))}
            </>
        )
    )
}
