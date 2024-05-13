import { HaffaUserRoles } from 'auth'
import { PhraseContextType } from 'phrases'
import { ReactNode } from 'react'
import { EditPhrasesView } from './phrases/EditPhrasesView'
import { EditThemeView } from './theme/EditThemeView'
import { EditCategoriesView } from './categories'
import { EditLoginSettingsView } from './login'
import { EditApiKeysView } from './api-keys'
import { EditAnalyticsView } from './analytics'
import { EditTermsView } from './terms'
import { EventLogView } from './events/EventLogView'
import { EditContentView } from './content'
import { ConfigureAdvertsView } from './adverts/ConfigureAdvertsView'
import { EditLocationsView } from './locations/EditLocationsView'
import { EditSmsTemplatesView } from './sms-templates/EditSmsTemplatesView'
import { SyslogView } from './syslog/SyslogView'
import { EditHtmlView } from './html-branding'
import { EditTagDescriptionsView } from './tag-descriptions/EditTagDescriptionsView'
import { EditLabelsView } from './labels'

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
            roles.canEditTerms,
            phrase('ADMIN_HTML_TITLE', 'Html'),
            <EditHtmlView />
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
            roles.canEditTerms,
            phrase('ADMIN_TAG_DESCRIPTIONS_TITLE', 'Taggbeskrivningar'),
            <EditTagDescriptionsView />
        ),
        tab(
            roles.canEditSystemLoginPolicies,
            phrase('ADMIN_LOGINS_TITLE', 'Användare & behörigheter'),
            <EditLoginSettingsView />
        ),
        tab(
            roles.canManageLocations,
            phrase('ADMIN_LOCATIONS_TITLE', 'Adressregister'),
            <EditLocationsView />
        ),
        tab(
            roles.canEditTerms,
            phrase('ADMIN_LABELS_TITLE', 'Etiketter'),
            <EditLabelsView />
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
            roles.canManageNotifications,
            phrase('ADMIN_SMS_TEMPLATES_TITLE', 'SMS Mallar'),
            <EditSmsTemplatesView />
        ),
        tab(
            roles.canEditApiKeys,
            phrase('ADMIN_APIKEYS_TITLE', 'API nycklar'),
            <EditApiKeysView />
        ),
        tab(
            roles.canSeeSystemStatistics,
            phrase('ADMIN_SYSLOG_TITLE', 'Systemlog'),
            <SyslogView />
        ),
    ]
        .filter((t) => t)
        .map((t) => t!)
