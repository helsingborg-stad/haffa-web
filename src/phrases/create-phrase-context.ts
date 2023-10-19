import { interpolate } from 'lib/interpolate'
import dayjs from 'dayjs'
import { PhraseContextType } from './types'

const defaultPhrases: Omit<
    PhraseContextType,
    'phrase' | 'fromNow' | 'getConfig'
> &
    Record<string, string> = {
    APP_TITLE: 'Haffa!',
    INFO_SLOW_CONNECTION: '... väntar på innehåll från servern ...',
    ERROR_UNAUTHORIZED: 'Du saknar behörighet.',
    ERROR_NOT_FOUND: 'Hoppsan, vi kan inte hitta sidan eller resursen.',
    ERROR_UNKNOWN: 'Något gick fel. Försök igen.',
    SIGNOUT: 'Logga ut',
    NAV_HOME: 'Hem',
    NAV_MY_ADVERTS: 'Mina annonser',
    NAV_MY_RESERVATIONS: 'Haffat!',
    NAV_PROFILE: 'Min profil',
    CREATE_ADVERT: 'Ny annons',
    EDIT_ADVERT: 'Redigera annons',
    SAVE_ADVERT: 'Spara annonsen',
    REMOVE_ADVERT: 'Ta bort annonsen',
    EDIT_PROFILE: 'Redigera din profil',
    SAVE_PROFILE: 'Spara din profil',
    SCAN_QR_CODE: 'Skanna',
    PICKUP_ADVERT: 'Hämta pryl',

    ...{
        CATEGORIES_TITLE: 'Kategorier',
        LOGINS_TITLE: 'Användare & behörigheter',
        APIKEYS_TITLE: 'API nycklar',
        BRANDING_TITLE: 'Tema',
        THEME_EDITORIAL: 'Definitioner för tema',
        THEME_PROP_PRIMARY_COLOR: 'Primär färg',
        THEME_PROP_SECONDARY_COLOR: 'Sekundär färg',
        THEME_SAVE: 'Spara',
        THEME_RESTORE: 'Återställ',
        TERMS_FIELD_ORGANIZATION: 'Organisationer',
        TERMS_FIELD_UNIT: 'Enheter',
        TERMS_FIELD_MATERIAL: 'Material',
        TERMS_FIELD_CONDITION: 'Skick',
        TERMS_FIELD_USAGE: 'Användningsområden',
        CATEGORIES_ALL_PLACEHOLDER: 'Alla Kategorier (platshållare)',
        CATEGORIES_ADD: 'Lägg till ny kategori',
        CATEGORIES_REMOVE: 'Ta bort kategori',
        CATEGORIES_SAVE: 'Spara',
        LOGINS_FIELD_PERMISSIONS: 'Email & behörigheter',
        LOGINS_DENY: 'Neka',
        LOGINS_FIELD_EMAIL: 'Email',
        LOGINS_ADD_RULE: 'Lägg till regel',
        LOGINS_SAVE: 'Spara',
        ROLES_CAN_EDIT_OWN_ADVERTS: 'Skapa annonser',
        ROLES_CAN_ARCHIVE_OWN_ADVERTS: 'Arkivera egna annonser',
        ROLES_CAN_REMOVE_OWN_ADVERTS: 'Ta bort egna annonser',
        ROLES_CAN_RESERVE_ADVERTS: 'Reservera annonser',
        ROLES_CAN_COLLECT_ADVERTS: 'Hämta ut annonser',
        ROLES_CAN_MANAGE_OWN_ADVERTS_HISTORY: 'Hantera egna annonsers historik',
        ROLES_CAN_MANAGE_ALL_ADVERTS:
            'Hantera egna och andras annonser (admin)',
        ROLES_CAN_EDIT_TERMS: 'Hantera definitioner (admin)',
        ROLES_CAN_EDIT_SYSTEM_CATEGORIES: 'Hantera system kategorier (admin)',
        ROLES_CAN_EDIT_SYSTEM_LOGIN_POLICIES:
            'Hantera systemets användare & behörigheter (admin)',
        ROLES_CAN_EDIT_API_KEYS: 'Hantera API nycklar',
        ROLES_CAN_RUN_SYSTEM_JOBS: 'Agent som får köra jobb (admin)',
        ROLES_SELECT_LABEL: 'Behörigheter',
        APIKEYS_FIELD_EMAIL: 'Email',
        APIKEYS_FIELD_KEY: 'Nyckel',
        APIKEYS_FIELD_EXPIRES: 'Giltig till',
        APIKEYS_ADD: 'Lägg till nyckel',
        APIKEYS_SAVE: 'Spara',
        PHRASES_FIELD_VALUE: 'Värde',
        PHRASES_FIELD_DEFAULT: 'Frabriksinställning',
        PHRASES_FIELD_KEY: 'ID',
    },
}

const createProductionPhraseContext = (
    phrases: Record<string, string>
): PhraseContextType => ({
    ...defaultPhrases,
    ...phrases,
    phrase: (_, template, values) =>
        values ? interpolate(template, values) : template,
    fromNow: (date) => dayjs(date).fromNow(),
    getConfig: () =>
        Object.entries(defaultPhrases).map(([key, template]) => ({
            key,
            template,
            actual: phrases[key] || '',
        })),
})

const createDevelopmentPhraseContext = (
    phrases: Record<string, string>
): PhraseContextType => {
    const recordings: Record<string, string> = {}
    const phrase: PhraseContextType['phrase'] = (key, template, values) => {
        const p = values ? interpolate(template, values) : template

        if (!key) {
            console.warn(`[phrases] use of unkeyed phrase ${template}`)
            return p
        }

        if (
            Object.hasOwn(defaultPhrases, key) &&
            defaultPhrases[key] !== template
        ) {
            console.warn(`[phrases] ${key} has different defaults`, {
                fromCode: template,
                fromDefinition: defaultPhrases[key],
            })
        }

        if (!recordings[key] && !Object.hasOwn(defaultPhrases, key)) {
            recordings[key] = p
            // console.log(`new phrase: ${key} => ${p}`)
            console.warn(
                `unknown phrase (${key},"${p}"). consider extending phrase config with `,
                recordings
            )
        }
        return p
    }
    const convertToGetters = (o: Record<string, string>) =>
        Object.entries(o).reduce(
            (g, [key, value]) => ({
                ...g,
                get [key]() {
                    return phrase(key, value)
                },
            }),
            {}
        )

    return {
        ...defaultPhrases,
        ...convertToGetters({
            ...defaultPhrases,
            ...phrases,
        }),
        phrase,
        fromNow: (date) => dayjs(date).fromNow(),
        getConfig: () =>
            Object.entries(defaultPhrases).map(([key, template]) => ({
                key,
                template,
                actual: phrases[key] || '',
            })),
    }
}

export const createPhraseContext = (phrases: Record<string, string>) =>
    process.env.NODE_ENV === 'production'
        ? createProductionPhraseContext(phrases)
        : createDevelopmentPhraseContext(phrases)
