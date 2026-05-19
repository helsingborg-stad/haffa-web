import type { FC, PropsWithChildren } from 'react'
import { SmsTemplateContext } from './SmsTemplateContext'
import type { SmsTemplateRepository } from './types'

export const SmsTemplateProvider: FC<
    { repository: SmsTemplateRepository } & PropsWithChildren
> = ({ repository, children }) => (
    <SmsTemplateContext.Provider value={repository}>
        {children}
    </SmsTemplateContext.Provider>
)
