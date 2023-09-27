import { interpolate } from 'lib/interpolate'
import dayjs from 'dayjs'
import { PhraseContextType } from './types'

const defaultPhrases: Omit<PhraseContextType, 'phrase' | 'fromNow'> = {
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
    CREATE_ADVERT: 'Skapa annons',
    EDIT_ADVERT: 'Redigera annons',
    SAVE_ADVERT: 'Spara annonsen',
    REMOVE_ADVERT: 'Ta bort annonsen',
    EDIT_PROFILE: 'Redigera din profil',
    SAVE_PROFILE: 'Spara din profil',
    SCAN_QR_CODE: 'Skanna kod',
    PICKUP_ADVERT: 'Jag tar med mig prylen nu!',
    LIST_NO_MORE_ADVERTS: 'Inga fler annonser',
}

export const createPhraseContext = (
    phrases: Record<string, string>
): PhraseContextType => ({
    ...defaultPhrases,
    ...phrases,
    phrase: (_, template, values) =>
        values ? interpolate(template, values) : template,
    fromNow: (date) => dayjs(date).fromNow(),
})
