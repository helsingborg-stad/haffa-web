import { createContext } from 'react'

export interface PhraseContextType {
    APP_TITLE: string
    ERROR_NOT_FOUND: string
    ERROR_UNKNOWN: string
    SIGNOUT: string
    NAV_HOME: string
    NAV_MY_ADVERTS: string
    NAV_MY_RESERVATIONS: string
    NAV_PROFILE: string
    CREATE_ADVERT: string
    EDIT_ADVERT: string
    SAVE_ADVERT: string
    REMOVE_ADVERT: string
    EDIT_PROFILE: string
    SAVE_PROFILE: string
    phrase: (key: string, defaultValue: string) => string
}
export const PhraseContext = createContext<PhraseContextType>({
    APP_TITLE: 'Haffa!',
    ERROR_NOT_FOUND: 'Hoppsan, vi kan inte hitta sidan eller resursen.',
    ERROR_UNKNOWN: 'Ajsing bajsing, nu gick något lite åt pipsvängen',
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
    phrase: (_, v) => v,
})
