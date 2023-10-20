import { OptionsProvider } from './OptionsContext'
import { createOptionsRepository } from './options-repository'
import { createNotifyingOptionsRepository } from './notifying-options-repository'
import { Option } from './types'

export const getOption = <T = string>(
    key: T,
    options: Option[]
): string | undefined => options.find((option) => option.key === key)?.value

export {
    OptionsProvider,
    createOptionsRepository,
    createNotifyingOptionsRepository,
}
