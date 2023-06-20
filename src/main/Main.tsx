import { FC, PropsWithChildren } from 'react'
import { Layout } from './Layout'
import { Typography } from '@mui/material'

export const Main: FC<PropsWithChildren> = ({ children }) => (<Layout>
	<Typography variant="h6" gutterBottom>Haffa</Typography>
	{children}
</Layout>)