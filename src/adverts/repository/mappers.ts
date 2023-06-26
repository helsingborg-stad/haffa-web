import { Advert, CreateAdvertInput } from '../../adverts/types'

// eslint-disable-next-line no-undef
export const mapAdvertToCreateAdvertInput = ({ title, description }: Advert|CreateAdvertInput): CreateAdvertInput => ({ title, description })