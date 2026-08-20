import {
    Chip,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from '@mui/material'
import { AdminActionPanel } from 'components/AdminActionPanel'
import { compile } from 'handlebars'
import { sortBy } from 'lib/sort-by'
import { uniqueBy } from 'lib/unique-by'
import { PhraseContext } from 'phrases'
import { type FC, useCallback, useContext, useMemo, useState } from 'react'
import type { TagDescription } from 'tags/types'

const isValidTemplate = (description: string) => {
    if (!description) {
        return true
    }
    try {
        compile(description)({})
        return true
    } catch {
        return false
    }
}

export const EditTagDescriptionsForm: FC<{
    tags: string[]
    tagDescriptions: TagDescription[]
    onUpdate: (tagDescriptions: TagDescription[]) => void
}> = ({ tags, tagDescriptions, onUpdate }) => {
    const { phrase } = useContext(PhraseContext)
    const [search, setSearch] = useState('')
    const [model, setModel] = useState(() =>
        [
            // existing descriptions
            ...tagDescriptions.sort(sortBy((o) => o.tag.toLowerCase())),
            // viable descriptions
            ...tags
                .map<TagDescription>((tag) => ({
                    tag,
                    label: '',
                    description: '',
                }))
                .sort(sortBy((d) => d.tag.toLowerCase())),
        ].filter(uniqueBy((d) => d.tag))
    )

    const matchingTags = useMemo(() => {
        const terms = search
            .toLowerCase()
            .split(' ')
            .map((s) => s.trim())
            .filter((s) => s)
        return terms.length > 0
            ? new Set<string>(
                  model
                      .filter(({ tag, label, description }) =>
                          terms.every((term) =>
                              [
                                  tag.toLowerCase(),
                                  label.toLowerCase(),
                                  description.toLowerCase(),
                              ].some((v) => v.includes(term))
                          )
                      )
                      .map(({ tag }) => tag)
              )
            : new Set<string>()
    }, [model, search])

    const modelSortedBySearch = useMemo(
        () => [
            ...model.filter(({ tag }) => matchingTags.has(tag)),
            ...model.filter(({ tag }) => !matchingTags.has(tag)),
        ],
        [model, matchingTags]
    )

    const invalidTags = useMemo(
        () =>
            new Set(
                model
                    .filter(({ description }) => !isValidTemplate(description))
                    .map(({ tag }) => tag)
            ),
        [model]
    )

    const mutateModelRow = useCallback(
        (tag: string, patch: Partial<TagDescription>) =>
            setModel(
                model.map((o) => (o.tag === tag ? { ...o, ...patch } : o))
            ),
        [model]
    )

    const labels = useMemo(
        () => ({
            search: phrase('TAG_SEARCH_LABEL', 'Sök taggar'),
            tag: phrase('TAG_TAG_LABEL', 'Tagg'),
            label: phrase('TAG_DESCRIPTION_LABEL', 'Taggens visningsnamn'),
            description: phrase(
                'TAG_DESCRIPTION_DESCRIPTION',
                'Taggens extra annonstext'
            ),
            invalidTemplate: phrase(
                'TAG_DESCRIPTION_INVALID_TEMPLATE',
                'Ogiltig mall'
            ),
        }),
        [phrase]
    )

    return (
        <Stack direction="column" spacing={2}>
            {model.length > 0 && (
                <AdminActionPanel
                    onSave={() => onUpdate(model)}
                    disabled={invalidTags.size > 0}
                >
                    <TextField
                        label={labels.search}
                        placeholder={labels.search}
                        fullWidth
                        type="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </AdminActionPanel>
            )}
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Tagg</TableCell>
                            <TableCell sx={{ minWidth: '20em' }}>
                                {labels.label}
                            </TableCell>
                            <TableCell sx={{ minWidth: '20em' }}>
                                {labels.description}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modelSortedBySearch.map(
                            ({ tag, label, description }) => (
                                <TableRow
                                    key={tag}
                                    selected={matchingTags.has(tag)}
                                >
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <Chip
                                            label={tag}
                                            variant={
                                                matchingTags.has(tag)
                                                    ? 'filled'
                                                    : 'outlined'
                                            }
                                        />
                                    </TableCell>
                                    <TableCell sx={{ verticalAlign: 'top' }}>
                                        <TextField
                                            label={labels.label}
                                            placeholder={labels.label}
                                            value={label}
                                            fullWidth
                                            onChange={(e) =>
                                                mutateModelRow(tag, {
                                                    label: e.target.value,
                                                })
                                            }
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField
                                            label={labels.description}
                                            placeholder={labels.description}
                                            value={description}
                                            multiline
                                            fullWidth
                                            error={invalidTags.has(tag)}
                                            helperText={
                                                invalidTags.has(tag)
                                                    ? labels.invalidTemplate
                                                    : undefined
                                            }
                                            onChange={(e) =>
                                                mutateModelRow(tag, {
                                                    description: e.target.value,
                                                })
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            {model.length > 0 && (
                <AdminActionPanel
                    onSave={() => onUpdate(model)}
                    disabled={invalidTags.size > 0}
                />
            )}
        </Stack>
    )
}
