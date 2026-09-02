import ArchiveIcon from '@mui/icons-material/Archive'
import RemoveIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import QrCodeIcon from '@mui/icons-material/QrCode2'
import { Button, ButtonGroup, useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { type Advert, type AdvertMutationResult, AdvertsContext } from 'adverts'
import { ConfirmButton } from 'components/ConfirmButton'
import { PhraseContext } from 'phrases/PhraseContext'
import { type FC, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export const EditorButtonsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const navigate = useNavigate()
    const { removeAdvert, archiveAdvert } = useContext(AdvertsContext)

    const {
        phrase,
        ADVERT_EDIT,
        ADVERT_REMOVE: REMOVE_ADVERT,
    } = useContext(PhraseContext)
    const { meta } = advert

    const theme = useTheme()
    const horizontalGroup = useMediaQuery(theme.breakpoints.up('md'))

    const props: Parameters<typeof Button>[0] = {
        fullWidth: true,
    }
    return (
        <ButtonGroup
            orientation={horizontalGroup ? 'horizontal' : 'vertical'}
            fullWidth
        >
            {meta.canEdit && (
                <Button
                    {...{ props }}
                    color="primary"
                    component={NavLink}
                    to={`/advert/edit/${advert?.id}`}
                    startIcon={<EditIcon />}
                >
                    {ADVERT_EDIT}
                </Button>
            )}
            {meta.canEdit && (
                <Button
                    {...{ props }}
                    color="primary"
                    component={NavLink}
                    to={`/api/v1/labels/${advert.id}`}
                    target="blank"
                    startIcon={<QrCodeIcon />}
                >
                    {phrase('ADVERT_PRINT_QRCODE', 'Skriv ut QR')}
                </Button>
            )}
            {meta.canArchive && (
                <Button
                    {...{ props }}
                    color="primary"
                    onClick={async () => onUpdate(archiveAdvert(advert.id))}
                    startIcon={<ArchiveIcon />}
                >
                    {phrase('ADVERT_ARCHIVE', 'Arkivera')}
                </Button>
            )}
            {meta.canRemove && (
                <ConfirmButton
                    {...{ props }}
                    color="warning"
                    onClick={async () =>
                        onUpdate(
                            removeAdvert(advert.id).then((r) => {
                                navigate('/')
                                return r
                            })
                        )
                    }
                    startIcon={<RemoveIcon />}
                >
                    {REMOVE_ADVERT}
                </ConfirmButton>
            )}
        </ButtonGroup>
    )
}
