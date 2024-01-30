export const getSmsTemplatesQuery = /* GraphQL */ `
    query Query {
        smsTemplates {
            templateId
            template
            enabled
        }
    }
`

export const previewSmsTemplatesMutation = /* GraphQL */ `
    mutation Mutation($input: [SmsTemplateInput]!, $jsonEncodedData: String!) {
        previewSmsTemplates(input: $input, jsonEncodedData: $jsonEncodedData) {
            templateId
            template
            preview
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
