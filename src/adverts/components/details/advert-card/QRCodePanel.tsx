import { FC, useContext } from 'react'
import { Box, Card, CardContent, Typography } from '@mui/material'
import QRCode from 'react-qr-code'
import { DeepLinkContext } from 'deep-links/DeepLinkContext'
import { Advert } from '../../../types'

export const QRCodePanel: FC<{
    advert: Advert
}> = ({ advert }) => {
    const { getAdvertLinkForQrCode } = useContext(DeepLinkContext)
    const link = getAdvertLinkForQrCode(advert)

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" align="center" pb={2}>
                    QR-Kod
                </Typography>

                <Box
                    style={{
                        height: 'auto',
                        margin: '0 auto',
                        maxWidth: 160,
                        width: '100%',
                    }}
                >
                    <QRCode
                        size={256}
                        style={{
                            height: 'auto',
                            maxWidth: '100%',
                            width: '100%',
                        }}
                        value={link}
                        viewBox="0 0 256 256"
                    />
                </Box>
            </CardContent>
        </Card>
    )
}
