import type { Notifications } from 'notifications/types'
import type { PhraseContextType } from 'phrases'
import type { SmsTemplateRepository } from './types'

export const createNotifyingSmsTemplateRepository = (
    { notifyInvocation }: Notifications,
    phrase: PhraseContextType['phrase'],
    inner: SmsTemplateRepository
): SmsTemplateRepository => ({
    getSmsTemplates: async () => inner.getSmsTemplates(),
    previewSmsTemplates: (...args) => inner.previewSmsTemplates(...args),
    updateSmsTemplates: async (...args) =>
        notifyInvocation(() => inner.updateSmsTemplates(...args), {
            message: phrase(
                'NOTIFICATIONS_SMS_TEMPLATES_WAS_UPDATED',
                'Mallarna är sparade'
            ),
        }),
})
