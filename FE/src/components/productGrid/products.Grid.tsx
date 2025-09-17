import { Card, Carousel } from "antd";
import Image from "next/image";

const { Meta } = Card;

const cardList = [
  { id: 1, title: "Tai nghe HAVIT", image: "/images/banners/banner6.png" },
  { id: 2, title: "Bàn phím Pop Keys", image: "/images/banners/banner7.png" },
  { id: 3, title: "Chuột Logitech", image: "/images/banners/banner5.jpg" },
  { id: 4, title: "Chuột Logitech", image: "/images/banners/banner5.jpg" },
  { id: 5, title: "Chuột Logitech", image: "/images/banners/banner5.jpg" },
  { id: 6, title: "Tai nghe Razer", image: "/images/banners/banner8.png" },
  { id: 7, title: "Bàn phím Cơ", image: "/images/banners/banner6.png" },
  { id: 8, title: "Chuột Gaming", image: "/images/banners/banner7.png" },
];

const chunkArray = (arr: any[], size: number) => {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

const ProductsGrid = () => {
  // Chia sản phẩm thành từng nhóm 5
  const slides = chunkArray(cardList, 5);

  return (
    <>
      <Carousel arrows dots autoplay>
        {slides.map((group, index) => (
          <div key={index}>
            <div
              style={{
                textAlign: "center",
                padding: "8px",
                fontWeight: "bold",
                marginTop: 50,
              }}
            >
              <h1>Razer Exclusive</h1>
            </div>

            <div
              style={{
                display: "flex",
                gap: "24px",
                flexWrap: "wrap",
                justifyContent: "center",
                marginTop: 16,
                marginBottom: 50,
              }}
            >
              {group.map((card) => (
                <Card
                  key={card.id}
                  hoverable
                  style={{
                    width: 300,
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                  cover={
                    <div className="group overflow-hidden">
                      <Image
                        alt={card.title}
                        src={card.image}
                        width={300}
                        height={300}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  }
                >
                  <Meta
                    title={card.title}
                    style={{ textAlign: "center", fontWeight: "bold" }}
                  />
                </Card>
              ))}
            </div>
          </div>
        ))}
      </Carousel>

      {/* CSS hiển thị arrow đẹp hơn */}
      <style jsx global>{`
        .ant-carousel .slick-prev,
        .ant-carousel .slick-next {
          display: flex !important;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          width: 40px;
          height: 40px;
          z-index: 10;
          transition: background 0.3s ease;
        }

        .ant-carousel .slick-prev:hover,
        .ant-carousel .slick-next:hover {
          background: rgba(0, 0, 0, 0.8);
        }

        .ant-carousel .slick-prev {
          left: 10px;
        }

        .ant-carousel .slick-next {
          right: 10px;
        }

        .ant-carousel .slick-prev::before,
        .ant-carousel .slick-next::before {
          display: none;
        }
      `}</style>
    </>
  );
};

export default ProductsGrid;
