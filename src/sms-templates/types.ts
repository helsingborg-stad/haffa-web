export interface SmsTemplate {
    templateId: string
    template: string
    enabled: boolean
}

export interface SmsTemplatePreview {
    templateId: string
    template: string
    preview: string
}

export interface SmsTemplateRepository {
    getSmsTemplates: () => Promise<SmsTemplate[]>
    previewSmsTemplates: (
        templates: SmsTemplate[],
        data: any
    ) => Promise<SmsTemplatePreview[]>
    updateSmsTemplates: (templates: SmsTemplate[]) => Promise<SmsTemplate[]>
}
