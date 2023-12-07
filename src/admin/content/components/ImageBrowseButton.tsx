import { Button } from '@mui/material'

export const ImageBrowseButton = (props: {
    onUpdate: (result: string) => void
}) => (
    // render button as label since label will trigger inner hidden input...
    <Button variant="outlined" component="label">
        <input
            style={{ display: 'none' }}
            type="file"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files?.[0] as File
                const reader = new FileReader()
                reader.onloadend = () => props.onUpdate(reader.result as string)
                reader.readAsDataURL(file)
            }}
        />
        Ladda upp bild
    </Button>
)
