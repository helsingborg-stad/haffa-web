import { Box } from '@mui/material'
import { ContentCard } from 'content/components/ContentCard'
import type { ViewComposition } from 'content/types'
import type { Summaries } from 'statistics/types'

export const HomeView = (props: {
    composition: ViewComposition
    summaries: Summaries
}) => (
    <Box
        sx={{
            display: 'grid',
            rowGap: 3,
            columnGap: 3,
        }}
    >
        {props.composition.rows.map((row, index) => (
            <Box
                key={index}
                sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: `repeat(${row.columns.length}, minmax(0, 1fr))`,
                    },
                }}
            >
                {row.columns.map((column, index) => (
                    <Box key={index}>
                        <ContentCard
                            module={column.module}
                            summaries={props.summaries}
                        />
                    </Box>
                ))}
            </Box>
        ))}
    </Box>
)
