export interface PhraseDefinition {
    key: string
    template: string
    actual: string
    multiline: boolean
}
export interface PhraseContextType {
    APP_TITLE: string
    INFO_SLOW_CONNECTION: string
    ERROR_UNAUTHORIZED: string
    ERROR_NOT_FOUND: string
    ERROR_UNKNOWN: string
    SIGNOUT: string
    NAV_HOME: string
    NAV_BROWSE: string
    NAV_CREATE: string
    NAV_MY_ADVERTS: string
    NAV_MY_RESERVATIONS: string
    NAV_PROFILE: string
    NAV_ABOUT_HAFFA: string
    ADVERT_CREATE: string
    ADVERT_EDIT: string
    ADVERT_EDIT_SAVE: string
    ADVERT_EDIT_CANCEL: string
    ADVERT_REMOVE: string
    ADVERT_COLLECT: string
    PROFILE_EDIT: string
    PROFILE_SAVE: string
    SCAN_QR_CODE: string
    phrase: (
        key: string,
        defaultTemplateString: string,
        templateVariables?: Record<string, string | number>
    ) => string
    fromNow: (date: string) => string
    getConfig: () => PhraseDefinition[]
}
