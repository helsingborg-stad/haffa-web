import { FC } from 'react'
import { CreateAdvert } from '../adverts/components/CreateAdvert'
import { Layout } from '../layout'

export const CreateAdvertRouteView: FC = () => (
	<Layout renderAppbarControls={() => null}>
		<CreateAdvert />
	</Layout>)