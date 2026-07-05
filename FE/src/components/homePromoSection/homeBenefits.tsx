"use client";

import {
  CustomerServiceOutlined,
  SafetyCertificateOutlined,
  SyncOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";

const benefits = [
  {
    icon: <SafetyCertificateOutlined />,
    title: "Hàng chính hãng",
    desc: "Cam kết sản phẩm gaming gear rõ nguồn gốc, bảo hành minh bạch.",
  },
  {
    icon: <ThunderboltOutlined />,
    title: "Giao nhanh",
    desc: "Xử lý đơn hàng nhanh, hỗ trợ giao hàng toàn quốc.",
  },
  {
    icon: <SyncOutlined />,
    title: "Đổi trả dễ dàng",
    desc: "Hỗ trợ đổi mới nếu sản phẩm lỗi từ nhà sản xuất.",
  },
  {
    icon: <CustomerServiceOutlined />,
    title: "Tư vấn 24/7",
    desc: "Gợi ý sản phẩm phù hợp với nhu cầu chơi game của bạn.",
  },
];

export default function HomeBenefits() {
  return (
    <section className="gz-benefits-section">
      <div className="gz-benefits-grid">
        {benefits.map((item) => (
          <div className="gz-benefit-card" key={item.title}>
            <div className="gz-benefit-icon">{item.icon}</div>

            <div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .gz-benefits-section {
          padding: 28px 16px 12px;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.06),
              transparent 34%
            ),
            #1e2021;
        }

        .gz-benefits-grid {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
        }

        .gz-benefit-card {
          min-height: 118px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          border-radius: 20px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b;
          border: 1px solid #2a2d2e;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
          transition: transform 0.22s ease, border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .gz-benefit-card:hover {
          transform: translateY(-4px);
          border-color: rgba(0, 255, 224, 0.55);
          box-shadow: 0 16px 34px rgba(0, 255, 224, 0.1);
        }

        .gz-benefit-icon {
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.22);
          font-size: 22px;
        }

        .gz-benefit-card h3 {
          margin: 0 0 6px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 950;
          line-height: 1.25;
        }

        .gz-benefit-card p {
          margin: 0;
          color: #9ca3af;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.55;
        }

        @media (max-width: 992px) {
          .gz-benefits-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .gz-benefits-section {
            padding: 20px 10px 8px;
          }

          .gz-benefits-grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .gz-benefit-card {
            min-height: auto;
            padding: 14px;
            border-radius: 16px;
          }

          .gz-benefit-icon {
            width: 40px;
            height: 40px;
            border-radius: 14px;
            font-size: 19px;
          }
        }
      `}</style>
    </section>
  );
}
