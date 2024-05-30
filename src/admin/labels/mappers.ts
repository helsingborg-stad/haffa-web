import { LabelOptions } from 'options/types'

export const getDefaultLabelOptions = (): LabelOptions => ({
    headline: '',
    displayReference: 'true',
    displayTitle: 'true',
    errorCorrectionLevel: 'low',
})
