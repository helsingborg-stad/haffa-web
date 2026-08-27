import { Avatar, type AvatarProps, Grid, Typography } from '@mui/material'
import { ColorSelect } from '../components/ColorSelect'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import type { ThemeModeSectionProps } from './types'

export const AvatarSection = ({
    mode,
    model,
    patch,
}: ThemeModeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Avatar
        </Typography>
        <Grid container rowSpacing={4}>
            <Grid
                size={{
                    xs: 12,
                    sm: 12,
                }}
            >
                <Avatar sx={{ p: 3 }}>
                    <Typography variant="h6">H</Typography>
                </Avatar>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 2,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <RegularSelect
                    label="Variant (Delad)"
                    value={model['component.avatar.variant']}
                    onChange={({ target: { value } }) =>
                        patch({
                            'component.avatar.variant':
                                value as AvatarProps['variant'],
                        })
                    }
                >
                    {CreateMenuItems<AvatarProps['variant']>([
                        ['Cirkulär', 'circular'],
                        ['Kvadratisk', 'square'],
                        ['Rundad', 'rounded'],
                    ])}
                </RegularSelect>
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 2,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <ColorSelect
                    label="Förgrundsfärg"
                    value={model[`${mode}.component.avatar.color`]}
                    disableAlpha
                    onColorChange={(color) =>
                        patch({
                            [`${mode}.component.avatar.color`]: color,
                        })
                    }
                />
            </Grid>
            <Grid
                size={{
                    xs: 12,
                    sm: 2,
                }}
                sx={{
                    pr: 1,
                }}
            >
                <ColorSelect
                    label="Bakgrundsfärg"
                    value={model[`${mode}.component.avatar.bgcolor`]}
                    disableAlpha
                    onColorChange={(color) =>
                        patch({
                            [`${mode}.component.avatar.bgcolor`]: color,
                        })
                    }
                />
            </Grid>
        </Grid>
    </>
)
