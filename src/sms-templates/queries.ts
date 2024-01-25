export const getSmsTemplatesQuery = /* GraphQL */ `
    query Query {
        smsTemplates {
            templateId
            template
            enabled
        }
    }
`
export const updateSmsTemplatesMutation = /* GraphQL */ `
    mutation Mutation($input: [SmsTemplateInput]!) {
        updateSmsTemplates(input: $input) {
            templateId
            template
            enabled
        }
    }
`
