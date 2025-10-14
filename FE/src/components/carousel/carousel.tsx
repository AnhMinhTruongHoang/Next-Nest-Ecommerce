"use client";

import { Carousel } from "antd";
import Image from "next/image";


type Slide = {
  id: number;
  title: string;
  image: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "",
    image: "/images/banners/banner6.png",
  },
  {
    id: 2,
    title: "",
    image: "/images/banners/banner7.png",
  },
  {
    id: 3,
    title: "",
    image: "/images/banners/banner5.jpg",
  },
];

const MainCarousel: React.FC = () => {
  return (
    <div className="w-full relative" style={{ border: "2px grey" }}>
      <div
        style={{
          textAlign: "center",
          background: "red",
          border: "5px  grey",
          padding: "8px",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Nhập code "GamerZone" giảm 30%
      </div>
      <Carousel autoplay arrows fade adaptiveHeight>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              style={{
                width: "100%",
                height: "700px",
                position: "relative",
                backgroundColor: "#000",
              }}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                style={{
                  objectFit: "fill",
                }}
                sizes="100vw"
              />

              <div
                style={{
                  position: "absolute",
                  inset: 0,
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
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
