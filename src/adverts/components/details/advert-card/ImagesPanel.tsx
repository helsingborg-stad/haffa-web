import {
    Backdrop,
    Box,
    Button,
    Toolbar,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import { Advert, AdvertImage } from 'adverts/types'
import { CSSProperties, FC, useContext, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import { SwiperOptions } from 'swiper/types'
import { PhraseContext } from 'phrases'

const SwiperCarousel: FC<{ images: AdvertImage[] }> = ({ images }) => {
    const theme = useTheme()
    const largeScreen = useMediaQuery(theme.breakpoints.up('sm'))
    const [backdropImageIndex, setBackdropImageIndxex] = useState(-1)
    const { phrase } = useContext(PhraseContext)

    const backdropImages = useMemo<AdvertImage[]>(
        () =>
            backdropImageIndex >= 0
                ? [
                      images[backdropImageIndex],
                      ...images.slice(backdropImageIndex + 1),
                      ...images.slice(0, backdropImageIndex),
                  ]
                : images,
        [backdropImageIndex]
    )

    const swiperStyle = useMemo(
        () =>
            ({
                '--swiper-navigation-color': theme.palette.primary.main, // '#fff',
                '--swiper-pagination-color': theme.palette.primary.main, // '#fff',
            } as CSSProperties),
        [theme]
    )

    // we want to adjust slider according to number of images
    // 0 - not shown
    // 1 - centered single image with 2 missing siblings
    // 2 - both images
    // 3 or more - slider
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
                key="carousel"
                style={swiperStyle}
                loop
                {...swiperProps}
                pagination={{
                    clickable: true,
                }}
                navigation
                modules={[Pagination, Navigation]}
            >
                {images.map((image, index) => (
                    <SwiperSlide key={`${image.url}:${index}`}>
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
                            onClick={() => setBackdropImageIndxex(index)}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/**
             * Clicking on an image enter fullscreen, one image at the time preview
             * We use infinite loop scrolling...
             */}
            {backdropImageIndex >= 0 && (
                <Backdrop
                    key="preview"
                    open={backdropImageIndex >= 0}
                    sx={{
                        background: (theme) => theme.palette.primary.light,
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                >
                    <Swiper
                        style={{
                            ...swiperStyle,
                            width: '100%',
                            height: '100%',
                            position: 'relative',
                        }}
                        slidesPerView={1}
                        loop
                        navigation
                        pagination={{ clickable: true }}
                        modules={[Pagination, Navigation]}
                    >
                        <Toolbar
                            sx={{
                                position: 'absolute',
                                zIndex: (theme) => theme.zIndex.appBar,
                                top: 0,
                                right: 0,
                            }}
                        >
                            <Button
                                variant="contained"
                                onClick={() => setBackdropImageIndxex(-1)}
                            >
                                {phrase('', 'Stäng')}
                            </Button>
                        </Toolbar>

                        {backdropImages.map((image, index) => (
                            <SwiperSlide key={`${image.url}:${index}`}>
                                <Box
                                    component="img"
                                    src={image.url}
                                    alt=""
                                    title=""
                                    sx={{
                                        objectFit: 'contain',
                                        width: '100%',
                                        height: '100%',
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </Backdrop>
            )}
        </>
    )
}

export const ImagesPanel: FC<{ advert: Advert }> = ({ advert: { images } }) => {
    if (images.length === 0) {
        return null
    }

    return <SwiperCarousel images={images} />
}
