import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Stack,
    TextField,
} from '@mui/material'

import { ContentModule } from 'content/types'
import { Terms } from 'terms/types'
import { Category } from 'categories/types'
import { Fragment, useState } from 'react'
import { isValidUrl } from 'lib/string-utils'
import { createEmptyModule } from 'content/mappers'
import { ColorSelect } from 'admin/theme/components/ColorSelect'
import { Option } from '../../options/types'
import { MultiOptionSelect } from './components/MultiOptionSelect'
import { ImageBrowseButton } from './components/ImageBrowseButton'
import { ImageThumbnail } from './components/ImageThumbnail'
import { CollectStringButton } from './components/CollectStringButton'

const MAX_FILE_SIZE = 2 * 1024 * 1024

interface PropertyEditorProps {
    module: ContentModule
    terms: Terms
    categories: Category[]
    onUpdate: (module: ContentModule) => void
    onClose: () => void
}

const labelFrom = (key: keyof ContentModule): string =>
    ({
        title: 'Titel',
        size: 'Storlek på titel',
        body: 'Brödtext',
        align: 'Textjustering',
        border: 'Ram',
        background: 'Bakgrundsfärg',
        image: 'Bild',
        alt: 'Alt-text',
        position: 'Bildposition',
        width: 'Bildbredd',
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
    const { module, terms, categories, onUpdate, onClose } = props

    // Save state
    const [canSave, setCanSave] = useState(true)

    // Validate fields
    const isValid = (_key: string, _value: string) => true

    // Starting values
    const [content, setContent] = useState<ContentModule>({
        ...createEmptyModule(),
        ...module,
    })

    // Update values
    const patch = (key: string, value: string) => {
        setContent({
            ...content,
            [key]: value,
        })
        setCanSave(isValid(key, value))
    }

    return (
        <Dialog open fullWidth onClose={onClose}>
            <DialogTitle>Redigera modul</DialogTitle>
            <DialogContent dividers>
                <Stack spacing={2}>
                    {Object.keys(content).map((v, i) => {
                        switch (v) {
                            case 'title':
                                return (
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    />
                                )
                            case 'size':
                                return (
                                    <TextField
                                        fullWidth
                                        select
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6].map((val) => (
                                            <MenuItem
                                                key={val}
                                                value={`h${val}`}
                                            >
                                                {`h${val}`}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )

                            case 'body':
                                return (
                                    <TextField
                                        fullWidth
                                        multiline
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    />
                                )
                            case 'align':
                                return (
                                    <TextField
                                        fullWidth
                                        select
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    >
                                        <MenuItem value="left">
                                            Vänster
                                        </MenuItem>
                                        <MenuItem value="right">Höger</MenuItem>
                                        <MenuItem value="center">
                                            Centrerad
                                        </MenuItem>
                                    </TextField>
                                )

                            case 'border':
                                return (
                                    <TextField
                                        fullWidth
                                        select
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    >
                                        <MenuItem value="true">Ja</MenuItem>
                                        <MenuItem value="false">Nej</MenuItem>
                                    </TextField>
                                )
                            case 'background':
                                return (
                                    <ColorSelect
                                        allowEmpty
                                        fullWidth
                                        disableAlpha
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onColorChange={(c) => patch(v, c)}
                                    />
                                )
                            case 'image':
                                return (
                                    <Fragment key={i}>
                                        {content[v] !== '' && (
                                            <ImageThumbnail
                                                url={content[v]}
                                                onDelete={() => patch(v, '')}
                                            />
                                        )}
                                        <ImageBrowseButton
                                            maxSize={MAX_FILE_SIZE}
                                            onUpdate={(e) => patch(v, e)}
                                        />
                                        <CollectStringButton
                                            title="Extern bild-URL"
                                            label="URL"
                                            initial={content[v]}
                                            validate={(e) =>
                                                isValidUrl(e) || e === ''
                                            }
                                            onUpdate={(e) => patch(v, e)}
                                        >
                                            Extern bildlänk
                                        </CollectStringButton>
                                    </Fragment>
                                )
                            case 'alt':
                                return (
                                    <TextField
                                        fullWidth
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    />
                                )

                            case 'position':
                                return (
                                    <TextField
                                        fullWidth
                                        select
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    >
                                        <MenuItem value="top">Över</MenuItem>
                                        <MenuItem value="bottom">
                                            Under
                                        </MenuItem>
                                        <MenuItem value="left">
                                            Vänster
                                        </MenuItem>
                                        <MenuItem value="right">Höger</MenuItem>
                                    </TextField>
                                )
                            case 'width':
                                return (
                                    <TextField
                                        fullWidth
                                        select
                                        key={i}
                                        label={labelFrom(v)}
                                        value={content[v]}
                                        error={!isValid(v, content[v])}
                                        onChange={(c) =>
                                            patch(v, c.target.value)
                                        }
                                    >
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(
                                            (val) => (
                                                <MenuItem
                                                    key={val}
                                                    value={`${val * 10}%`}
                                                >
                                                    {`${val * 10}%`}
                                                </MenuItem>
                                            )
                                        )}
                                    </TextField>
                                )
                            case 'categories':
                                return (
                                    <MultiOptionSelect
                                        fullWidth
                                        key={i}
                                        label={labelFrom(v)}
                                        onUpdate={(c) => patch(v, c)}
                                        selected={content[v].split(',')}
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
                                        label={labelFrom(v)}
                                        onUpdate={(c) => patch(v, c)}
                                        selected={content[v].split(',')}
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
                                            (content as Record<string, string>)[
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
                <Button disabled={!canSave} onClick={() => onUpdate(content)}>
                    Spara
                </Button>
                <Button onClick={onClose}>Stäng</Button>
            </DialogActions>
        </Dialog>
    )
}
