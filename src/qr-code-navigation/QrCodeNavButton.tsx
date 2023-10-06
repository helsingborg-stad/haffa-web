import { PhraseContext } from 'phrases'
import { FC, useContext, useState } from 'react'
import { Alert } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { QrCodeButton } from './QrCodeButton'

export const QrCodeNavButton: FC = () => {
    const { phrase, SCAN_QR_CODE } = useContext(PhraseContext)
    const [message, setMessage] = useState('')
    const navigate = useNavigate()

    return (
        <QrCodeButton
            label={SCAN_QR_CODE}
            onSameDomain={(url, close) => {
                navigate(url.toString())
                close()
            }}
            onOtherDomain={() =>
                setMessage(phrase('', 'Detta är ingen Haffa länk'))
            }
            onNothing={() => setMessage('')}
        >
            {message && <Alert>{message}</Alert>}
        </QrCodeButton>
    )
}
