import { createContext } from 'react'
import type { SmsTemplateRepository } from './types'

const notProvided = (method: string) => () => {
    throw new Error(`SmsTemplateContext::${method} is not provided`)
}

export const SmsTemplateContext = createContext<SmsTemplateRepository>({
    getSmsTemplates: notProvided('getSmsTemplates'),
    previewSmsTemplates: notProvided('previewSmsTemplates'),
    updateSmsTemplates: notProvided('updateSmsTemplates'),
})
