import { toMap } from 'lib/to-map'

export default toMap(
    [
        'advert-was-reserved',
        'advert-reservation-was-cancelled',
        'advert-was-collected',
        'advert-collect-was-cancelled',
        'advert-was-reserved',
        'advert-reservation-was-cancelled',
        'advert-was-returned',
        'advert-was-picked',
        'advert-was-unpicked',
        'advert-collect-was-renewed',
        'advert-reservation-was-renewed',
    ],
    (s) => s,
    (s) => s
)
