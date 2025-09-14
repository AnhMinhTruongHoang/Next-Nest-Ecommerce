"use client";

import { Carousel } from "antd";
import React from "react";

type Slide = {
  id: number;
  title: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "Khuyến mãi hè rực rỡ",
    image: "/images/banners/banner1.png",
  },
  {
    id: 2,
    title: "Giảm giá tới 50%",
    image: "/images/banners/banner2.png",
  },
  {
    id: 3,
    title: "Mua 1 tặng 1",
    image: "/images/banners/banner5.jpg",
  },
];

const MainCarousel: React.FC = () => {
  return (
    <div className="w-full">
      <Carousel autoplay>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              style={{
                width: "100%",
                height: "700px",
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 32,
                fontWeight: 700,
                textShadow: "0 2px 8px rgba(0,0,0,0.6)",
              }}
            >
              {slide.title}
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
