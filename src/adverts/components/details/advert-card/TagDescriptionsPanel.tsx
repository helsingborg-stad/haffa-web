import { Card, CardContent, Stack } from '@mui/material'
import { Advert } from 'adverts/types'
import { Markdown } from 'components/Markdown'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { toMap } from 'lib/to-map'
import { OptionsContext } from 'options/OptionsContext'
import { FC, useContext, useMemo } from 'react'

export const TagDescriptionsPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const { getTagDescriptionOptions } = useContext(OptionsContext)
    const descriptions = useMemo(async () => {
        const { tags } = advert
        if (tags.length === 0) {
            return []
        }
        const tagDescriptions = await getTagDescriptionOptions()
        const tagDescriptionByTag = toMap(
            tagDescriptions,
            (o) => o.key,
            (o) => o
        )

        return tags
            .map((tag) => tagDescriptionByTag[tag])
            .filter((o) => o)
            .filter((o) => o.value.trim())
    }, [advert, getTagDescriptionOptions])

    const view = useAsync(() => descriptions)

    return view({
        rejected: (error) => <ErrorView error={error} />,
        pending: () => null,
        resolved: (descriptions) => (
            <Stack spacing={2} direction="column">
                {descriptions.map(({ key, value }) => (
                    <Card key={key}>
                        <CardContent>
                            <Markdown markdown={value} />
                        </CardContent>
                    </Card>
                ))}
            </Stack>
        ),
    })
}
