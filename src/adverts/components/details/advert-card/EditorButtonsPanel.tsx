import { Button, ButtonGroup, Link, useMediaQuery } from '@mui/material'
import { Advert, AdvertMutationResult, AdvertsContext } from 'adverts'
import { PhraseContext } from 'phrases/PhraseContext'
import { FC, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit'
import RemoveIcon from '@mui/icons-material/Delete'
import QrCodeIcon from '@mui/icons-material/QrCode2'
import ArchiveIcon from '@mui/icons-material/Archive'
import { useTheme } from '@mui/material/styles'

export const EditorButtonsPanel: FC<{
    advert: Advert
    onUpdate: (p: Promise<AdvertMutationResult>) => void
}> = ({ advert, onUpdate }) => {
    const navigate = useNavigate()
    const { removeAdvert, archiveAdvert } = useContext(AdvertsContext)

    const { phrase, EDIT_ADVERT, REMOVE_ADVERT } = useContext(PhraseContext)
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
                    {EDIT_ADVERT}
                </Button>
            )}
            {meta.canEdit && (
                <Button
                    {...{ props }}
                    color="primary"
                    component={NavLink}
                    to={`/advert/qrcode/${advert.id}`}
                    target="blank"
                    startIcon={<QrCodeIcon />}
                >
                    {phrase('', 'Skriv ut QR')}
                </Button>
            )}
            {meta.canArchive && (
                <Button
                    component={Link}
                    {...{ props }}
                    color="primary"
                    onClick={async () => onUpdate(archiveAdvert(advert.id))}
                    startIcon={<ArchiveIcon />}
                >
                    {phrase('', 'Arkivera')}
                </Button>
            )}
            {meta.canRemove && (
                <Button
                    {...{ props }}
                    component={Link}
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
                </Button>
            )}
        </ButtonGroup>
    )
}
