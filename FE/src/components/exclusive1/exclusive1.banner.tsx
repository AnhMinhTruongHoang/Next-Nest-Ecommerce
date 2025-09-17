import { Button } from "antd";
import Image from "next/image";

const ExclusiveBanner1 = () => {
  return (
    <div className="banner-container">
      <Image
        src="/images/cards/gitwar2.png"
        alt="No image"
        draggable="false"
        fill
        style={{
          objectFit: "cover",
          color: "transparent",
        }}
        sizes="100vw"
      />
      <div className="banner-overlay">
        <h2>Razer Exclusive</h2>
        <Button className="banner-btn" type="primary" size="large">
          KHÁM PHÁ
        </Button>
      </div>

      <style jsx>{`
        .banner-container {
          width: 100%;
          height: 700px;
          position: relative;
          background-color: #000;
        }

        .banner-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 150px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .banner-overlay h2 {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .banner-btn {
          background-color: #fff !important;
          color: #000 !important;
          font-weight: bold;
          border: none;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .banner-container {
            height: 400px;
          }
          .banner-overlay {
            padding: 40px 20px;
          }
          .banner-overlay h2 {
            font-size: 22px;
          }
          .banner-btn {
            font-size: 14px;
            padding: 0 16px;
            height: 36px;
          }
        }

        /* Tablet */
        @media (min-width: 769px) and (max-width: 1024px) {
          .banner-container {
            height: 500px;
          }
          .banner-overlay {
            padding: 80px 40px;
          }
          .banner-overlay h2 {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
};

export default ExclusiveBanner1;
