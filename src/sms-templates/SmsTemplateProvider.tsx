import { FC, PropsWithChildren } from 'react'
import { SmsTemplateRepository } from './types'
import { SmsTemplateContext } from './SmsTemplateContext'

export const SmsTemplateProvider: FC<
    { repository: SmsTemplateRepository } & PropsWithChildren
> = ({ repository, children }) => (
    <SmsTemplateContext.Provider value={repository}>
        {children}
    </SmsTemplateContext.Provider>
)
