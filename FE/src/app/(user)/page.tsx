"use client";

import { Carousel } from "antd";

const slides = [
  {
    id: 1,
    title: "Khuyến mãi hè rực rỡ",
    image: "https://picsum.photos/id/1015/800/300",
  },
  {
    id: 2,
    title: "Giảm giá tới 50%",
    image: "https://picsum.photos/id/1025/800/300",
  },
  {
    id: 3,
    title: "Mua 1 tặng 1",
    image: "https://picsum.photos/id/1035/800/300",
  },
];

export default function UserPage() {
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Trang User</h1>
      <Carousel autoplay>
        {slides.map((slide) => (
          <div key={slide.id}>
            <div
              style={{
                height: 300,
                background: `url(${slide.image}) center / cover no-repeat`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 24,
                fontWeight: 600,
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
}
