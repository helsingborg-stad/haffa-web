import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Typography,
} from '@mui/material'
import { AdvertsListGeneric } from 'adverts/components/listings/AdvertsListGeneric'
import { Markdown } from 'components/Markdown'
import { PropsWithChildren } from 'react'
import { isString } from 'lib/string-utils'
import { ContentModule } from '../types'

export const ContentCard = (
    props: PropsWithChildren & { module: ContentModule }
) => {
    const { module } = props

    return (
        <Card sx={{ height: '100%', position: 'relative' }}>
            <>
                {isString(module.image) && (
                    <CardMedia component="img" image={module.image} />
                )}
                <CardContent>
                    {isString(module.title) && (
                        <Typography variant="subtitle2" gutterBottom>
                            {module.title}
                        </Typography>
                    )}
                    {isString(module.body) && (
                        <Markdown markdown={module.body} />
                    )}
                    {isString(module.imageRef) && (
                        <Box component="img" src={module.imageRef} />
                    )}

                    {(isString(module.categories) || isString(module.tags)) && (
                        <AdvertsListGeneric
                            defaultSearchParams={{
                                restrictions: {
                                    canBeReserved: true,
                                },
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
                {props.children && <CardActions>{props.children}</CardActions>}
            </>
        </Card>
    )
}
