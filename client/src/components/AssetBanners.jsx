import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from 'swiper'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

import banner1 from '../assets/banner-1.png'
import banner2 from '../assets/banner-2.png'
import banner3 from '../assets/banner-3.png'
import banner4 from '../assets/banner-4.png'
import banner5 from '../assets/banner-5.png'
import banner6 from '../assets/banner-6.png'
import banner7 from '../assets/banner-7.png'

export default function AssetBanners() {
    const images = [banner1, banner2, banner3, banner4, banner5, banner6, banner7]

    SwiperCore.use([Navigation, Autoplay])

    return (
        <Swiper navigation loop autoplay={{ delay: 5000 }}>
            {images.map((imageUrl, index) => (
                <SwiperSlide key={index}>
                    <div className='h-screen flex items-center justify-center'>
                        <img src={imageUrl} alt={`Image ${index + 1}`} className='h-[700px] w-[1200px]' />
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    )
}
