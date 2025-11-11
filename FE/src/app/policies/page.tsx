"use client";

import { Typography, Divider, Alert } from "antd";
import styles from "@/styles/footerPage.module.scss";

const toc = [
  { id: "privacy", label: "Chính sách bảo mật" },
  { id: "terms", label: "Điều khoản dịch vụ" },
  { id: "consumer", label: "Bảo vệ người tiêu dùng" },
  { id: "warranty", label: "Chính sách bảo hành" },
];

export default function PoliciesPage() {
  return (
    <main className={styles.container}>
      <Typography.Title level={2} style={{ marginTop: 8, textAlign: "center" }}>
        Chính sách
      </Typography.Title>
      <Typography.Paragraph
        type="secondary"
        style={{ marginTop: 8, textAlign: "center" }}
      >
        Điều khoản & chính sách áp dụng cho khách hàng và đối tác.
      </Typography.Paragraph>
      <Divider />
      <aside className={styles.toc} aria-label="Mục lục">
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

      <section id="privacy" className={`${styles.section} ${styles.mt32}`}>
        <Typography.Title level={3}>Chính sách bảo mật</Typography.Title>
        <Typography.Paragraph>
          Chúng tôi chỉ thu thập dữ liệu tối thiểu phục vụ xử lý đơn hàng, bảo
          hành và chăm sóc khách hàng, tuân thủ pháp luật hiện hành. Bạn có
          quyền yêu cầu truy xuất/xóa dữ liệu cá nhân.
        </Typography.Paragraph>
      </section>

      <section id="terms" className={`${styles.section} ${styles.mt32}`}>
        <Typography.Title level={3}>Điều khoản dịch vụ</Typography.Title>
        <ul>
          <li>Không lạm dụng hệ thống để trục lợi khuyến mãi.</li>
          <li>Không đăng tải nội dung vi phạm pháp luật.</li>
          <li>Đơn hàng có thể bị hủy nếu có dấu hiệu gian lận.</li>
        </ul>
      </section>

      <section id="consumer" className={`${styles.section} ${styles.mt32}`}>
        <Typography.Title level={3}>Bảo vệ người tiêu dùng</Typography.Title>
        <Alert
          type="info"
          showIcon
          message="Quyền lợi khách hàng"
          description="Hóa đơn đầy đủ, nguồn gốc chính hãng, thông tin minh bạch về giá/khuyến mãi, và kênh khiếu nại tiếp nhận 24/7."
        />
      </section>

      <section id="warranty" className={`${styles.section} ${styles.mt32}`}>
        <br />
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
