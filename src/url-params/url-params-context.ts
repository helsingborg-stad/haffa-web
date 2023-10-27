import { createContext } from 'react'
import { createUrlParamsAdapter } from './url-params-adapter'
import { createDefaultUrlParamsMapper } from './url-params-mapper'

export const UrlParamsContext = createContext(
    createUrlParamsAdapter(createDefaultUrlParamsMapper())
)
