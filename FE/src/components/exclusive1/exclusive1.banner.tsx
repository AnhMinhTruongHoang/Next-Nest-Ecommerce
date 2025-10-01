import { Button } from "antd";
import Image from "next/image";

const ExclusiveBanner1 = () => {
  return (
    <div className="banner-container">
      <Image
        src="/images/banners/razerBanner.jpg"
        alt="No image"
        draggable="false"
        fill
        priority
        style={{ objectFit: "inherit" }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
      />

      <div className="banner-overlay" style={{ marginBottom: 55 }}>
        <h2 className="razer-text">Razer Exclusive</h2>
        <Button
          type="primary"
          size="large"
          style={{
            backgroundColor: "greenyellow",
            borderColor: "#66B933",
            color: "#000",
            fontWeight: "bold",
          }}
        >
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

        .razer-text {
          color: black;
          -webkit-text-stroke: 2px #66b933;
          font-weight: bold;
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
