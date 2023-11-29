import {
    Avatar,
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
} from '@mui/material'
import { AdvertsContext } from 'adverts'
import { ErrorView } from 'errors'
import useAsync from 'hooks/use-async'
import { Profile, ProfileContext } from 'profile'
import { FC, PropsWithChildren, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import LogoutIcon from '@mui/icons-material/Logout'
import { ConfirmButton } from 'components/ConfirmButton'
import { PhraseContext } from 'phrases'
import { AuthContext } from 'auth'
import { Editorial } from 'editorials'

interface Engagement {
    hasAdverts: boolean
    hasReservedAdverts: boolean
}

const SuccessItem: FC<PropsWithChildren> = ({ children }) => (
    <ListItem>
        <ListItemAvatar>
            <Avatar>
                <CheckCircleOutlineIcon />
            </Avatar>
        </ListItemAvatar>
        <ListItemText>{children}</ListItemText>
    </ListItem>
)

const ProblemItem: FC<PropsWithChildren> = ({ children }) => (
    <ListItem
        secondaryAction={
            <Button component={NavLink} to="/my-adverts">
                Visa översikt
            </Button>
        }
    >
        <ListItemAvatar>
            <Avatar>
                <WarningIcon />
            </Avatar>
        </ListItemAvatar>
        <ListItemText>{children}</ListItemText>
    </ListItem>
)

const ConfirmView: FC<{
    engagement: Engagement
    onCancel: () => void
    onConfirm: () => void
}> = ({
    engagement: { hasAdverts, hasReservedAdverts },
    onCancel,
    onConfirm,
}) => {
    const { phrase } = useContext(PhraseContext)
    return (
        <>
            <Editorial phraseKey="PROFILE_REMOVAL_EDITORIAL" />
            <Card>
                <CardHeader
                    title={phrase('PROFILE_REMOVE', 'Ta bort min profil')}
                />
                <CardContent>
                    <List>
                        {!(hasAdverts || hasReservedAdverts) && (
                            <SuccessItem key="success">
                                {phrase(
                                    'PROFILE_REMOVAL_CAN_PROCEED',
                                    'Du har inga aktiva engagemang kring dina annonser'
                                )}
                            </SuccessItem>
                        )}
                        {hasAdverts && (
                            <ProblemItem key="has-adverts">
                                {phrase(
                                    'PROFILE_REMOVAL_HAS_ADVERTS',
                                    'Du har aktiva annonser som kommer att tas bort'
                                )}
                            </ProblemItem>
                        )}
                        {hasReservedAdverts && (
                            <ProblemItem key="has-reservations">
                                {phrase(
                                    'PROFILE_REMOVAL_HAS_RESERVATIONS',
                                    'Några av dina annonser är reserverade'
                                )}
                            </ProblemItem>
                        )}
                    </List>
                </CardContent>
                <CardActions>
                    <Button onClick={() => onCancel()}>Avbryt</Button>
                    <ConfirmButton
                        color="warning"
                        variant="contained"
                        sx={{ marginLeft: 'auto' }}
                        onClick={() => onConfirm()}
                    >
                        Fortsätt
                    </ConfirmButton>
                </CardActions>
            </Card>
        </>
    )
}

const RemovedView: FC = () => {
    const navigate = useNavigate()
    const { signout } = useContext(AuthContext)
    const { SIGNOUT } = useContext(PhraseContext)
    return (
        <Card>
            <CardContent>
                Dina profilinställningar samt dina annonser är borttagna.
            </CardContent>
            <CardActions>
                <Button
                    color="primary"
                    variant="contained"
                    sx={{ marginLeft: 'auto' }}
                    onClick={() => {
                        navigate('/')
                        signout()
                    }}
                >
                    <LogoutIcon />
                    {SIGNOUT}
                </Button>
            </CardActions>
        </Card>
    )
}

export const RemoveProfileView: FC<{ profile: Profile }> = () => {
    const { listAdverts } = useContext(AdvertsContext)
    const { removeProfile } = useContext(ProfileContext)
    const navigate = useNavigate()

    interface Model {
        engagement: Engagement
        isRemoved: boolean
    }
    const inspect = useAsync<Model>(() =>
        Promise.all([
            listAdverts({
                restrictions: {
                    createdByMe: true,
                },
                paging: {
                    pageIndex: 0,
                    pageSize: 1,
                },
            }),
            listAdverts({
                restrictions: {
                    createdByMe: true,
                    hasReservations: true,
                },
                paging: {
                    pageIndex: 0,
                    pageSize: 1,
                },
            }),
        ])
            .then((results) =>
                results.map((result) => result.adverts.length > 0)
            )
            .then(([hasAdverts, hasReservedAdverts]) => ({
                engagement: {
                    hasAdverts,
                    hasReservedAdverts,
                },
                isRemoved: false,
            }))
    )

    return inspect({
        pending: () => <LinearProgress />,
        rejected: (e) => <ErrorView error={e} />,
        resolved: ({ isRemoved, engagement }, _, update) =>
            isRemoved ? (
                <RemovedView key="removed" />
            ) : (
                <ConfirmView
                    key="confirm"
                    engagement={engagement}
                    onCancel={() => navigate('/profile')}
                    onConfirm={() =>
                        update(
                            removeProfile({ removeAdverts: true }).then(
                                ({ success }) => ({
                                    engagement,
                                    isRemoved: success,
                                })
                            )
                        )
                    }
                />
            ),
    })
}
