import { Typography } from '@mui/material'
import { FC } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'

const components: Components = {
    h1: ({ children }) => <Typography variant="h6">{children}</Typography>,
    h2: ({ children }) => <Typography variant="h6">{children}</Typography>,
    h3: ({ children }) => <Typography variant="h6">{children}</Typography>,
    h4: ({ children }) => <Typography variant="h6">{children}</Typography>,
    h5: ({ children }) => <Typography variant="h6">{children}</Typography>,
    h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
}
export const Markdown: FC<{ markdown: string }> = ({ markdown }) => (
    <Typography component="div">
        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </Typography>
)
