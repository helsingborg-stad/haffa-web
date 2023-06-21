import { Container, Grid } from '@mui/material'
import { FC, PropsWithChildren } from 'react'

export const Layout: FC<PropsWithChildren> = ({ children }) => (
	<Grid item
		xs={12}
		md={8}
		sx={{
			'& .markdown': {
				py: 3,
			},
		}}>
		<Container>
			{children}
		</Container>
	</Grid>
)
