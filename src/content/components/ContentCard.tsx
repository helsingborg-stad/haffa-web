import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import {
    darken,
    getLuminance,
    lighten,
    type TypographyVariant,
} from '@mui/material/styles'
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

// Handlebars templates interpolate these numbers directly into
// user-facing text, so format them with thousands separators first.
const formatSummaries = (summaries: Summaries): Summaries =>
    Object.fromEntries(
        Object.entries(summaries).map(([key, group]) => [
            key,
            Object.fromEntries(
                Object.entries(group as Record<string, number>).map(
                    ([groupKey, value]) => [
                        groupKey,
                        value.toLocaleString('sv-SE'),
                    ]
                )
            ),
        ])
    ) as unknown as Summaries

export const ContentCard = (
    props: PropsWithChildren & {
        module: ContentModule
        summaries: Summaries
        columns?: number
    }
) => {
    const theme = useTheme()
    const { palette } = theme

    const summaries = formatSummaries(props.summaries)
    const module = {
        ...props.module,
        title: compile(props.module.title)(summaries),
        body: compile(props.module.body)(summaries),
    }

    // Below the 'md' breakpoint, HomeView always stacks content cards full
    // width, so keep 4 adverts per row there. At 'md' and up, a card sharing
    // its row with other cards gets narrow, so show fewer, wider adverts to
    // avoid cramming them.
    const isDesktopColumn = useMediaQuery(theme.breakpoints.up('md'))
    const columns = props.columns ?? 1
    const advertsPerRow = !isDesktopColumn
        ? 4
        : columns >= 4
          ? 1
          : columns > 1
            ? 2
            : 4

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
                            variant={module.size as TypographyVariant}
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
                            pageSize={advertsPerRow}
                            itemWidth={{
                                xs: 12 / advertsPerRow,
                                sm: 12 / advertsPerRow,
                            }}
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
