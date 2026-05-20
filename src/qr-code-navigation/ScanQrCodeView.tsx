import { NotificationsContext } from 'notifications'
import { PhraseContext } from 'phrases'
import { type FC, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { QrCodeReader } from './QrCodeReader'

export const ScanQrCodeView: FC = () => {
    const { phrase, ERROR_UNKNOWN } = useContext(PhraseContext)
    const { error, info } = useContext(NotificationsContext)
    const navigate = useNavigate()

    return (
        <QrCodeReader
            onSameDomain={(url) => navigate(url.pathname)}
            onOtherDomain={() =>
                info({ message: phrase('', 'Detta är ingen Haffa länk') })
            }
            onNothing={() => {}}
            onError={() => error({ message: ERROR_UNKNOWN })}
        />
    )
}
