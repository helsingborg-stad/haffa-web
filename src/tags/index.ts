import { HaffaUserRoles } from 'auth'
import { uniqueBy } from 'lib/unique-by'
import { TagsContext, TagsProvider } from './TagsContext'
import { TagDescription } from './types'

export { TagsContext, TagsProvider }

export const getEffectiveTagDescriptions = (
    tagDescriptions: TagDescription[],
    tags: string[],
    roles: HaffaUserRoles
): TagDescription[] =>
    roles.canManageAllAdverts
        ? [
              ...tagDescriptions.map((d) => ({
                  ...d,
                  label: d.label || d.tag,
              })),
              ...tags.map((tag) => ({ tag, label: tag, description: '' })),
          ].filter(uniqueBy(({ tag }) => tag))
        : tagDescriptions
