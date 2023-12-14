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
import { ConfigureAdvertsView } from './adverts/ConfigureAdvertsView'

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
            phrase('ADMIN_CONTENT_TITLE', 'Redaktionellt'),
            <EditContentView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ADMIN_THEME_TITLE', 'Tema'),
            <EditThemeView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ADMIN_TERMS_TITLE', 'Definitioner'),
            <EditTermsView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ADMIN_PHRASES_TITLE', 'Fraser'),
            <EditPhrasesView />
        ),
        tab(
            roles.canManageAllAdverts,
            phrase('ADMIN_ADVERTS_TITLE', 'Annonser'),
            <ConfigureAdvertsView />
        ),
        tab(
            roles.canEditSystemCategories,
            phrase('ADMIN_CATEGORIES_TITLE', 'Kategorier'),
            <EditCategoriesView />
        ),
        tab(
            roles.canEditSystemLoginPolicies,
            phrase('ADMIN_LOGINS_TITLE', 'Användare & behörigheter'),
            <EditLoginPoliciesView />
        ),
        tab(
            roles.canSeeSystemStatistics,
            phrase('ADMIN_EVENTLOG_TITLE', 'Statistikunderlag'),
            <EventLogView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ADMIN_ANALYTICS_TITLE', 'Webanalys'),
            <EditAnalyticsView />
        ),
        tab(
            roles.canEditApiKeys,
            phrase('ADMIN_APIKEYS_TITLE', 'API nycklar'),
            <EditApiKeysView />
        ),
    ]
        .filter((t) => t)
        .map((t) => t!)
