import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Stack,
    Typography,
} from '@mui/material'
import { AdvertsListGeneric } from 'adverts/components/listings/AdvertsListGeneric'
import { Markdown } from 'components/Markdown'
import { PropsWithChildren } from 'react'
import { isString } from 'lib/string-utils'
import { Variant } from '@mui/material/styles/createTypography'
import { ContentModule } from '../types'

const getStackDirection = (position: ContentModule['position']): any =>
    ({
        bottom: 'column-reverse',
        left: { xs: 'column', sm: 'row' },
        right: {
            xs: 'column',
            sm: 'row-reverse',
        },
        top: 'column',
    }[position] ?? 'column')

export const ContentCard = (
    props: PropsWithChildren & { module: ContentModule }
) => {
    const { module } = props

    const borderLess =
        module.border === 'false'
            ? {
                  border: 0,
              }
            : {}
    const background = isString(module.background)
        ? {
              backgroundColor: module.background,
          }
        : {}
    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                ...background,
                ...borderLess,
            }}
        >
            <Stack direction={getStackDirection(module.position)}>
                {isString(module.image) && (
                    <CardMedia
                        component="img"
                        image={module.image}
                        sx={{
                            width: {
                                sm: module.width,
                            },
                            alignSelf: 'center',
                        }}
                    />
                )}
                <CardContent sx={{ width: '100%', textAlign: module.align }}>
                    {isString(module.title) && (
                        <Typography
                            variant={module.size as Variant}
                            gutterBottom
                        >
                            {module.title}
                        </Typography>
                    )}
                    {isString(module.body) && (
                        <Markdown markdown={module.body} />
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
            </Stack>
            {props.children && <CardActions>{props.children}</CardActions>}
        </Card>
    )
}
