"use client";

import { Button } from "antd";
import Image from "next/image";

const SuggestionBanner = () => {
  return (
    <div className="banner-container">
      <Image
        src="/images/banners/razerBanner.jpg"
        alt="Razer Exclusive Banner"
        fill
        priority
        style={{ objectFit: "inherit", objectPosition: "left center" }}
        sizes="100vw"
      />

      <div className="banner-overlay">
        <h2 className="razer-text fade-in">Razer Exclusive</h2>
        <Button
          type="primary"
          size="large"
          className="banner-btn fade-in"
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
        /* Banner container */
        .banner-container {
          width: 100%;
          height: 700px;
          position: relative;
          background-color: #000;
          overflow: hidden;
        }

        /* Overlay */
        .banner-overlay {
          margin-bottom: 200px;
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          padding: 120px;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6),
            rgba(0, 0, 0, 0.1),
            transparent
          );
          z-index: 2;
        }

        /* Text */
        .razer-text {
          color: black;
          -webkit-text-stroke: 2px #66b933;
          font-weight: 800;
          font-size: 56px;
          letter-spacing: 1px;
          margin-bottom: 20px;
          text-transform: uppercase;
        }

        /* Button */
        .banner-btn {
          height: 50px;
          font-size: 18px;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .banner-btn:hover {
          background-color: #66b933 !important;
          color: #000 !important;
          transform: translateY(-2px);
        }

        /* Animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in {
          animation: fadeInUp 1s ease both;
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .banner-container {
            height: 520px;
          }
          .banner-overlay {
            padding: 80px 50px;
          }
          .razer-text {
            font-size: 40px;
            -webkit-text-stroke: 1.5px #66b933;
          }
          .banner-btn {
            font-size: 16px;
            height: 44px;
          }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .banner-container {
            height: 400px;
          }
          .banner-overlay {
            padding: 40px 20px;
            align-items: center;
            text-align: center;
          }
          .razer-text {
            font-size: 28px;
            margin-bottom: 12px;
            -webkit-text-stroke: 1px #66b933;
          }
          .banner-btn {
            font-size: 14px;
            height: 38px;
            padding: 0 18px;
          }
        }
      `}</style>
    </div>
  );
};

export default SuggestionBanner;
