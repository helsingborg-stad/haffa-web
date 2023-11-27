import { Card, CardContent } from '@mui/material'
import { Markdown } from 'components/Markdown'
import { PhraseContext } from 'phrases'
import { useContext } from 'react'

export const AboutView = () => {
    const { phrase } = useContext(PhraseContext)

    return (
        <Card>
            <CardContent>
                <Markdown
                    markdown={phrase('ABOUT_HAFFA_EDITORIAL', 'Om HAFFA')}
                />
            </CardContent>
        </Card>
    )
}
