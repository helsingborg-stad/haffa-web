import { gqlClient } from 'graphql'
import { SmsTemplate, SmsTemplateRepository } from './types'
import { getSmsTemplatesQuery, updateSmsTemplatesMutation } from './queries'

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
    updateSmsTemplates: async (input) =>
        gql(token, f)
            .query(updateSmsTemplatesMutation)
            .variables({ input })
            .map<SmsTemplate[]>('updateSmsTemplates'),
})
