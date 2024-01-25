export interface SmsTemplate {
    templateId: string
    template: string
    enabled: boolean
}

export interface SmsTemplateRepository {
    getSmsTemplates: () => Promise<SmsTemplate[]>
    updateSmsTemplates: (templates: SmsTemplate[]) => Promise<SmsTemplate[]>
}
