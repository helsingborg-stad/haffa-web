import {
    Backdrop,
    Box,
    ImageList,
    ImageListItem,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { Advert, AdvertImage } from 'adverts/types'
import { FC, Fragment, useState } from 'react'

interface OnClickImage {
    (url: string): void
}
const IpImage: FC<{ url: string; onClick: OnClickImage }> = ({
    url,
    onClick,
}) => (
    <Box
        component="img"
        src={url}
        alt=""
        title=""
        sx={{
            objectFit: 'cover',
            aspectRatio: 1,
            objectPosition: 'center',
            overflow: 'hidden',
            minHeight: '100%',
            minWidth: '100%',
            maxWidth: '100%',
            maxHeight: '100%',
            cursor: 'pointer',
        }}
        onClick={() => url && onClick(url)}
    />
)
const IpImageList: FC<{
    images: AdvertImage[]
    start: number
    onClick: OnClickImage
}> = ({ images, start, onClick }) => (
    <ImageList cols={images.length} key={start}>
        {images.map(({ url }, index) => (
            <ImageListItem key={index}>
                {url && <IpImage url={url} onClick={onClick} />}
            </ImageListItem>
        ))}
    </ImageList>
)

export const ImagesPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const [backdropUrl, setBackdropUrl] = useState<string | null>(null)
    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'))

    const columns = largeScreen ? 3 : 2

    /**
     *
     * The goal is to create horizontal imagelist {columns} wide
     * In order to avoid single image remainders we allow rows
     * to contain +1
     * In case images are few, they are padded to achieve a
     * centered effect
     */
    const imagesRecursive = (
        images: AdvertImage[],
        start: number = 0
    ): JSX.Element[] => {
        const { length } = images
        if (length === 0) {
            return []
        }
        if (length < columns) {
            let padded = [...images]
            while (padded.length < columns) {
                padded = [{ url: null! }, ...padded, { url: null! }]
            }
            while (padded.length > columns) {
                padded = padded.slice(1)
            }
            return [
                <IpImageList
                    images={padded.slice(0, columns)}
                    start={start}
                    key={start}
                    onClick={setBackdropUrl}
                />,
            ]
        }

        if (length === columns + 1) {
            // accept +1 wideness
            return [
                <IpImageList
                    images={images}
                    start={start}
                    key={start}
                    onClick={setBackdropUrl}
                />,
            ]
        }

        return [
            <IpImageList
                images={images.slice(0, columns)}
                start={start}
                key={start}
                onClick={setBackdropUrl}
            />,
            ...imagesRecursive(images.slice(columns), start + columns),
        ]
    }

    const imageComponents = imagesRecursive(advert.images)
    return (
        <Fragment key="il">
            {imageComponents}
            <Backdrop
                open={!!backdropUrl}
                onClick={() => setBackdropUrl(null)}
                sx={{
                    cursor: 'pointer',
                    background: (theme) => theme.palette.primary.light,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Box
                    component="img"
                    src={backdropUrl!}
                    sx={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Backdrop>
        </Fragment>
    )
}
