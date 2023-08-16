import {
    Button,
    ButtonProps,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Step,
    StepContent,
    StepLabel,
    Stepper,
} from '@mui/material'
import { FC, useContext, useState } from 'react'

import CameraIcon from '@mui/icons-material/CameraAlt'
import { PhraseContext } from 'phrases/PhraseContext'
import { StepScanQRCode } from './StepScanQRCode'
import { StepConfirmPickup } from './StepConfirmPickup'
// import { useNavigate } from 'react-router-dom'

const STEP_SCAN_QRCODE = 0
const STEP_CONFIRM_PICKUP = 1

export const ReadQrCodeButton: FC<ButtonProps> = (props) => {
    const { SCAN_QR_CODE, phrase } = useContext(PhraseContext)
    // const navigate = useNavigate()

    const [state, setState] = useState<{
        open: boolean
        step: number
        qrCode: string
    }>({
        open: false,
        step: STEP_SCAN_QRCODE,
        qrCode: '',
    })

    return (
        <>
            <Button
                {...props}
                onClick={() =>
                    setState({
                        ...state,
                        open: true,
                        step: STEP_SCAN_QRCODE,
                        qrCode: '',
                    })
                }
            >
                <CameraIcon />
                {SCAN_QR_CODE}
            </Button>

            <Dialog
                open={state.open}
                onClose={() =>
                    setState({
                        ...state,
                        open: false,
                    })
                }
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                fullWidth
            >
                <DialogTitle>{phrase('', 'Skanna')}</DialogTitle>
                <DialogContent>
                    <Stepper activeStep={state.step} orientation="vertical">
                        <Step key={STEP_SCAN_QRCODE}>
                            <StepLabel>Skanna</StepLabel>
                            <StepContent>
                                <StepScanQRCode
                                    onQrCode={(qrCode) =>
                                        setState({
                                            ...state,
                                            step: STEP_CONFIRM_PICKUP,
                                            qrCode,
                                        })
                                    }
                                />
                            </StepContent>
                        </Step>
                        <Step key={STEP_CONFIRM_PICKUP}>
                            <StepLabel>{phrase('', 'Bekräfta')}</StepLabel>
                            <StepContent>
                                <StepConfirmPickup qrCode={state.qrCode} />
                            </StepContent>
                        </Step>
                    </Stepper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setState({ ...state, open: false })}>
                        {phrase('', 'Stäng')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
