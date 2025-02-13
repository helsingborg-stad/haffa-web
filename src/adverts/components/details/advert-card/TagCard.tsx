import { Chip, PaperProps } from '@mui/material'
import { Advert } from 'adverts'
import { byMatchingTags } from 'lib/by-matching-tags'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { TagDescription } from 'tags/types'

export const TagCard = (
    props: PaperProps & { advert: Advert; tagDescriptions: TagDescription[] }
) => {
    const {
        advert: { tags },
        tagDescriptions,
    } = props

    const nav = useNavigate()

    const clicked = (tag: string) => {
        nav(`/browse/#tags=${tag}`)
    }

    const visibleTags = useMemo(
        () =>
            tagDescriptions
                .filter(byMatchingTags(tags))
                .filter(({ label }) => label),
        [tagDescriptions]
    )
    return (
        visibleTags.length > 0 && (
            <>
                {visibleTags.map(({ tag, label }) => (
                    <Chip
                        key={tag}
                        clickable
                        onClick={() => clicked(tag)}
                        label={label}
                        sx={{ mr: 1 }}
                    />
                ))}
            </>
        )
    )
}
