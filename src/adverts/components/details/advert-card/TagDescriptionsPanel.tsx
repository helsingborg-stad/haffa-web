import { Card, CardContent, Stack } from '@mui/material'
import type { Advert } from 'adverts/types'
import { Markdown } from 'components/Markdown'
import { compile } from 'handlebars'
import { toMap } from 'lib/to-map'
import { type FC, useMemo } from 'react'
import type { TagDescription } from 'tags/types'

export const TagDescriptionsPanel: FC<{
    advert: Advert
    tagDescriptions: TagDescription[]
}> = ({ advert, tagDescriptions }) => {
    const descriptions = useMemo(() => {
        const { tags } = advert
        if (tags.length === 0) {
            return []
        }
        const tagDescriptionByTag = toMap(
            tagDescriptions,
            (d) => d.tag,
            (d) => d.description
        )
        const taggedDescriptions = tags
            .map((tag) => ({
                tag,
                description: tagDescriptionByTag[tag],
            }))
            .filter(({ description }) => description)

        return taggedDescriptions
            .map(({ tag, description }) => {
                try {
                    return {
                        tag,
                        description: compile(description)({ advert }),
                    }
                } catch {
                    return null
                }
            })
            .filter(
                (d): d is { tag: string; description: string } => d !== null
            )
    }, [advert, tagDescriptions])

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
