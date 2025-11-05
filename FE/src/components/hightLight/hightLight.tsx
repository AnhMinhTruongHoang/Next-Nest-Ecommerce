"use client";

import { Card, Button } from "antd";
import Image from "next/image";

const Highlight = () => {
  return (
    <div className="highlight-wrapper">
      {/* Card 1 */}
      <Card
        hoverable
        className="highlight-card"
        cover={
          <div className="highlight-cover">
            <Image
              alt="Men Wear"
              src="/images/cards/MonesyE.jpg"
              fill
              className="highlight-img"
              style={{ objectFit: "inherit" }}
            />
            <div className="highlight-overlay">
              <h2>m0NESY choice</h2>
              <Button type="primary" size="large" className="highlight-btn">
                KHÁM PHÁ
              </Button>
            </div>
          </div>
        }
      />

      {/* Card 2 */}
      <Card
        hoverable
        className="highlight-card"
        cover={
          <div className="highlight-cover">
            <Image
              alt="Women Active"
              src="/images/cards/niko.webp"
              fill
              className="highlight-img"
              style={{ objectFit: "inherit" }}
            />
            <div className="highlight-overlay">
              <h2> NIKO choice</h2>
              <Button type="primary" size="large" className="highlight-btn">
                KHÁM PHÁ
              </Button>
            </div>
          </div>
        }
      />

      {/* CSS */}
      <style jsx global>{`
        .highlight-wrapper {
          display: flex;
          gap: 24px;
          justify-content: center;
          margin-top: 24px;
          margin-bottom: 50px;
          flex-wrap: wrap;
          padding: 0 16px;
        }

        .highlight-card {
          width: 880px;
          height: 600px;
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          transition: all 0.3s ease;
        }

        .highlight-cover {
          position: relative;
          width: 100%;
          height: 600px;
        }

        .highlight-img {
          transition: transform 0.6s ease;
        }

        .highlight-card:hover .highlight-img {
          transform: scale(1.05);
        }

        .highlight-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 32px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
          color: #fff;
        }

        .highlight-overlay h2 {
          font-size: 36px;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .highlight-btn {
          background: #fff !important;
          color: #000 !important;
          border: none !important;
          font-weight: 600;
          border-radius: 8px;
          height: 44px;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .highlight-card {
            width: 90%;
            height: 480px;
          }

          .highlight-cover {
            height: 480px;
          }

          .highlight-overlay h2 {
            font-size: 28px;
          }
        }

        /* Mobile */
        @media (max-width: 600px) {
          .highlight-card {
            width: 100%;
            height: 360px;
          }

          .highlight-cover {
            height: 360px;
          }

          .highlight-overlay {
            padding: 20px;
          }

          .highlight-overlay h2 {
            font-size: 22px;
            margin-bottom: 8px;
          }

          .highlight-btn {
            height: 38px;
            font-size: 14px;
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default Highlight;
