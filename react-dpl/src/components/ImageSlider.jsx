import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// import required modules
import { Pagination, Autoplay } from 'swiper/modules';

// New grocery-themed slider images
const sliderImages = [
    { id: 1, src: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Fresh Vegetables Banner' },
    { id: 2, src: 'https://images.unsplash.com/photo-1540420773420-2366e2c8aa28?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Seasonal Fruits Banner' },
    { id: 3, src: 'https://images.unsplash.com/photo-1579113800036-3b6b7b836138?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Farm to Table Banner' },
    { id: 4, src: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', alt: 'Organic Greens Banner' },
];

const ImageSlider = () => {
    return (
        <div className="slider-container">
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={15}
                slidesPerView={1}
                pagination={{ clickable: true, dynamicBullets: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="mySwiper"
            >
                {sliderImages.map(image => (
                    <SwiperSlide key={image.id}>
                        <img src={image.src} alt={image.alt} className="slider-image" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageSlider;