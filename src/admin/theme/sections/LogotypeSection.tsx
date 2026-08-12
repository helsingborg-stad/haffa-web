import { Box, Grid, Typography } from '@mui/material'
import { ImageBrowseButton } from 'admin/content/components/ImageBrowseButton'
import type { ThemeSectionProps } from './types'

const MAX_LOGOTYPE_FILE_SIZE = 1024 * 1024

export const LogotypeSection = ({ model, patch }: ThemeSectionProps) => (
    <>
        <Typography variant="h6" py={2}>
            Logotype
        </Typography>
        <Grid container rowSpacing={4}>
            <Grid item xs={12} sm={2} pr={1}>
                <Box>
                    <Box
                        component="img"
                        height={96}
                        border="1px dotted black"
                        src={model['custom.image.logotype']}
                        sx={{ p: 2 }}
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
