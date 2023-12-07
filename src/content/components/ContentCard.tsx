import { Card, CardActions, CardContent, Typography } from '@mui/material'
import { AdvertsListGeneric } from 'adverts/components/listings/AdvertsListGeneric'
import { Markdown } from 'components/Markdown'
import { PropsWithChildren } from 'react'
import { isString } from 'content/mappers'
import { ContentModule } from '../types'

export const ContentCard = (
    props: PropsWithChildren & { module: ContentModule }
) => {
    const { module } = props

    return (
        <Card sx={{ height: '100%', position: 'relative' }}>
            <CardContent>
                {isString(module.image) && (
                    <Typography
                        gutterBottom
                        component="img"
                        src={module.image}
                        width="100%"
                    />
                )}
                {isString(module.title) && (
                    <Typography variant="subtitle2" gutterBottom>
                        {module.title}
                    </Typography>
                )}
                {isString(module.body) && <Markdown markdown={module.body} />}

                {(isString(module.categories) || isString(module.tags)) && (
                    <AdvertsListGeneric
                        defaultSearchParams={{
                            fields: {
                                category: isString(module.categories)
                                    ? {
                                          in: module.categories.split(','),
                                      }
                                    : undefined,
                                tags: isString(module.tags)
                                    ? {
                                          in: module.tags.split(','),
                                      }
                                    : undefined,
                            },
                        }}
                    />
                )}
            </CardContent>
            <CardActions>{props.children}</CardActions>
        </Card>
    )
}
