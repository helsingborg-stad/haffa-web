import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Stack,
    TextField,
} from '@mui/material'

import { ContentModule } from 'content/types'
import { Terms } from 'terms/types'
import { Category } from 'categories/types'
import { Fragment } from 'react'
import { Option } from '../../options/types'
import { MultiOptionSelect } from './components/MultiOptionSelect'
import { ImageBrowseButton } from './components/ImageBrowseButton'
import { ImageThumbnail } from './components/ImageThumbnail'

interface PropertyEditorProps {
    module: ContentModule
    terms: Terms
    categories: Category[]
    onUpdate: (module: ContentModule) => void
    onApply: () => void
    onClose: () => void
}

const getLabel = (key: keyof ContentModule): string =>
    ({
        title: 'Titel',
        body: 'Brödtext',
        image: 'Bild',
        categories: 'Kategorier',
        tags: 'Taggar',
    }[key] ?? key)

const categoryToOptions = (
    category: Category,
    prefix: string | undefined = undefined,
    output: Option[] = []
): Option[] => {
    const value = prefix ? `${prefix} - ${category.label}` : category.label

    const childOutput =
        category.categories.map((c) => categoryToOptions(c, value)).flat() ?? []

    return [...output, { value, key: category.id }, ...childOutput]
}

export const PropertyEditor = (props: PropertyEditorProps) => {
    const { module, terms, categories, onUpdate, onApply, onClose } = props

    const patch = (key: string, value: string) => {
        onUpdate({
            ...module,
            [key]: value.trim(),
        })
    }

    return (
        <Dialog open fullWidth onClose={onClose}>
            <DialogTitle>Redigera modul</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {Object.keys(module).map((v, i) => {
                        switch (v) {
                            case 'title':
                                return (
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        key={i}
                                        label={getLabel(v)}
                                        value={module[v]}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    />
                                )
                            case 'body':
                                return (
                                    <TextField
                                        fullWidth
                                        multiline
                                        key={i}
                                        label={getLabel(v)}
                                        value={module[v]}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    />
                                )
                            case 'image':
                                return (
                                    <Fragment key={i}>
                                        {module[v] !== '' && (
                                            <ImageThumbnail
                                                url={module[v]}
                                                onDelete={() => patch(v, '')}
                                            />
                                        )}
                                        <ImageBrowseButton
                                            onUpdate={(e) => patch(v, e)}
                                        />
                                    </Fragment>
                                )
                            case 'categories':
                                return (
                                    <MultiOptionSelect
                                        fullWidth
                                        key={i}
                                        label={getLabel(v)}
                                        onUpdate={(c) => patch(v, c)}
                                        selected={module[v].split(',')}
                                        options={categories
                                            .map((c) => categoryToOptions(c))
                                            .flat()}
                                    />
                                )
                            case 'tags':
                                return (
                                    <MultiOptionSelect
                                        fullWidth
                                        key={i}
                                        label={getLabel(v)}
                                        onUpdate={(c) => patch(v, c)}
                                        selected={module[v].split(',')}
                                        options={terms.tags.map((t) => ({
                                            key: t,
                                            value: t,
                                        }))}
                                    />
                                )
                            default:
                                return (
                                    <TextField
                                        fullWidth
                                        key={i}
                                        label={v}
                                        value={
                                            (module as Record<string, string>)[
                                                v
                                            ]
                                        }
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    />
                                )
                        }
                    })}
                </Stack>
            </DialogContent>
            <DialogActions>
                <Button onClick={onApply}>Spara</Button>
                <Button onClick={onClose}>Stäng</Button>
            </DialogActions>
        </Dialog>
    )
}
