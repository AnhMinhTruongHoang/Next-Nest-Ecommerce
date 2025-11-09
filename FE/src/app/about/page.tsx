"use client";

import { Typography, Divider } from "antd";

const SECTION_GAP = 32;

const toc = [
  { id: "mission", label: "Sứ mệnh" },
  { id: "story", label: "Hành trình" },
  { id: "team", label: "Đội ngũ" },
  { id: "values", label: "Giá trị cốt lõi" },
];

export default function AboutPage() {
  return (
    <main
      style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px 60px" }}
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }
        .section {
          scroll-margin-top: 90px;
        } /* để tránh bị header che */
        .toc {
          position: static;
          top: 84px;
          background: #fff;
          border: 1px solid #eee;
          border-radius: 10px;
          padding: 12px;
        }
        @media (max-width: 768px) {
          .toc {
            position: static;
            padding: 0;
            border: none;
          }
          .toc details {
            border: 1px solid #eee;
            border-radius: 10px;
            padding: 10px 12px;
            background: #fff;
          }
          .toc summary {
            cursor: pointer;
            font-weight: 600;
          }
          .toc ul {
            margin-top: 10px;
          }
        }
        .toc a {
          color: #1677ff;
          text-decoration: none;
        }
        .toc a:hover {
          text-decoration: underline;
        }
      `}</style>

      <Typography.Title level={2} style={{ marginTop: 8 }}>
        Về chúng tôi
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Tìm hiểu sứ mệnh, hành trình, đội ngũ và giá trị cốt lõi của chúng tôi.
      </Typography.Paragraph>

      <aside className="toc" aria-label="Mục lục">
        <details open>
          <summary>Mục lục</summary>
          <ul style={{ listStyle: "none", paddingLeft: 0, margin: "12px 0 0" }}>
            {toc.map((i) => (
              <li key={i.id} style={{ padding: "6px 0" }}>
                <a href={`#${i.id}`}>{i.label}</a>
              </li>
            ))}
          </ul>
        </details>
      </aside>

      <Divider />

      <section
        id="mission"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Sứ mệnh</Typography.Title>
        <Typography.Paragraph>
          Mang đến trải nghiệm mua sắm thiết bị gaming nhanh, minh bạch và đáng
          tin cậy, giúp game thủ tập trung vào điều quan trọng nhất: chơi hay
          hơn mỗi ngày.
        </Typography.Paragraph>
      </section>

      <section
        id="story"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Hành trình</Typography.Title>
        <Typography.Paragraph>
          Bắt đầu từ một nhóm đam mê phần cứng, chúng tôi lớn lên nhờ lắng nghe
          cộng đồng và không ngừng cải tiến hiệu năng vận hành – từ kho bãi,
          kiểm định đến chăm sóc sau bán.
        </Typography.Paragraph>
      </section>

      <section id="team" className="section" style={{ marginTop: SECTION_GAP }}>
        <Typography.Title level={3}>Đội ngũ</Typography.Title>
        <Typography.Paragraph>
          Kỹ sư phần cứng, tester, CSKH và vận hành – tất cả cùng theo đuổi
          chuẩn “đúng – đủ – nhanh”.
        </Typography.Paragraph>
      </section>

      <section
        id="values"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Giá trị cốt lõi</Typography.Title>
        <ul>
          <li>Chính trực & minh bạch</li>
          <li>Lấy khách hàng làm trung tâm</li>
          <li>Đổi mới liên tục</li>
          <li>Hiệu quả & bền vững</li>
        </ul>
      </section>
    </main>
  );
}
