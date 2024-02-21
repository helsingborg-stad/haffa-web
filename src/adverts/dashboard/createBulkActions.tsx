import { HaffaUserRoles } from 'auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import { PhraseContextType } from 'phrases'
import CategoryIcon from '@mui/icons-material/Category'
import { uniqueBy } from 'lib/unique-by'
import { PatchNotesDialog } from './bulk-actions'
import { BulkAction } from './bulk-actions/types'
import { AdvertsTableContextType } from './AdvertsTable/types'
import { PatchCategoryDialog } from './bulk-actions/PatchCategoryDialog'

const makeAction = (
    enabled: boolean | undefined,
    action: BulkAction
): BulkAction =>
    enabled
        ? action
        : {
              key: '',
              label: '',
              enabled: () => false,
              action: () => undefined,
          }

export const createBulkActions = ({
    phrase,
    roles,
    visibleFields,
    selectionMatches,
    archiveAdverts,
    unarchiveAdverts,
}: AdvertsTableContextType & { roles: HaffaUserRoles } & Pick<
        PhraseContextType,
        'phrase'
    >): BulkAction[] =>
    [
        makeAction(roles.canArchiveOwnAdverts, {
            key: 'archive',
            icon: <ArchiveIcon />,
            label: phrase('BULKADVERTACTION_ARCHIVE', 'Arkivera'),
            enabled: () =>
                selectionMatches(({ meta: { canArchive } }) => canArchive),
            action: archiveAdverts,
        }),
        makeAction(roles.canArchiveOwnAdverts, {
            key: 'unarchive',
            icon: <UnarchiveIcon />,
            label: phrase('BULKADVERTACTION_UNARCHIVE', 'Återställ arkiverade'),
            enabled: () =>
                selectionMatches(({ meta: { canUnarchive } }) => canUnarchive),
            action: unarchiveAdverts,
        }),
        makeAction(roles.canEditOwnAdverts && visibleFields.notes, {
            key: 'notes',
            icon: <TextSnippetIcon />,
            label: phrase('BULKADVERTACTION_EDIT_NOTES', 'Sätt notiser'),
            enabled: () => selectionMatches(({ meta: { canEdit } }) => canEdit),
            action: () => undefined,
            dialogAction: (params) => <PatchNotesDialog {...params} />,
        }),
        makeAction(roles.canEditOwnAdverts && visibleFields.category, {
            key: 'category',
            icon: <CategoryIcon />,
            label: phrase(
                'BULKADVERTACTION_EDIT_CATEGORIES',
                'Sätt kategorier'
            ),
            enabled: () => selectionMatches(({ meta: { canEdit } }) => canEdit),
            action: () => undefined,
            dialogAction: (params) => <PatchCategoryDialog {...params} />,
        }),
    ]
        .filter(({ key }) => key)
        .filter(uniqueBy(({ key }) => key))
