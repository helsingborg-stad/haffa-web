import { Advert, CreateAdvertInput } from './types'

// eslint-disable-next-line no-undef
export const mapAdvertToCreateAdvertInput = ({ title, description }: Advert|CreateAdvertInput): CreateAdvertInput => ({ title, description })