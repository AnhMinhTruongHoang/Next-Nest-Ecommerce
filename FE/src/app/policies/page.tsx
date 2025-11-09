"use client";

import { Typography, Divider, Alert } from "antd";

const SECTION_GAP = 32;

const toc = [
  { id: "privacy", label: "Chính sách bảo mật" },
  { id: "terms", label: "Điều khoản dịch vụ" },
  { id: "consumer", label: "Bảo vệ người tiêu dùng" },
  { id: "warranty", label: "Chính sách bảo hành" },
];

export default function PoliciesPage() {
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
        }
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
        Chính sách
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Điều khoản & chính sách áp dụng cho khách hàng và đối tác.
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
        id="privacy"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Chính sách bảo mật</Typography.Title>
        <Typography.Paragraph>
          Chúng tôi chỉ thu thập dữ liệu tối thiểu phục vụ xử lý đơn hàng, bảo
          hành và chăm sóc khách hàng, tuân thủ pháp luật hiện hành. Bạn có
          quyền yêu cầu truy xuất/xóa dữ liệu cá nhân.
        </Typography.Paragraph>
      </section>

      <section
        id="terms"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Điều khoản dịch vụ</Typography.Title>
        <ul>
          <li>Không lạm dụng hệ thống để trục lợi khuyến mãi.</li>
          <li>Không đăng tải nội dung vi phạm pháp luật.</li>
          <li>Đơn hàng có thể bị hủy nếu có dấu hiệu gian lận.</li>
        </ul>
      </section>

      <section
        id="consumer"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Bảo vệ người tiêu dùng</Typography.Title>
        <Alert
          type="info"
          showIcon
          message="Quyền lợi khách hàng"
          description="Hóa đơn đầy đủ, nguồn gốc chính hãng, thông tin minh bạch về giá/khuyến mãi, và kênh khiếu nại tiếp nhận 24/7."
        />
      </section>

      <section
        id="warranty"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Chính sách bảo hành</Typography.Title>
        <ul>
          <li>Bảo hành theo tiêu chuẩn của hãng (tem/phiếu/serial hợp lệ).</li>
          <li>Thời gian xử lý: 7–15 ngày làm việc (tùy dòng sản phẩm).</li>
          <li>Hỗ trợ đổi mới trong 7 ngày đầu nếu lỗi NSX.</li>
        </ul>
      </section>
    </main>
  );
}
