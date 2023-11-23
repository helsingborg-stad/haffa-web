import { Button, Chip, Grid, TextField } from '@mui/material'
import { useState } from 'react'

export const TagEditor = (props: {
    tags: string[]
    onUpdateTags: (tags: string[]) => void
}) => {
    const { tags, onUpdateTags } = props
    const [text, setText] = useState('')

    return (
        <Grid container rowSpacing={2}>
            <Grid item xs={12}>
                <TextField
                    label="Skapa tag"
                    value={text}
                    onChange={({ target: { value } }) => setText(value)}
                />
                <Button
                    disabled={text.length === 0}
                    onClick={() => {
                        const value = Array.from(new Set([...tags, text])).sort(
                            (a, b) => a.localeCompare(b)
                        )
                        setText('')

                        onUpdateTags(value)
                    }}
                >
                    Lägg till
                </Button>
            </Grid>
            <Grid item xs={12}>
                {tags.map((f) => (
                    <Chip
                        key={f}
                        onDelete={() => {
                            const value = Array.from(
                                new Set(tags.filter((e) => e !== f))
                            ).sort((a, b) => a.localeCompare(b))
                            onUpdateTags(value)
                        }}
                        label={f}
                    />
                ))}
            </Grid>
        </Grid>
    )
}
