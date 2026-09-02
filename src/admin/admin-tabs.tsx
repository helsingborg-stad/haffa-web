import CategoryIcon from '@mui/icons-material/Category'
import CommentBankIcon from '@mui/icons-material/CommentBank'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import HtmlIcon from '@mui/icons-material/Html'
import KeyIcon from '@mui/icons-material/Key'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LockIcon from '@mui/icons-material/Lock'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import SettingsIcon from '@mui/icons-material/Settings'
import SmsIcon from '@mui/icons-material/Sms'
import TimelineIcon from '@mui/icons-material/Timeline'
import TranslateIcon from '@mui/icons-material/Translate'
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline'
import VisibilityIcon from '@mui/icons-material/Visibility'
import type { HaffaUserRoles } from 'auth'
import type { PhraseContextType } from 'phrases'
import type { ReactNode } from 'react'
import { ConfigureAdvertsView } from './adverts/ConfigureAdvertsView'
import { EditAnalyticsView } from './analytics'
import { EditApiKeysView } from './api-keys'
import { EditAppSettingsView } from './app-settings'
import { EditCategoriesView } from './categories'
import { EditContentView } from './content'
import { EventLogView } from './events/EventLogView'
import { ExportAdvertsView } from './export/ExportAdvertsView'
import { EditHtmlView } from './html-branding'
import { EditLabelsView } from './labels'
import { EditLocationsView } from './locations/EditLocationsView'
import { EditLoginSettingsView } from './login'
import { EditPhrasesView } from './phrases/EditPhrasesView'
import { EditPickupLocationsView } from './pickup-locations/EditPickupLocationsView'
import { EditSmsTemplatesView } from './sms-templates/EditSmsTemplatesView'
import { SyslogView } from './syslog/SyslogView'
import { EditTagDescriptionsView } from './tag-descriptions/EditTagDescriptionsView'
import { EditTermsView } from './terms'
import { EditThemeView } from './theme/EditThemeView'

const tab = (
    enabled: boolean | undefined,
    key: string,
    label: string,
    component: ReactNode,
    icon?: ReactNode
) =>
    enabled
        ? {
              key,
              label,
              component,
              icon,
          }
        : null
export const createAdminTabs = (
    roles: HaffaUserRoles,
    phrase: PhraseContextType['phrase']
) =>
    [
        tab(
            roles.canManageContent,
            'content',
            phrase('ADMIN_CONTENT_TITLE', 'Redaktionellt'),
            <EditContentView />,
            <NewspaperIcon />
        ),
        tab(
            roles.canEditTerms,
            'theme',
            phrase('ADMIN_THEME_TITLE', 'Tema'),
            <EditThemeView />,
            <DesignServicesIcon />
        ),
        tab(
            roles.canEditTerms,
            'terms',
            phrase('ADMIN_TERMS_TITLE', 'Definitioner'),
            <EditTermsView />,
            <FactCheckIcon />
        ),
        tab(
            roles.canEditTerms,
            'phrases',
            phrase('ADMIN_PHRASES_TITLE', 'Fraser'),
            <EditPhrasesView />,
            <TranslateIcon />
        ),
        tab(
            roles.canEditTerms,
            'html',
            phrase('ADMIN_HTML_TITLE', 'Html'),
            <EditHtmlView />,
            <HtmlIcon />
        ),
        tab(
            roles.canManageAllAdverts,
            'adverts',
            phrase('ADMIN_ADVERTS_TITLE', 'Annonser'),
            <ConfigureAdvertsView />,
            <VisibilityIcon />
        ),
        tab(
            roles.canEditSystemCategories,
            'categories',
            phrase('ADMIN_CATEGORIES_TITLE', 'Kategorier'),
            <EditCategoriesView />,
            <CategoryIcon />
        ),
        tab(
            roles.canEditTerms,
            'tags',
            phrase('ADMIN_TAG_DESCRIPTIONS_TITLE', 'Taggbeskrivningar'),
            <EditTagDescriptionsView />,
            <CommentBankIcon />
        ),
        tab(
            roles.canEditSystemLoginPolicies,
            'logins',
            phrase('ADMIN_LOGINS_TITLE', 'Användare & behörigheter'),
            <EditLoginSettingsView />,
            <LockIcon />
        ),
        tab(
            roles.canManageLocations,
            'locations',
            phrase('ADMIN_LOCATIONS_TITLE', 'Adressregister'),
            <EditLocationsView />,
            <LocationOnIcon />
        ),
        tab(
            roles.canManageLocations,
            'pickup-locations',
            phrase('ADMIN_PICKUPLOCATIONS_TITLE', 'Utlämningsplatser'),
            <EditPickupLocationsView />,
            <LocalShippingIcon />
        ),
        tab(
            roles.canEditTerms,
            'labels',
            phrase('ADMIN_LABELS_TITLE', 'Etiketter'),
            <EditLabelsView />,
            <QrCode2Icon />
        ),
        tab(
            roles.canSeeSystemStatistics,
            'eventlog',
            phrase('ADMIN_EVENTLOG_TITLE', 'Statistikunderlag'),
            <EventLogView />,
            <ViewTimelineIcon />
        ),
        tab(
            roles.canEditTerms,
            'analytics',
            phrase('ADMIN_ANALYTICS_TITLE', 'Webanalys'),
            <EditAnalyticsView />,
            <QueryStatsIcon />
        ),
        tab(
            roles.canManageNotifications,
            'sms-templates',
            phrase('ADMIN_SMS_TEMPLATES_TITLE', 'SMS Mallar'),
            <EditSmsTemplatesView />,
            <SmsIcon />
        ),
        tab(
            roles.canEditApiKeys,
            'api-keys',
            phrase('ADMIN_APIKEYS_TITLE', 'API nycklar'),
            <EditApiKeysView />,
            <KeyIcon />
        ),
        tab(
            roles.canSeeSystemStatistics,
            'systemlog',
            phrase('ADMIN_SYSLOG_TITLE', 'Systemlog'),
            <SyslogView />,
            <TimelineIcon />
        ),
        tab(
            roles.canManageAllAdverts,
            'export-adverts',
            'Exportera',
            <ExportAdvertsView />,
            <FileDownloadIcon />
        ),
        tab(
            roles.canEditTerms,
            'app-settings',
            phrase('ADMIN_APP_SETTINGS_TITLE', 'Allmänt'),
            <EditAppSettingsView />,
            <SettingsIcon />
        ),
    ]
        .filter((t) => t)
        .map((t) => t!)
