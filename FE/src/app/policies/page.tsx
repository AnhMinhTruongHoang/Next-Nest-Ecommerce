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
      <section className={styles.hero}>
        <Typography.Title level={2} className={styles.pageTitle}>
          Chính sách
        </Typography.Title>

        <Typography.Paragraph className={styles.pageDesc}>
          Điều khoản và chính sách áp dụng cho khách hàng, đơn hàng và dịch vụ.
        </Typography.Paragraph>
      </section>

      <aside className={styles.toc} aria-label="Mục lục">
        <details open>
          <summary>Mục lục</summary>

          <ul>
            {toc.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`}>{item.label}</a>
              </li>
            ))}
          </ul>
        </details>
      </aside>

      <Divider className={styles.divider} />

      <section id="privacy" className={styles.section}>
        <Typography.Title level={3}>Chính sách bảo mật</Typography.Title>

        <Typography.Paragraph>
          Chúng tôi chỉ thu thập dữ liệu tối thiểu phục vụ xử lý đơn hàng, bảo
          hành và chăm sóc khách hàng, tuân thủ pháp luật hiện hành. Bạn có
          quyền yêu cầu truy xuất hoặc xóa dữ liệu cá nhân.
        </Typography.Paragraph>
      </section>

      <section id="terms" className={styles.section}>
        <Typography.Title level={3}>Điều khoản dịch vụ</Typography.Title>

        <ul>
          <li>Không lạm dụng hệ thống để trục lợi khuyến mãi.</li>
          <li>Không đăng tải nội dung vi phạm pháp luật.</li>
          <li>Đơn hàng có thể bị hủy nếu có dấu hiệu gian lận.</li>
        </ul>
      </section>

      <section id="consumer" className={styles.section}>
        <Typography.Title level={3}>Bảo vệ người tiêu dùng</Typography.Title>

        <Alert
          type="info"
          showIcon
          message="Quyền lợi khách hàng"
          description="Hóa đơn đầy đủ, nguồn gốc chính hãng, thông tin minh bạch về giá/khuyến mãi, và kênh khiếu nại tiếp nhận 24/7."
          className={styles.policyAlert}
        />
      </section>

      <section id="warranty" className={styles.section}>
        <Typography.Title level={3}>Chính sách bảo hành</Typography.Title>

        <ul>
          <li>Bảo hành theo tiêu chuẩn của hãng, tem/phiếu/serial hợp lệ.</li>
          <li>Thời gian xử lý: 7–15 ngày làm việc tùy dòng sản phẩm.</li>
          <li>Hỗ trợ đổi mới trong 7 ngày đầu nếu lỗi nhà sản xuất.</li>
        </ul>
      </section>
    </main>
  );
}
