import { FC } from 'react'
import { EditNewAdvert } from '../adverts/EditNewAdvert'
import { Layout } from '../layout'

export const EditNewAdvertRouteView: FC = () => (
	<Layout renderAppbarControls={() => null}>
		<EditNewAdvert />
	</Layout>)