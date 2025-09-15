import { Card } from "antd";
import Image from "next/image";
import "antd/dist/reset.css";
import "../../styles/globals.css";

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
            <Image
              alt={card.title}
              src={card.image}
              width={340}
              height={450}
              className="transition-transform duration-500 hover:scale-110 object-cover"
            />
          }
        />
      ))}
    </div>
  </div>
);

export default Cards;
