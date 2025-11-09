"use client";

import { Typography, Divider } from "antd";

const SECTION_GAP = 32;

const toc = [
  { id: "help-center", label: "Trung tâm trợ giúp" },
  { id: "how-to-buy", label: "Hướng dẫn mua hàng" },
  { id: "shipping", label: "Vận chuyển" },
  { id: "returns", label: "Đổi trả & Hoàn tiền" },
  { id: "contact", label: "Liên hệ hỗ trợ" },
];

export default function SupportPage() {
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
        code.block {
          display: inline-block;
          background: #f6f8fa;
          padding: 6px 8px;
          border-radius: 6px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
        }
      `}</style>

      <Typography.Title level={2} style={{ marginTop: 8 }}>
        Hỗ trợ
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Hướng dẫn, chính sách giao nhận, đổi trả và các kênh liên hệ khi cần trợ
        giúp.
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
        id="help-center"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Trung tâm trợ giúp</Typography.Title>
        <Typography.Paragraph>
          Tra cứu đơn hàng, bảo hành, sản phẩm và các câu hỏi thường gặp.
        </Typography.Paragraph>
      </section>

      <section
        id="how-to-buy"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Hướng dẫn mua hàng</Typography.Title>
        <ol>
          <li>Chọn sản phẩm &rarr; Thêm vào giỏ</li>
          <li>Điền thông tin nhận hàng</li>
          <li>Chọn phương thức thanh toán</li>
          <li>Xác nhận đơn</li>
        </ol>
        <Typography.Paragraph>
          Mẹo: dùng ô tìm kiếm ở header, hoặc lọc theo{" "}
          <code className="block">Danh mục / Khoảng giá</code>.
        </Typography.Paragraph>
      </section>

      <section
        id="shipping"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Vận chuyển</Typography.Title>
        <ul>
          <li>HCM nội thành: 1–2 ngày</li>
          <li>Toàn quốc: 2–5 ngày (tùy khu vực)</li>
          <li>Miễn phí: đơn từ 1.000.000đ (tùy ưu đãi)</li>
        </ul>
      </section>

      <section
        id="returns"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Đổi trả & Hoàn tiền</Typography.Title>
        <ul>
          <li>Đổi trả trong 7 ngày nếu lỗi do nhà sản xuất</li>
          <li>Hỗ trợ hoàn tiền theo phương thức thanh toán</li>
          <li>Giữ nguyên hộp & phụ kiện khi đổi trả</li>
        </ul>
      </section>

      <section
        id="contact"
        className="section"
        style={{ marginTop: SECTION_GAP }}
      >
        <Typography.Title level={3}>Liên hệ hỗ trợ</Typography.Title>
        <Typography.Paragraph>
          Hotline: <a href="tel:0721123213">0721123213</a> — Email:{" "}
          <a href="mailto:support@example.com">support@example.com</a>
        </Typography.Paragraph>
      </section>
    </main>
  );
}
