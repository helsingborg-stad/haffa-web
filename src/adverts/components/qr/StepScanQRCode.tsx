import { Editorial } from 'editorials'
import { FC } from 'react'
import { QrReader } from 'react-qr-reader'

export const StepScanQRCode: FC<{
    onQrCode: (qrCode: string) => void
}> = ({ onQrCode }) => (
    <>
        <Editorial>
            Hitta prylen du vill haffa och skanna den påklistrade QR-koden.
        </Editorial>
        <QrReader
            onResult={(result, err) =>
                !err && result?.getText() && onQrCode(result?.getText())
            }
            constraints={{ facingMode: { ideal: 'environment' } }}
        />
    </>
)
