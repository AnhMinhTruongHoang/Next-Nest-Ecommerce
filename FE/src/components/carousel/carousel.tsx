"use client";

import { Carousel } from "antd";
import Image from "next/image";
import Link from "next/link";

type Slide = {
  id: number;
  title: string;
  image: string;
  link: string;
};

const slides: Slide[] = [
  {
    id: 1,
    title: "",
    image: "/images/banners/banner6.png",
    link: "/product-detail/69079cbdd5402175fadf4838",
  },
  {
    id: 2,
    title: "",
    image: "/images/banners/EdraBanner.jpg",
    link: "/productsList?category=69079cbcd5402175fadf481f&sort=-sold",
  },
  {
    id: 3,
    title: "",
    image: "/images/banners/banner5.jpg",
    link: "/product-detail/69079cbdd5402175fadf4832",
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
            <Link href={slide.link}>
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
            </Link>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default MainCarousel;
