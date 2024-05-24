import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from '@mui/material'
import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'
import CancelIcon from '@mui/icons-material/Cancel'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import { uniqueBy } from 'lib/unique-by'
import { sortBy } from 'lib/sort-by'
import { flatten } from 'lib/flatten'
import { AdvertsContext } from 'adverts/AdvertsContext'
import { BulkActionDialogParams } from './types'
import { AdvertsTableContext } from '../AdvertsTable'

const trimTags = (tags: string[]) =>
    tags.filter(uniqueBy((tag) => tag)).sort(sortBy((tag) => tag.toLowerCase()))

const valueArray = (value: string | string[]) =>
    (Array.isArray(value) ? value : [value]).filter((v) => v)

const TagSelect: FC<{
    tags: string[]
    selected: string[]
    onSelected: (selected: string[]) => any
}> = ({ tags, selected, onSelected }) => (
    <Select
        multiple
        value={selected}
        onChange={({ target: { value } }) => onSelected(valueArray(value))}
        input={<OutlinedInput label="Taggar" />}
        renderValue={(selected) => (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                    <Chip key={value} label={value} />
                ))}
            </Box>
        )}
    >
        {tags.map((tag) => (
            <MenuItem key={tag} value={tag}>
                {tag}
            </MenuItem>
        ))}
    </Select>
)

export const PatchTagsDialog: FC<
    BulkActionDialogParams & { label: string }
> = ({ open, closeDialog, label }) => {
    const { phrase } = useContext(PhraseContext)
    const { patchAdvertTags } = useContext(AdvertsContext)
    const { selectedAdverts, terms, updateAdverts } =
        useContext(AdvertsTableContext)

    const [definedTags] = useState<string[]>(() => trimTags(terms.tags))
    const [activeTags] = useState(() =>
        trimTags(flatten(selectedAdverts.map(({ tags }) => tags)))
    )
    const [addTags, setAddTags] = useState<string[]>([])
    const [removeTags, setRemoveTags] = useState<string[]>([])

    return (
        <Dialog onClose={() => closeDialog()} open={open} fullWidth>
            <DialogTitle>{label}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>Taggar som skall läggas till</InputLabel>
                    <TagSelect
                        tags={definedTags}
                        selected={addTags}
                        onSelected={setAddTags}
                    />
                </FormControl>
                <FormControl fullWidth sx={{ my: 2 }}>
                    <InputLabel>Taggar som skall tas bort</InputLabel>
                    <TagSelect
                        tags={activeTags}
                        selected={removeTags}
                        onSelected={setRemoveTags}
                    />
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => closeDialog()}
                    startIcon={<CancelIcon />}
                >
                    {phrase('BULKACTION_DIALOG_CANCEL', 'Ångra')}
                </Button>
                <Button
                    color="primary"
                    onClick={() => {
                        closeDialog()
                        updateAdverts((id) =>
                            patchAdvertTags(id, {
                                add: addTags,
                                remove: removeTags,
                            })
                        )
                    }}
                    startIcon={<SaveAltIcon />}
                >
                    {phrase('BULKACTION_DIALOG_SAVE', 'Utför')}
                </Button>
            </DialogActions>
        </Dialog>
    )
}
