import { OptionsProvider } from './OptionsContext'
import { createOptionsRepository } from './options-repository'
import { createNotifyingOptionsRepository } from './notifying-options-repository'
import { Option } from './types'

export const getOption = <T = string>(
    key: T,
    options: Option[],
    defaultValue: string = ''
): string => options.find((option) => option.key === key)?.value ?? defaultValue

export {
    OptionsProvider,
    createOptionsRepository,
    createNotifyingOptionsRepository,
}
