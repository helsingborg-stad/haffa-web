import { Backdrop, Box, Button, Toolbar, useTheme } from '@mui/material'
import { Advert, AdvertImage } from 'adverts/types'
import { CSSProperties, FC, useContext, useMemo, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'

import { PhraseContext } from 'phrases'
import { AdvertImageSettingsContext } from 'branding'

const SwiperCarousel: FC<{ images: AdvertImage[] }> = ({ images }) => {
    const { advertImageAspectRatio } = useContext(AdvertImageSettingsContext)
    const theme = useTheme()
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

    return (
        <>
            <Swiper
                key="carousel"
                style={{
                    ...swiperStyle,
                }}
                slidesPerView={1}
                loop
                navigation
                pagination={{ clickable: true }}
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
                                aspectRatio: advertImageAspectRatio,
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
                        // background: (theme) => theme.palette.primary.light,
                        background: 'black',
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
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
