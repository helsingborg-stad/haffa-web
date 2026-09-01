import { Box, Grid, Typography } from '@mui/material'
import { ImageBrowseButton } from 'admin/content/components/ImageBrowseButton'
import type { ThemeSectionProps } from './types'

const MAX_LOGOTYPE_FILE_SIZE = 1024 * 1024

export const LogotypeSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography
            variant="h6"
            sx={{
                py: 2,
            }}
        >
            Logotype
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
                <Box>
                    <Box
                        component="img"
                        src={model['custom.image.logotype']}
                        sx={{
                            height: 96,
                            border: '1px dotted black',
                            p: 2,
                        }}
                    />
                    <ImageBrowseButton
                        maxSize={MAX_LOGOTYPE_FILE_SIZE}
                        onUpdate={(src) =>
                            patch({ 'custom.image.logotype': src })
                        }
                    />
                </Box>
            </Grid>
        </Grid>
    </>
)
