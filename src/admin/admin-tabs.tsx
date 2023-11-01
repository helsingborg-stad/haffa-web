import { HaffaUserRoles } from 'auth'
import { PhraseContextType } from 'phrases'
import { ReactNode } from 'react'
import { EditPhrasesView } from './phrases/EditPhrasesView'
import { EditThemeView } from './theme/EditThemeView'
import { EditCategoriesView } from './categories'
import { EditLoginPoliciesView } from './login'
import { EditApiKeysView } from './api-keys'
import { EditAnalyticsView } from './analytics'

const tab = (
    enabled: boolean | undefined,
    label: string,
    component: ReactNode
) =>
    enabled
        ? {
              label,
              component,
          }
        : null

export const createAdminTabs = (
    roles: HaffaUserRoles,
    phrase: PhraseContextType['phrase']
) =>
    [
        tab(
            roles.canEditTerms,
            phrase('ADMIN_THEME_TITLE', 'Tema'),
            <EditThemeView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ADMIN_PHRASES_TITLE', 'Fraser'),
            <EditPhrasesView />
        ),
        tab(
            roles.canEditSystemCategories,
            phrase('CATEGORIES_TITLE', 'Kategorier'),
            <EditCategoriesView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ANALYTICS_TITLE', 'Webanalys'),
            <EditAnalyticsView />
        ),
        tab(
            roles.canEditSystemLoginPolicies,
            phrase('LOGINS_TITLE', 'Användare & behörigheter'),
            <EditLoginPoliciesView />
        ),
        tab(
            roles.canEditApiKeys,
            phrase('APIKEYS_TITLE', 'API nycklar'),
            <EditApiKeysView />
        ),
    ]
        .filter((t) => t)
        .map((t) => t!)
