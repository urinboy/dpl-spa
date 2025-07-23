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
    { id: 1, src: 'https://animalequality.org.uk/app/uploads/2024/11/vegan-food-ingredients-shutterstock_2284408579-1-1.jpg', alt: 'Fresh Vegetables Banner' },
    { id: 2, src: 'https://avatars.mds.yandex.net/i?id=f690dbcd7d7520b85b423b9f80537dc2_l-8243435-images-thumbs&n=13', alt: 'Seasonal Fruits Banner' },
    { id: 3, src: 'https://avatars.mds.yandex.net/i?id=7a33e200e09ce56ced863f74f321c7af_l-5223485-images-thumbs&n=13', alt: 'Farm to Table Banner' },
    { id: 4, src: 'https://i.pinimg.com/originals/19/10/9c/19109c660dd3c2eb602b926d9e2be6da.jpg', alt: 'Organic Greens Banner' },
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