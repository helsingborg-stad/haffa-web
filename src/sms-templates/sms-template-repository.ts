import { gqlClient } from 'graphql'
import { SmsTemplate, SmsTemplatePreview, SmsTemplateRepository } from './types'
import {
    getSmsTemplatesQuery,
    previewSmsTemplatesMutation,
    updateSmsTemplatesMutation,
} from './queries'

const gql = (token: string, f?: typeof fetch, init?: RequestInit) =>
    gqlClient()
        .init(init)
        .fetch(f)
        .headers({ Authorization: `Bearer ${token}` })

export const createSmsTemplateRepository = (
    token: string,
    f?: typeof fetch
): SmsTemplateRepository => ({
    getSmsTemplates: async () =>
        gql(token, f)
            .query(getSmsTemplatesQuery)
            .map<SmsTemplate[]>('smsTemplates'),
    previewSmsTemplates: async (input, data) =>
        gql(token, f)
            .query(previewSmsTemplatesMutation)
            .variables({ input, jsonEncodedData: JSON.stringify(data) })
            .map<SmsTemplatePreview[]>('previewSmsTemplates'),
    updateSmsTemplates: async (input) =>
        gql(token, f)
            .query(updateSmsTemplatesMutation)
            .variables({ input })
            .map<SmsTemplate[]>('updateSmsTemplates'),
})
