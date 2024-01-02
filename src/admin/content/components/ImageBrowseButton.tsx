import { Alert, Button } from '@mui/material'
import { useState } from 'react'

export const ImageBrowseButton = (props: {
    maxSize: number
    onUpdate: (result: string) => void
}) => {
    const [hasError, setHasError] = useState(false)

    return (
        <>
            <Button fullWidth variant="outlined" component="label">
                <input
                    style={{ display: 'none' }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0] as File
                        if (file.size > props.maxSize) {
                            setHasError(true)
                        } else {
                            const reader = new FileReader()
                            reader.onloadend = () =>
                                props.onUpdate(reader.result as string)
                            reader.readAsDataURL(file)
                            setHasError(false)
                        }
                    }}
                />
                Ladda upp bild
            </Button>
            {hasError && (
                <Alert severity="error">
                    Bilden är för stor för att användas i HAFFA
                </Alert>
            )}
        </>
    )
}
