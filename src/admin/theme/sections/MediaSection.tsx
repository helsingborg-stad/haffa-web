import { Grid, Typography } from '@mui/material'
import { CreateMenuItems, RegularSelect } from '../components/RegularSelect'
import type { ThemeSectionProps } from './types'

const ASPECT_RATIOS = [
    '1:1',
    '3:2',
    '4:3',
    '5:3',
    '5:4',
    '16:9',
    '2:3',
    '3:4',
    '3:5',
    '4:5',
]

export const MediaSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Bilder och media
        </Typography>
        <Grid container rowSpacing={4}>
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
                    label="Bildförhållande"
                    value={model['advert.image.aspectRatio']}
                    onChange={({ target: { value } }) =>
                        patch({
                            'advert.image.aspectRatio': value,
                        })
                    }
                >
                    {CreateMenuItems(ASPECT_RATIOS.map((ratio) => [ratio]))}
                </RegularSelect>
            </Grid>
        </Grid>
    </>
)
