import { HaffaUserRoles } from 'auth'
import { PhraseContextType } from 'phrases'
import { ReactNode } from 'react'
import { EditPhrasesView } from './phrases/EditPhrasesView'
import { EditThemeView } from './theme/EditThemeView'
import { EditCategoriesView } from './categories'
import { EditLoginPoliciesView } from './login'
import { EditApiKeysView } from './api-keys'
import { EditAnalyticsView } from './analytics'
import { EditTermsView } from './terms'
import { EventLogView } from './events/EventLogView'
import { EditContentView } from './content'

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
            roles.canManageContent,
            phrase('CONTENT_TITLE', 'Redaktionellt'),
            <EditContentView />
        ),
        tab(
            roles.canEditTerms,
            phrase('THEME_TITLE', 'Tema'),
            <EditThemeView />
        ),
        tab(
            roles.canEditTerms,
            phrase('TERMS_TITLE', 'Definitioner'),
            <EditTermsView />
        ),
        tab(
            roles.canEditTerms,
            phrase('PHRASES_TITLE', 'Fraser'),
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
        tab(
            roles.canSeeSystemStatistics,
            phrase('EVENTLOG_TITLE', 'Statistikunderlag'),
            <EventLogView />
        ),
    ]
        .filter((t) => t)
        .map((t) => t!)
