import { createContext } from 'react'
import { SmsTemplateRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`SmsTemplateContext::${method} is not provided`)
}

export const SmsTemplateContext = createContext<SmsTemplateRepository>({
    getSmsTemplates: notProvided('getSmsTemplates'),
    updateSmsTemplates: notProvided('updateSmsTemplates'),
})
