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

const IpImage: FC<{ url: string }> = ({ url }) => {
    const [backdropOpen, setBackdropOpen] = useState(false)
    return (
        <>
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
                onClick={() => setBackdropOpen(true)}
            />
            <Backdrop
                open={backdropOpen}
                onClick={() => setBackdropOpen(false)}
                sx={{
                    cursor: 'pointer',
                    background: (theme) => theme.palette.primary.light,
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <Box
                    component="img"
                    src={url}
                    sx={{
                        objectFit: 'contain',
                        width: '100%',
                        height: '100%',
                    }}
                />
            </Backdrop>
        </>
    )
}
const IpImageList: FC<{ images: AdvertImage[]; start: number }> = ({
    images,
    start,
}) => (
    <ImageList cols={images.length} key={start}>
        {images.map(({ url }, index) => (
            <ImageListItem key={index}>
                {url && <IpImage url={url} />}
            </ImageListItem>
        ))}
    </ImageList>
)

export const ImagesPanel: FC<{ advert: Advert }> = ({ advert }) => {
    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('md'))

    const columns = largeScreen ? 3 : 2

    /**
     *
     * The goal is to create horizontal imagelist {columns} wide
     * In order to avoid single image remainders we allow rows
     * to contain +1 in some cases
     * in other cases we
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
                />,
            ]
        }

        if (length === columns + 1) {
            // accept +1 wideness
            return [<IpImageList images={images} start={start} key={start} />]
        }

        return [
            <IpImageList
                images={images.slice(0, columns)}
                start={start}
                key={start}
            />,
            ...imagesRecursive(images.slice(columns), start + columns),
        ]
    }

    const imageComponents = imagesRecursive(advert.images)
    return <Fragment key="il">{imageComponents}</Fragment>
}
