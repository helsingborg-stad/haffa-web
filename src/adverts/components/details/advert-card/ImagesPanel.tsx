import { Backdrop, Box, useMediaQuery, useTheme } from '@mui/material'
import { Advert, AdvertImage } from 'adverts/types'
import { FC, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import { SwiperOptions } from 'swiper/types'

const SwiperCarousel: FC<{ images: AdvertImage[] }> = ({ images }) => {
    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('sm'))
    const [backdropUrl, setBackdropUrl] = useState<string | null>(null)
    const swiperProps: SwiperOptions = useMemo(
        () =>
            largeScreen
                ? {
                      centeredSlides:
                          [false, true, false, false][images.length] || false,
                      slidesPerView: [0, 3, 2, 3][images.length] || 3,
                  }
                : {
                      slidesPerView: 1,
                  },
        [largeScreen]
    )
    return (
        <>
            <Swiper
                {...swiperProps}
                pagination={{
                    clickable: true,
                }}
                modules={[Pagination]}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <Box
                            component="img"
                            src={image.url}
                            alt=""
                            title=""
                            sx={{
                                objectFit: 'cover',
                                aspectRatio: 4 / 3,
                                objectPosition: 'center',
                                overflow: 'hidden',
                                minHeight: '100%',
                                minWidth: '100%',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                cursor: 'pointer',
                            }}
                            onClick={() => setBackdropUrl(image.url)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
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
        </>
    )
}

export const ImagesPanel: FC<{ advert: Advert }> = ({ advert: { images } }) => {
    if (images.length === 0) {
        return null
    }

    return <SwiperCarousel images={[...images, ...images].slice(0, 100)} />
}
