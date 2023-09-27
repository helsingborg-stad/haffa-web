export interface PhraseContextType {
    APP_TITLE: string
    INFO_SLOW_CONNECTION: string
    ERROR_UNAUTHORIZED: string
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
    SCAN_QR_CODE: string
    PICKUP_ADVERT: string
    LIST_NO_MORE_ADVERTS: string
    phrase: (
        key: string,
        defaultTemplateString: string,
        templateVariables?: Record<string, string | number>
    ) => string
    fromNow: (date: string) => string
}
