import { HaffaUserRoles } from 'auth'
import ArchiveIcon from '@mui/icons-material/Archive'
import UnarchiveIcon from '@mui/icons-material/Unarchive'
import TextSnippetIcon from '@mui/icons-material/TextSnippet'
import PrintIcon from '@mui/icons-material/Print'
import { PhraseContextType } from 'phrases'
import CategoryIcon from '@mui/icons-material/Category'
import { uniqueBy } from 'lib/unique-by'
import DateRangeIcon from '@mui/icons-material/DateRange'
import StorefrontIcon from '@mui/icons-material/Storefront'
import WarehouseIcon from '@mui/icons-material/Warehouse'
import { BulkAction } from './bulk-actions/types'
import { AdvertsTableContextType } from './AdvertsTable/types'
import {
    PatchCategoryDialog,
    PatchNumberFieldDialog,
    PatchTextFieldDialog,
} from './bulk-actions'

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
    fields,
    selectionMatches,
    archiveAdverts,
    unarchiveAdverts,
    markAdvertsAsPicked,
    markAdvertsAsUnpicked,
    createAdvertLabels,
}: AdvertsTableContextType & { roles: HaffaUserRoles } & Pick<
        PhraseContextType,
        'phrase'
    >): BulkAction[] =>
    [
        makeAction(roles.canManagePicked, {
            key: 'markAdvertsAsPicked',
            label: phrase(
                'BULKADVERTACTION_MARK_AS_PICKED',
                'Markera som plockad'
            ),
            icon: <StorefrontIcon />,
            enabled: () => selectionMatches(({ meta: { canPick } }) => canPick),
            action: markAdvertsAsPicked,
        }),
        makeAction(roles.canManagePicked, {
            key: 'markAdvertsAsUnpicked',
            label: phrase(
                'BULKADVERTACTION_MARK_AS_UNPICKED',
                'Markera som oplockad'
            ),
            icon: <WarehouseIcon />,
            enabled: () =>
                selectionMatches(({ meta: { canUnpick } }) => canUnpick),
            action: markAdvertsAsUnpicked,
        }),
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
        makeAction(roles.canEditOwnAdverts && fields.notes?.visible, {
            key: 'notes',
            icon: <TextSnippetIcon />,
            label: `Sätt ${fields.notes?.label || 'egna noteringar'}`,
            enabled: () => selectionMatches(({ meta: { canEdit } }) => canEdit),
            action: () => undefined,
            dialogAction: (params) => (
                <PatchTextFieldDialog
                    {...params}
                    inputProps={{ multiline: true, rows: 3 }}
                    label={fields.notes?.label || 'notiser'}
                    getValue={({ notes }) => notes}
                    makePatch={(notes) => ({ notes })}
                />
            ),
        }),
        makeAction(roles.canEditOwnAdverts && fields.category?.visible, {
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
        makeAction(roles.canEditOwnAdverts && fields.lendingPeriod?.visible, {
            key: 'lending-period',
            icon: <DateRangeIcon />,
            label: `Sätt ${fields.lendingPeriod?.label || 'utlåningsperiod'}`,
            enabled: () => selectionMatches(({ meta: { canEdit } }) => canEdit),
            action: () => undefined,
            dialogAction: (params) => (
                <PatchNumberFieldDialog
                    {...params}
                    inputProps={{ inputProps: { min: 0 } }}
                    label={fields.lendingPeriod?.label || ''}
                    getValue={(a) => a.lendingPeriod}
                    makePatch={(lendingPeriod) => ({ lendingPeriod })}
                />
            ),
        }),
        makeAction(roles.canEditOwnAdverts, {
            key: 'create-label',
            icon: <PrintIcon />,
            label: `Skapa etiketter`,
            enabled: () => selectionMatches(({ meta: { canEdit } }) => canEdit),
            action: createAdvertLabels,
        }),
    ]
        .filter(({ key }) => key)
        .filter(uniqueBy(({ key }) => key))
