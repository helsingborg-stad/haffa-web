import { Notifications } from 'notifications/types'
import { PhraseContextType } from 'phrases'
import { SmsTemplateRepository } from './types'

export const createNotifyingSmsTemplateRepository = (
    { notifyInvocation }: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: SmsTemplateRepository
): SmsTemplateRepository => ({
    getSmsTemplates: async () => inner.getSmsTemplates(),
    updateSmsTemplates: async (...args) =>
        notifyInvocation(() => inner.updateSmsTemplates(...args), {
            message: phrase(
                'NOTIFICATIONS_SMS_TEMPLATES_WAS_UPDATED',
                'Mallarna är sparade'
            ),
        }),
})
