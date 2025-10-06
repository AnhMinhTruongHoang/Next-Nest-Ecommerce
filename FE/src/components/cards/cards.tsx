import { Card } from "antd";
import Image from "next/image";
import "antd/dist/reset.css";
import "../../styles/global.css";
import { ProductOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Meta } = Card;

type CardList = {
  id: number;
  title: string;
  image: string;
};

const cardList: CardList[] = [
  {
    id: 1,
    title: "Tai nghe HAVIT",
    image: "/images/banners/banner6.png",
  },
  {
    id: 2,
    title: "Bàn phím Pop Keys",
    image: "/images/banners/banner7.png",
  },
  {
    id: 3,
    title: "Chuột Logitech",
    image: "/images/banners/banner5.jpg",
  },
  {
    id: 4,
    title: "Chuột Logitech",
    image: "/images/banners/banner5.jpg",
  },
  {
    id: 5,
    title: "Chuột Logitech",
    image: "/images/banners/banner5.jpg",
  },
];

const Cards = () => (
  <div>
    <div
      style={{
        textAlign: "center",
        padding: "8px",
        fontWeight: "bold",
        marginTop: 50,
      }}
    >
      <h1>Sản phẩm nổi bật</h1>
    </div>

    <div
      style={{
        display: "flex",
        justifyContent: "center",
        gap: 12,
        marginTop: 30,
      }}
    >
      <Link href={`/productsList`}>
        <button
          title="All Products"
          style={{
            textAlign: "center",
            padding: "8px 20px",
            borderRadius: 20,
            border: "none",
            fontWeight: 600,
            cursor: "pointer",
            minWidth: 80,
            backgroundColor: "gainsboro",
          }}
        >
          <ProductOutlined />
        </button>
      </Link>
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
      {cardList.map((card) => (
        <Card
          key={card.id}
          hoverable
          style={{
            width: 340,
            height: 450,
            borderRadius: 16,
            overflow: "hidden",
          }}
          cover={
            <div className="group overflow-hidden">
              <Image
                alt={card.title}
                src={card.image}
                width={340}
                height={450}
                className="object-cover transition-transform duration-500 group-hover:scale-1010"
              />
            </div>
          }
        />
      ))}
    </div>
  </div>
);

export default Cards;
