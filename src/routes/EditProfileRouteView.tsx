import { FC } from 'react'
import { useLoaderData } from 'react-router-dom'
import { Profile } from 'profile/types'
import { EditProfile } from 'profile/components/EditProfile'
import { Layout } from '../layout'

export const EditProfileRouteView: FC = () => {
    const { profile } = useLoaderData() as { profile: Profile }
    return (
        <Layout>
            <EditProfile profile={profile} />
        </Layout>
    )
}
