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
import { isValidColor, isValidString, isYoutubeUrl } from 'lib/string-utils'
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
    const background = isValidColor(module.background)
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
                {isValidString(module.image) && !isYoutubeUrl(module.image) && (
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
                {isYoutubeUrl(module.image) && (
                    <Box
                        component="div"
                        sx={{
                            width: {
                                xs: '100%',
                                sm: module.width,
                            },
                            alignSelf: 'center',
                        }}
                    >
                        <CardMedia
                            component="div"
                            sx={{
                                position: 'relative',
                                overflow: 'hidden',
                                paddingTop: '56.25%',
                            }}
                        >
                            <Box
                                component="iframe"
                                src={module.image}
                                referrerPolicy="strict-origin-when-cross-origin"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                sx={{
                                    border: 'none',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    bottom: 0,
                                    right: 0,
                                    width: '100%',
                                    height: '100%',
                                }}
                            />
                        </CardMedia>
                    </Box>
                )}
                <CardContent sx={{ width: '100%', textAlign: module.align }}>
                    {isValidString(module.title) && (
                        <Typography
                            variant={module.size as Variant}
                            gutterBottom
                        >
                            {module.title}
                        </Typography>
                    )}
                    {isValidString(module.body) && (
                        <Markdown markdown={module.body} />
                    )}

                    {(isValidString(module.categories) ||
                        isValidString(module.tags)) && (
                        <AdvertsListGeneric
                            defaultSearchParams={{
                                restrictions: {
                                    canBeReserved: true,
                                },
                                fields: {
                                    category: isValidString(module.categories)
                                        ? {
                                              in: module.categories.split(','),
                                          }
                                        : undefined,
                                    tags: isValidString(module.tags)
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
