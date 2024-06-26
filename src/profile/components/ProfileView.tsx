import {
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Typography,
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import AdressIcon from '@mui/icons-material/LocationCity'
import { Profile } from 'profile/types'
import { FC, PropsWithChildren, useContext } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { PhraseContext } from 'phrases/PhraseContext'
import { AuthContext } from 'auth'
import { Editorial } from 'editorials'
import { ResponsiveButtonGroup } from 'components/ResponsiveButtonGroup'

const PropBox: FC<PropsWithChildren & { icon: React.JSX.Element }> = ({
    children,
    icon,
}) => (
    <Grid container sx={{ alignItems: 'center' }}>
        <Grid item sx={{ m: 1 }}>
            {icon}
        </Grid>
        <Grid item sx={{ flex: 1 }}>
            {children}
        </Grid>
    </Grid>
)

export const ProfileView: FC<{ profile: Profile }> = ({ profile }) => {
    const { signout } = useContext(AuthContext)
    const navigate = useNavigate()

    const { phrase, SIGNOUT, PROFILE_EDIT } = useContext(PhraseContext)
    return (
        <Card>
            <CardContent>
                <Editorial phraseKey="PROFILE_EDITORIAL" />
                <PropBox icon={<EmailIcon />}>
                    <Typography variant="h5" component="div" gutterBottom>
                        {profile.email}
                    </Typography>
                </PropBox>
                <PropBox icon={<PhoneIcon />}>
                    <Typography variant="h6" gutterBottom>
                        {profile.phone}
                    </Typography>
                </PropBox>
                <PropBox icon={<AdressIcon />}>
                    {[
                        profile.name,
                        profile.adress,
                        profile.zipCode,
                        profile.city,
                        // profile.country,
                        profile.organization,
                    ]
                        .map((v) => v && v.trim())
                        .filter((v) => v)
                        .map((v, index) => (
                            <Typography
                                key={index}
                                variant="body1"
                                gutterBottom
                            >
                                {v}
                            </Typography>
                        ))}
                </PropBox>
            </CardContent>
            <CardActions>
                <ResponsiveButtonGroup>
                    <Button
                        color="primary"
                        component={NavLink}
                        to="/profile/edit"
                    >
                        <EditIcon />
                        {PROFILE_EDIT}
                    </Button>
                    <Button
                        color="primary"
                        component={NavLink}
                        to="/profile/remove"
                    >
                        <DeleteForeverIcon />
                        {phrase('PROFILE_REMOVE', 'Ta bort min profil')}
                    </Button>
                    <Button
                        color="primary"
                        variant="contained"
                        sx={{ marginLeft: 'auto' }}
                        component={NavLink}
                        to="/"
                        onClick={() => {
                            navigate('/')
                            signout()
                        }}
                    >
                        <LogoutIcon />
                        {SIGNOUT}
                    </Button>
                </ResponsiveButtonGroup>
            </CardActions>
        </Card>
    )
}
