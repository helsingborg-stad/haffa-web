import { HaffaUserRoles } from 'auth'
import { PhraseContextType } from 'phrases'
import { ReactNode } from 'react'
import NewspaperIcon from '@mui/icons-material/Newspaper'
import DesignServicesIcon from '@mui/icons-material/DesignServices'
import FactCheckIcon from '@mui/icons-material/FactCheck'
import HtmlIcon from '@mui/icons-material/Html'
import FileDownloadIcon from '@mui/icons-material/FileDownload'
import TimelineIcon from '@mui/icons-material/Timeline'
import KeyIcon from '@mui/icons-material/Key'
import SmsIcon from '@mui/icons-material/Sms'
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import QrCode2Icon from '@mui/icons-material/QrCode2'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import LockIcon from '@mui/icons-material/Lock'
import VisibilityIcon from '@mui/icons-material/Visibility'
import CategoryIcon from '@mui/icons-material/Category'
import CommentBankIcon from '@mui/icons-material/CommentBank'
import TranslateIcon from '@mui/icons-material/Translate'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
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
import { ExportAdvertsView } from './export/ExportAdvertsView'
import { EditPickupLocationsView } from './pickup-locations/EditPickupLocationsView'

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
    ]
        .filter((t) => t)
        .map((t) => t!)
