import { Card, CardContent, Stack } from '@mui/material'
import { Advert } from 'adverts/types'
import { TagDescriptionsContext } from 'branding/TagDescriptionsContext'
import { Markdown } from 'components/Markdown'
import { FC, useContext, useMemo } from 'react'

export const TagDescriptionsPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const { tagDescriptionByTag } = useContext(TagDescriptionsContext)
    const descriptions = useMemo(() => {
        const { tags } = advert
        if (tags.length === 0) {
            return []
        }
        return tags
            .map((tag) => ({
                tag,
                description: tagDescriptionByTag[tag],
            }))
            .filter(({ description }) => description)
    }, [advert, tagDescriptionByTag])

    return (
        <Stack spacing={2} direction="column" key="tags">
            {descriptions.map(({ tag, description }) => (
                <Card key={tag}>
                    <CardContent>
                        <Markdown markdown={description} />
                    </CardContent>
                </Card>
            ))}
        </Stack>
    )
}
