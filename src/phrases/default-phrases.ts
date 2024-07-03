import { PhraseContextType } from 'phrases'

import profile from './defaults/profile'
import terms from './defaults/terms'
import auth from './defaults/auth'
import sms from './defaults/sms'
import bulkActions from './defaults/bulk-actions'

export const defaultPhrases: Omit<
    PhraseContextType,
    'phrase' | 'fromNow' | 'getConfig' | 'prettyDate'
> &
    Record<string, string> = {
    ...auth,
    ...profile,
    ...sms,
    ...terms,
    ...bulkActions,

    APP_TITLE: 'Haffa!',
    INFO_SLOW_CONNECTION: '... väntar på innehåll från servern ...',
    ERROR_UNAUTHORIZED: 'Du saknar behörighet.',
    ERROR_NOT_FOUND: 'Hoppsan, vi kan inte hitta sidan eller resursen.\n',
    ERROR_UNKNOWN: 'Något gick fel. Försök igen.\n',
    SIGNOUT: 'Logga ut',
    NAV_HOME: 'Hem',
    NAV_BROWSE: 'Annonser',
    NAV_CREATE: 'Skapa',
    NAV_MY_ADVERTS: 'Mina annonser',
    NAV_MY_RESERVATIONS: 'Haffat!',
    NAV_PROFILE: 'Min profil',
    NAV_ABOUT_HAFFA: 'Om Haffa',
    NAV_ADMIN: 'Administration',
    ADVERT_CREATE: 'Ny annons',
    ADVERT_EDIT: 'Redigera annons',
    ADVERT_EDIT_SAVE: 'Spara annonsen',
    ADVERT_EDIT_CANCEL: 'Avbryt',
    ADVERT_REMOVE: 'Ta bort annonsen',
    ADVERT_COLLECT: 'Hämta pryl',
    ADVERT_RESERVE: 'Reservera',
    ADVERT_RETURN: 'Återlämna',
    ADVERT_CANCEL_RESERVATION: 'Ångra mina reservationer',
    ADVERT_PRINT_QRCODE: 'Skriv ut QR',
    ADVERT_ARCHIVE: 'Arkivera',
    ADVERT_JOIN_WAITLIST: 'Bevaka denna annons',
    ADVERT_LEAVE_WAITLIST: 'Sluta bevaka denna annons',
    ADVERT_MARK_AS_UNPICKED: 'Markera som oplockad',
    ADVERT_MARK_AS_PICKED: 'Markera som plockad',
    SCAN_QR_CODE: 'Skanna',
    SUBSCRIPTIONS_SUBSCRIBE_TO_SEARCH: 'Bevaka denna sökning',
    SUBSCRIPTIONS_UNSUBSCRIBE_TO_SEARCH: 'Ta bort bevakning',
    SUBSCRIPTIONS_NAVIGATE_TO_SEARCH: 'Visa',
    SUBSCRIPTIONS_HEADING: 'Bevakningar',
    SUNSCRIPTIONS_EDITORIAL:
        'Du kan skapa en bevakning på en filtrering eller sökning. Du får ett mail när något nytt, som matchar din bevakning har dykt upp i Haffa.',
    SUBSCRIPTIONS_NO_CONTENT: 'Du har inte skapat några bevakningar än.',
    NOTIFICATIONS_ADVERT_WAS_CREATED: 'Annonsen har skapats',
    NOTIFICATIONS_ADVERT_WAS_UPDATED: 'Annonsen har uppdaterats',
    NOTIFICATIONS_ADVERT_WAS_REMOVED: 'Annonsen har tagits bort',
    NOTIFICATIONS_ADVERT_WAS_ARCHIVED: 'Annonsen är nu arkiverad',
    NOTIFICATIONS_ADVERT_WAS_UNARCHIVED: 'Annonsen är återställd från arkivet',
    NOTIFICATIONS_ADVERT_WAS_RESERVED: 'Annonsen är reserverad',
    NOTIFICATIONS_ADVERT_RESERVATION_WAS_CANCELLED:
        'Reservationen är borttagen',
    NOTIFICATIONS_ADVERT_WAS_COLLECTED:
        'Annonsartikeln är markerad som uthämtad',
    NOTIFICATIONS_ADVERT_CLAIM_WAS_REMOVED: 'Markeringen är borttagningen',
    NOTIFICATIONS_ADVERT_CLAIM_WAS_CHANGED: 'Markeringen har ändrats',
    NOTIFICATIONS_ADVERT_WAS_RETURNED: 'Artikeln har återlämnats',
    NOTIFICATIONS_ADVERT_JOIN_WAITLIST: 'Du bevakar nu annonsen',
    NOTIFICATIONS_ADVERT_LEAVE_WAITLIST: 'Bevakningen är borttagen',
    NOTIFICATIONS_ADVERT_PICKED: 'Annonsen är markerad som plockad',
    NOTIFICATIONS_ADVERT_UNPICKED: 'Annonsen är markerad som oplockad',
    NOTIFICATIONS_APIKEYS_WAS_UPDATED: 'API nycklar är uppdaterade',
    NOTIFICATIONS_CATEGORIES_WAS_UPDATED: 'Inställningarna är sparade',
    NOTIFICATIONS_LOGINS_WAS_UPDATED: 'Inställningarna är sparade',
    NOTIFICATIONS_OPTIONS_WAS_UPDATED: 'Dina ändringar är sparade',
    NOTIFICATIONS_LOCATION_WAS_UPDATED: 'Adressregistret uppdaterades',
    NOTIFICATIONS_PROFILE_WAS_UPDATED: 'Din profil är uppdaterad',
    NOTIFICATIONS_TERMS_WAS_UPDATED: 'Definitionerna är uppdaterade',
    NOTIFICATIONS_PROFILE_WAS_REMOVED: 'Din profil är borttagen',
    NOTIFICATIONS_CONTENT_WAS_UPDATED: 'Innehållet är uppdaterat',
    NOTIFICATIONS_ADVERT_FIELD_CONFIG_WAS_UPDATED:
        'Definitionerna är uppdaterade',
    SORT_OPTION_TITLE_ASC: 'A-Ö',
    SORT_OPTION_TITLE_DESC: 'Ö-A',
    SORT_OPTION_CREATEDAT_ASC: 'Äldst',
    SORT_OPTION_CREATEDAT_DESC: 'Nyast',
    SEARCH_EMPTY_RESULT: 'Hoppsan, det blev inga träffar på den\n',
    CATEGORIES_ALL_PLACEHOLDER: 'Alla Kategorier (platshållare)',
    CATEGORIES_ADD: 'Lägg till ny kategori',
    CATEGORIES_REMOVE: 'Ta bort kategori',
    CATEGORIES_SAVE: 'Spara',
    CATEGORIES_FIELD_C02: 'CO₂ besparing',
    CATEGORIES_FIELD_VALUE: 'Kostnadsvärdering',
    CATEGORIES_FIELD_LABEL: 'Benämning',
    CATEGORIES_INFO_CONECTED_ADVERTS:
        'Denna kategori har {count} kopplade annonser',

    // ***********************************************
    // Roles used by the system
    // ***********************************************
    ROLES_CAN_EDIT_OWN_ADVERTS: 'Skapa annonser',
    ROLES_CAN_ARCHIVE_OWN_ADVERTS: 'Arkivera egna annonser',
    ROLES_CAN_REMOVE_OWN_ADVERTS: 'Ta bort egna annonser',
    ROLES_CAN_RESERVE_ADVERTS: 'Reservera annonser',
    ROLES_CAN_COLLECT_ADVERTS: 'Hämta ut annonser',
    ROLES_CAN_MANAGE_OWN_ADVERTS_HISTORY: 'Hantera egna annonsers historik',
    ROLES_CAN_MANAGE_PROFILE: 'Hantera egen profil',
    ROLES_CAN_JOIN_WAITLIST: 'Vänta på annons',
    ROLES_CAN_MANAGE_ALL_ADVERTS: 'Hantera egna och andras annonser (admin)',
    ROLES_CAN_EDIT_TERMS: 'Hantera definitioner (admin)',
    ROLES_CAN_EDIT_SYSTEM_CATEGORIES: 'Hantera system kategorier (admin)',
    ROLES_CAN_EDIT_SYSTEM_LOGIN_POLICIES:
        'Hantera systemets användare & behörigheter (admin)',
    ROLES_CAN_EDIT_API_KEYS: 'Hantera API nycklar',
    ROLES_CAN_RUN_SYSTEM_JOBS: 'Agent som får köra jobb (admin)',
    ROLES_CAN_SUBSCRIBE: 'Bevaka annonser',
    ROLES_CAN_SEE_SYSTEM_STATISTICS: 'Se statistikunderlag',
    ROLES_CAN_MANAGE_CONTENT: 'Managera innehåll (admin)',
    ROLES_CAN_MANAGE_LOCATIONS: 'Managera adressregistret (admin)',
    ROLES_CAN_MANAGE_RETURNS: 'Hantera återlämningar (admin)',
    ROLES_CAN_MANAGE_PICKED: 'Hantera plockning (admin)',
    ROLES_CAN_MANAGE_NOTIFICATIONS: 'Managera notifikationer (admin)',
    ROLES_SELECT_LABEL: 'Behörigheter',
    APIKEYS_FIELD_EMAIL: 'Email',
    APIKEYS_FIELD_KEY: 'Nyckel',
    APIKEYS_FIELD_EXPIRES: 'Giltig till',
    APIKEYS_ADD: 'Lägg till nyckel',
    PHRASES_FIELD_VALUE: 'Värde',
    PHRASES_FIELD_DEFAULT: 'Fabriksinställning',
    PHRASES_FIELD_KEY: 'ID',
    ADVERT_EDITOR_SECTION_NOTES:
        'Era egna privata noteringar angående denna annons',
    ADVERT_EDITOR_SECTION_DESCRIPTION:
        'Beskriv din annons så att den blir sökbar och ser fin ut i listningen.',
    ADVERT_EDITOR_SECTION_IMAGES: 'En bild säger mer än tusen ord!',
    ADVERT_EDITOR_SECTION_LOCATION: 'Var finns prylen?',
    ADVERT_EDITOR_SECTION_CONTACT: 'Vem kan man kontakta angående haffningar?',
    ADVERT_EDITOR_SECTION_ADDITIONAL:
        'Om det är viktigt, kan du ange ytterligare detaljer här.',
    ADVERT_FIELD_CATEGORY: 'Kategori',
    ADVERT_FIELD_ORGANIZATION: 'Organisation',
    ADVERT_FIELD_CREATED: 'Publicerades',
    ADVERT_FIELD_HEADING: 'Produktinformation',
    ADVERT_FIELD_TAGS: 'Taggar',
    ADVERT_FIELD_TAGS_LABEL:
        'Tagga din annons för att göra det lättare att hitta den',
    ADVERT_FIELD_TAGS_PLACEHOLDER: 'Klicka för att lägga till',
    ADVERT_FIELD_CONTACT_TITLE: 'Kontakt',
    ADVERT_FIELD_ADDRESS_TITLE: 'Adress för avhämtning',
    ADVERT_FIELD_QUANTITY: 'Antal',
    ADVERT_TYPE_RECYCLE: 'Återbruk',
    ADVERT_UPLOAD_IMAGE: 'Välj en fin bild',
    ADVERT_BUTTON_SYNCH_FROM_PROFILE: 'Hämta från min profil',
    ADVERT_BUTTON_SYNCH_TO_PROFILE: 'Uppdatera min profil',
    MYADVERTS_NOT_ARCHIVED: 'Alla',
    MYADVERTS_ACTIVE: 'Aktiva',
    MYADVERTS_RESERVED: 'Reserverade',
    MYADVERTS_COLLECTED: 'Uthämtade',
    MYADVERTS_ARCHIVED: 'Arkiverade',
    MYRESERVATIONS_RESERVED: 'Reserverade',
    MYRESERVATIONS_COLLECTED: 'Uthämtat',
    MYADVERTS_PICKED: 'Plockade',
    ADVERT_IS_COLLECTED_BY_YOU: 'Du har hämtat {count} {unit}',
    ADVERT_IS_BORROWED_BY_YOU: 'Du har lånat {count} {unit} till och med {at}',
    ADVERT_CLAIM_IS_COLLECTED: '{by} hämtade {quantity} {unit} {at}',
    ADVERT_CLAIMS_MANAGE_TITLE: 'Välj hantering',
    ADVERT_CLAIMS_CANCEL_COLLECT: 'Ångra hämtning',
    ADVERT_CLAIMS_CHANGE_TO_RESERVED: 'Ändra till reservation',
    ADVERT_CLAIMS_EXTEND_RESERVATION: 'Förnya reservation',
    ADVERT_CLAIMS_EXTEND_COLLECT: 'Förnya utlåning',
    ADVERT_CLAIM_COLLECT_REMINDER: 'Påminnelse för återlämning har skickats',
    ADVERT_CLAIM_RESERVE_REMINDER: 'Påminnelse för uthämtning har skickats',
    ADVERT_IS_RESERVED_BY_YOU: 'Du har reserverat {count} {unit}',
    ADVERT_WILL_BE_RETURNED: 'Åter {at}',
    ADVERT_CLAIM_IS_RESERVED: '{by} reserverade {quantity} {unit} {at}',
    ADVERT_CLAIMS_CANCEL_RESERVATION: 'Ångra reservation',
    ADVERT_CLAIMS_COLLECT_MANUALLY: 'Lämna ut manuellt',
    ADVERT_CLAIMS_HAS_RESERVATIONS: 'Reserverad',
    ADVERT_CLAIMS_HAS_COLLECTS: 'Utlånad',
    ADVERT_IMPERSONATION_EDITORIAL:
        'Du har givits rättigheter att adminstrera denna annons trots att den tillhör någon annan.',
    ADVERT_RETURN_EDITORIAL:
        'Artikeln är utlånad och kan efter mottagningskontroll återföras till lagret.',
    ADVERT_MARK_AS_PICKED_EDITORIAL: `Markera annonsen som plockad om du vill notifiera reservatörer om att varan kan hämtas.`,
    ADVERT_MARK_AS_UNPICKED_EDITORIAL: `Markera annonsen som oplockad om den återförs till lagret och inte kan hämtas ut direkt.`,
    LOGINS_EFECTIVE_PERMISSIONS: 'Effektiva behörigheter',
    LOGINS_EDITORIAL: `
Här anges vilka användare som ges eller nekas tillträde till sajten.
Användare matchas mot email

- *@exempel.se matchar alla som tillhör emaildomänen @exempel.se
- test@exempel.se matchar användare exakt

Regler utan email tas automatiskt bort.`,
    LOGINS_EFFECTIVE_EMAIL: 'Email',
    LOGINS_FIELD_PERMISSIONS: 'Email & behörigheter',
    LOGINS_DENY: 'Neka',
    LOGINS_FIELD_EMAIL: 'Email',
    LOGINS_ADD_RULE: 'Lägg till regel',
    PHONE_ACCESS_TITLE: 'Telefon & behörigheter',
    PUBLIC_ACCESS_TITLE: 'Publik åtkomst',
    PHONE_ACCESS_ALLOW: 'Tillåt inloggning med telefon/SMS',
    LOGINS_FIELD_PHONE_SENDER: 'Sändarnamn',
    LOGINS_FIELD_PHONE_VALIDATION_COUNTRY:
        'Landskod för validering av telefonnummer',
    // ***********************************************
    // Admin pages editorials
    // ***********************************************
    ADMIN_CONTENT_TITLE: 'Redaktionellt',
    ADMIN_CONTENT_HEADLINE: 'Skapa ditt eget innehåll',
    ADMIN_CONTENT_BODY:
        'Här kan du skapa och ändra innehåll som visas på startsidan.',
    ADMIN_THEME_TITLE: 'Tema',
    ADMIN_THEME_HEADLINE: 'Ge Haffa din egen stil',
    ADMIN_THEME_BODY:
        'Ändra färger och utseende så att Haffa passar just din organistion',
    ADMIN_THEME_EMPTY:
        'Din startsida är tom! Klicka på knappen Ny Rad för att skapa nytt innehåll',
    ADMIN_TERMS_TITLE: 'Definitioner',
    ADMIN_TERMS_HEADLINE: 'Konfigurera termer och definitioner',
    ADMIN_TERMS_BODY:
        'Definitioner editeras som textblock där varje rad utgör ett valbart värde i profil och annonseditor. Ändringar i definitioner uppdaterar inte existerande profiler och annonser och kan påverka statistiken negativt.',
    ADMIN_PHRASES_TITLE: 'Fraser',
    ADMIN_PHRASES_HEADLINE: 'Vill du ändra en text?',
    ADMIN_PHRASES_BODY:
        'Här finns de flesta texter som visas på element och knappar i Haffa.',
    ADMIN_HTML_TITLE: 'HTML',
    ADMIN_HTML_HEADLINE: 'Texter och inställningar för HTML',
    ADMIN_HTML_BODY:
        'Här anger du information som visas när du delar en sida i appen',
    ADMIN_CATEGORIES_TITLE: 'Kategorier',
    ADMIN_CATEGORIES_HEADLINE: 'Ordning och reda!',
    ADMIN_CATEGORIES_BODY:
        'Skapa kategorier för dina annonser så att användare kan filtrera på det de letar efter',

    ADMIN_LOGINS_TITLE: 'Användare & behörigheter',
    ADMIN_LOGINS_HEADLINE: 'Användarhantering',
    ADMIN_LOGINS_BODY:
        'Se till att kunderna får tillgång till Haffa och att dina medarbetara kan arbeta effektivt',

    ADMIN_LOCATIONS_TITLE: 'Adressregister',
    ADMIN_LOCATIONS_HEADLINE: 'Adressregistret',
    ADMIN_LOCATIONS_BODY:
        'Här kan du ange utlämningsadresser som sedan blir valbara när du skapar annonser.',
    ADMIN_LOCATIONS_EMPTY:
        'Du har inte lagt in några adresser i registret än! Klicka på knappen Ny Adress för att skapa en ny post',

    ADMIN_ADVERTS_TITLE: 'Annonser',
    ADMIN_ADVERTS_HEADLINE: 'Skräddarsy dina annonser',
    ADMIN_ADVERTS_BODY:
        'Här kan du ändra konfigurera vilka fält som används och om de skall vara obligatoriska eller ej',

    ADMIN_EVENTLOG_TITLE: 'Statistikunderlag',
    ADMIN_EVENTLOG_HEADLINE: 'Uppföljning och statistik',
    ADMIN_EVENTLOG_BODY:
        'Hur vet jag hur Haffa gör skillnad? Här finns statistik för analys och uppföljning',

    ADMIN_ANALYTICS_TITLE: 'Webanalys',
    ADMIN_ANALYTICS_HEADLINE: 'Inställningar för webbanalys',
    ADMIN_ANALYTICS_BODY:
        'Om du vill följa upp besökarstatistik för Haffa och har en behållare i en tagghanterare så kan du aktivera den här.',

    ADMIN_APIKEYS_TITLE: 'API nycklar',
    ADMIN_APIKEYS_HEADLINE: 'Automatisera mera',
    ADMIN_APIKEYS_BODY:
        'För att köra schemalagda jobb behöver du en API nyckel',

    ADMIN_SYSLOG_TITLE: 'Systemlog',
    ADMIN_SYSLOG_HEADLINE: 'Kör dina schemalagda jobb?',
    ADMIN_SYSLOG_BODY: 'Här kan du se så alla viktiga händelser i systemet.',

    ADMIN_TAG_DESCRIPTIONS_TITLE: 'Taggbeskrivningar',
    ADMIN_TAG_DESCRIPTIONS_HEADLINE: 'Visa innehåll baserat på annonstaggar',
    ADMIN_TAG_DESCRIPTIONS_BODY:
        'Taggade annonser kommer att visas med associerad text (markdown) som redigeras på denna sida.',

    ADMIN_LABELS_TITLE: 'Etiketter',
    ADMIN_LABELS_HEADLINE: 'Etiketter',
    ADMIN_LABELS_BODY:
        'Här kan du utforma hur dina utskrivningsbara etiketter skall se ut.',

    ADMIN_ACTION_SAVE: 'Spara',
    ADMIN_ACTION_RESTORE: 'Återställ',

    EVENTLOG_FIELD_EVENT: 'Händelse',
    EVENTLOG_FIELD_DAY: 'Dag',
    EVENTLOG_FIELD_USER: 'Användare',
    EVENTLOG_FIELD_BYORGANIZATION: 'Användarens organisation',
    EVENTLOG_EXPORT_FILENAME: 'Filnamn',
    EVENTLOG_EXPOR_FILENAME: 'Exportera till excel',
    DIALOG_FILTER_TITLE: 'Filter',
    DIALOG_FILTER_SAVE: 'Spara',
    DIALOG_FILTER_CLEAR: 'Rensa',
    APP_GENERIC_SEARCH: 'Sök...',
    APIKEYS_EDITORIAL: `
API nycklar används för icke-interaktiva integrationer och möjliggör externa tjänster att autentisera (via nyckel) och auktorisera (via email) gentemot tjänster i Haffa.

Givet api nyckel i auktoriseringsheader körs ett anrop som användaren angivet i email.

> curl -H "Authorization: api-key <nycklel>" https://<haffa>
`,
    ABOUT_HAFFA_EDITORIAL: `
# Om HAFFA
Obs! detta är exempeltext som du bör ersätta för att passa din organisation! Du kan göra anpassningar genon att editera frasen ABOUT_HAFFA_EDITORIAL

### Villkor
Villkoren för att använda Haffa kan du hitta här:
[https://min-organisation.se/villkor](https://min-organisation.se/villkor)

### Kontakta oss
Frågor om plattformen? Maila: 
[haffa-ansvarig@min-organisation.se](mailto:haffa-ansvarig@min-organisation.se)
`,
    ...{
        CONFIRM_DIALOG_TITLE: 'Är du säker?',
        CONFIRM_DIALOG_CANCEL: 'Nej, avbryt',
        CONFIRM_DIALOG_PROCEED: 'Ja, fortsätt',
    },
}
