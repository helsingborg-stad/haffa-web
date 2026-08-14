import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Stack,
    Typography,
    useTheme,
} from '@mui/material'
import { darken, getLuminance, lighten } from '@mui/material/styles'
import type { Variant } from '@mui/material/styles/createTypography'
import { AdvertsListGeneric } from 'adverts/components/listings/AdvertsListGeneric'
import { Markdown } from 'components/Markdown'
import { compile } from 'handlebars'
import { isValidColor, isValidString, isYoutubeUrl } from 'lib/string-utils'
import type { PropsWithChildren } from 'react'
import type { Summaries } from 'statistics/types'
import type { ContentModule } from '../types'

const getStackDirection = (position: ContentModule['position']): any =>
    ({
        bottom: 'column-reverse',
        left: { xs: 'column', sm: 'row' },
        right: {
            xs: 'column',
            sm: 'row-reverse',
        },
        top: 'column',
    })[position] ?? 'column'

// Admin-picked module colors are authored for a light background. In dark
// mode, nudge them for contrast rather than rendering them verbatim.
const adaptBackgroundToMode = (color: string, mode: 'light' | 'dark') =>
    mode === 'dark' && getLuminance(color) > 0.5 ? darken(color, 0.7) : color

const adaptTextToMode = (color: string, mode: 'light' | 'dark') =>
    mode === 'dark' && getLuminance(color) < 0.5 ? lighten(color, 0.7) : color

export const ContentCard = (
    props: PropsWithChildren & { module: ContentModule; summaries: Summaries }
) => {
    const { palette } = useTheme()
    const module = {
        ...props.module,
        title: compile(props.module.title)(props.summaries),
        body: compile(props.module.body)(props.summaries),
    }

    const borderLess =
        module.border === 'false'
            ? {
                  border: 0,
              }
            : {}

    const backgroundColor =
        palette.mode === 'dark' && isValidColor(module.darkBackground)
            ? module.darkBackground
            : isValidColor(module.background)
              ? adaptBackgroundToMode(module.background, palette.mode)
              : undefined
    const background = backgroundColor ? { backgroundColor } : {}

    const textColor =
        palette.mode === 'dark' && isValidColor(module.darkColor)
            ? module.darkColor
            : isValidColor(module.color)
              ? adaptTextToMode(module.color, palette.mode)
              : undefined
    const color = textColor ? { color: textColor } : {}

    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                ...background,
                ...color,
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
                        alt={module.alt}
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
