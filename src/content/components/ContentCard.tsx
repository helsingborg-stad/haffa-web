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
    let direction = {}

    switch (module.position) {
        case 'bottom':
            direction = 'column-reverse'
            break
        case 'left':
            direction = { xs: 'column', sm: 'row' }
            break
        case 'right':
            direction = {
                xs: 'column-reverse',
                sm: 'row-reverse',
            }
            break
        default:
            direction = 'column'
            break
    }

    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                ...borderLess,
            }}
        >
            <Stack direction={direction}>
                {isString(module.image) && (
                    <CardMedia
                        component="img"
                        image={module.image}
                        sx={{
                            width: {
                                sm: module.width,
                            },
                        }}
                    />
                )}
                <CardContent sx={{ width: '100%' }}>
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
            </Stack>
        </Card>
    )
}
