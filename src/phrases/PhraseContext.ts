import { createContext } from 'react'

export interface PhraseContextType {
    APP_TITLE: string
    ERROR_NOT_FOUND: string
    ERROR_UNKNOWN: string
    NAV_HOME: string
    NAV_MY_ADVERTS: string
    NAV_PROFILE: string
    CREATE_ADVERT: string
    EDIT_ADVERT: string
    SAVE_ADVERT: string
    phrase: (key: string, defaultValue: string) => string
}
export const PhraseContext = createContext<PhraseContextType>({
    get APP_TITLE() {
        return 'Haffa!'
    },
    get ERROR_NOT_FOUND() {
        return 'Hoppsan, vi kan inte hitta sidan eller resursen.'
    },
    get ERROR_UNKNOWN() {
        return 'Ajsing bajsing, nu gick något lite åt pipsvängen'
    },
    get NAV_HOME() {
        return 'Hem'
    },
    get NAV_MY_ADVERTS() {
        return 'Mina annonser'
    },
    get NAV_PROFILE() {
        return 'Min profil'
    },
    get CREATE_ADVERT() {
        return 'Skapa annons'
    },
    get EDIT_ADVERT() {
        return 'Redigera annons'
    },
    get SAVE_ADVERT() {
        return 'Spara annonsen'
    },
    phrase: (key, v) => v,
})
