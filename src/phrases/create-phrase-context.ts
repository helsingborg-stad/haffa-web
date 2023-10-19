import { interpolate } from 'lib/interpolate'
import dayjs from 'dayjs'
import { PhraseContextType } from './types'

const defaultPhrases: Omit<PhraseContextType, 'phrase' | 'fromNow'> &
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
    LIST_NO_MORE_ADVERTS: 'Inga fler annonser',

    ...{
        Definitioner: 'Definitioner',
        CATEGORIES_TITLE: 'Kategorier',
        LOGINS_TITLE: 'Användare & behörigheter',
        APIKEYS_TITLE: 'API nycklar',
        BRANDING_TITLE: 'Tema',
        USER_ACTION_RESERVE_ADVERT: 'Reservera',
        USER_ACTION_CANCEL_ADVERT_RESERVATION: 'Ångra mina reservationer',
        'Skriv ut QR': 'Skriv ut QR',
        Arkivera: 'Arkivera',
    },
    ...{
        Avbryt: 'Avbryt',
        UPLOAD_IMAGE: 'Välj en fin bild',
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
    }
}

export const createPhraseContext = (phrases: Record<string, string>) =>
    process.env.NODE_ENV === 'production'
        ? createProductionPhraseContext(phrases)
        : createDevelopmentPhraseContext(phrases)
