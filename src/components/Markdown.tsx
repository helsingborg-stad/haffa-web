import { Link, Typography } from '@mui/material'
import type { FC } from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'

const components: Components = {
    h1: ({ children }) => <Typography variant="h1">{children}</Typography>,
    h2: ({ children }) => <Typography variant="h2">{children}</Typography>,
    h3: ({ children }) => <Typography variant="h3">{children}</Typography>,
    h4: ({ children }) => <Typography variant="h4">{children}</Typography>,
    h5: ({ children }) => <Typography variant="h5">{children}</Typography>,
    h6: ({ children }) => <Typography variant="h6">{children}</Typography>,
    a: ({ children, href }) => <Link href={href}>{children}</Link>,
}
export const Markdown: FC<{ markdown: string; nomargin?: boolean }> = ({
    markdown,
    nomargin = false,
}) => (
    <Typography
        component="div"
        sx={
            nomargin
                ? {
                      '& > *:first-child': { marginTop: 0 },
                      '& > *:last-child': { marginBottom: 0 },
                  }
                : undefined
        }
    >
        <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </Typography>
)
