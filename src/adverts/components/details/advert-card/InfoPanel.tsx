import { Alert, SvgIcon, SvgIconProps, Typography } from '@mui/material'
import { Advert } from 'adverts'
import { Category } from 'categories/types'
import { Markdown } from 'components/Markdown'
import { TreeAdapter } from 'lib/types'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'

const Co2Icon = (props: SvgIconProps) => (
    <SvgIcon sx={props.sx}>
        <svg
            width="36"
            height="17"
            viewBox="0 0 36 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M15.6387 10.8387C15.2232 10.8387 14.8613 10.6845 14.5529 10.3761C14.2445 10.0677 14.0903 9.70581 14.0903 9.29031V1.54838C14.0903 1.13288 14.2445 0.770943 14.5529 0.462566C14.8613 0.154189 15.2232 0 15.6387 0H21.3677C21.7832 0 22.1452 0.154189 22.4536 0.462566C22.7619 0.770943 22.9161 1.13288 22.9161 1.54838V9.29031C22.9161 9.70581 22.7619 10.0677 22.4536 10.3761C22.1452 10.6845 21.7832 10.8387 21.3677 10.8387H15.6387ZM15.8709 9.05807H21.1355V1.78062H15.8709V9.05807ZM1.54838 10.8387C1.13288 10.8387 0.770943 10.6845 0.462566 10.3761C0.154189 10.0677 0 9.70581 0 9.29031V1.54838C0 1.13288 0.154189 0.770943 0.462566 0.462566C0.770943 0.154189 1.13288 0 1.54838 0H7.27741C7.6929 0 8.05484 0.154189 8.36322 0.462566C8.67159 0.770943 8.82578 1.13288 8.82578 1.54838V2.78707H7.04517V1.78062H1.78062V9.05807H7.04517V8.05162H8.82578V9.29031C8.82578 9.70581 8.67159 10.0677 8.36322 10.3761C8.05484 10.6845 7.6929 10.8387 7.27741 10.8387H1.54838ZM28.1807 16.8774V12.2323C28.1807 11.8168 28.3349 11.4548 28.6432 11.1465C28.9516 10.8381 29.3136 10.6838 29.729 10.6838H34.2194V7.81933H28.1807V6.03872H34.4516C34.8671 6.03872 35.2291 6.1929 35.5374 6.50128C35.8458 6.80966 36 7.17159 36 7.58709V10.6838C36 11.0993 35.8458 11.4613 35.5374 11.7697C35.2291 12.0781 34.8671 12.2323 34.4516 12.2323H29.9613V15.0968H36V16.8774H28.1807Z"
                fill="#99405E"
            />
        </svg>
    </SvgIcon>
)

export const InfoPanel: FC<{
    advert: Advert
    categories: TreeAdapter<Category>
    error?: string
    hideTitle?: boolean
    hideDescription?: boolean
    hideNotifications?: boolean
}> = ({
    advert,
    categories,
    error,
    hideTitle,
    hideDescription,
    hideNotifications,
}) => {
    const { phrase } = useContext(PhraseContext)
    const category = categories.findById(advert.category)
    return (
        <>
            {error && <Alert severity="error">{error}</Alert>}

            {!hideTitle && (
                <Typography variant="h5" component="div">
                    {advert.title}
                </Typography>
            )}
            {!hideDescription && <Markdown markdown={advert.description} />}
            {!hideDescription && (
                <Typography gutterBottom>
                    {category && (
                        <>
                            <Typography component="span">
                                {category.label}
                            </Typography>
                            <Typography
                                color="text.disabled"
                                component="span"
                                sx={{ pl: 1, pr: 1 }}
                            >
                                |
                            </Typography>
                        </>
                    )}
                    {`${advert.meta.reservableQuantity} ${advert.unit}`}
                    {category && (
                        <>
                            <Typography
                                color="text.disabled"
                                component="span"
                                sx={{ pl: 1, pr: 1 }}
                            >
                                |
                            </Typography>
                            <Typography component="span" sx={{ pr: 1 }}>
                                Sparar {category.co2kg} kg
                            </Typography>
                            <Co2Icon sx={{ verticalAlign: 'middle' }} />
                        </>
                    )}
                </Typography>
            )}
            {!hideNotifications && advert.meta.reservedyMe > 0 && (
                <Alert severity="success">
                    {phrase(
                        'ADVERT_IS_RESERVED_BY_YOU',
                        'Du har reserverat {count} {unit}',
                        {
                            count: advert.meta.reservedyMe,
                            unit: advert.unit,
                        }
                    )}
                </Alert>
            )}
            {!hideNotifications && advert.meta.collectedByMe > 0 && (
                <Alert severity="success">
                    {phrase(
                        'ADVERT_IS_COLLECTED_BY_YOU',
                        'Du har hämtat {count} {unit}',
                        {
                            count: advert.meta.collectedByMe,
                            unit: advert.unit,
                        }
                    )}
                </Alert>
            )}
        </>
    )
}
