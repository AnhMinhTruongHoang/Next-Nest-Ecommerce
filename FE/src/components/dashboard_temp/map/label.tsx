"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("./map"), { ssr: false });

export function RegionLabels() {
  return (
    <div className="gz-region-card">
      <div className="gz-region-header">
        <h2>Bản đồ Việt Nam</h2>
        <p>Theo dõi khu vực giao hàng / người dùng</p>
      </div>

      <Map />

      <style jsx global>{`
        .gz-region-card {
          grid-column: span 12 / span 12;
          border-radius: 16px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          padding: 24px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }

        .gz-region-header {
          margin-bottom: 18px;
          text-align: center;
        }

        .gz-region-header h2 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 800;
        }

        .gz-region-header p {
          margin: 6px 0 0;
          color: #8b949e;
          font-size: 13px;
        }

        @media (min-width: 1280px) {
          .gz-region-card {
            grid-column: span 7 / span 7;
          }
        }

        @media (max-width: 768px) {
          .gz-region-card {
            padding: 16px;
            border-radius: 14px;
          }

          .gz-region-header h2 {
            font-size: 21px;
          }

          .gz-region-header p {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}