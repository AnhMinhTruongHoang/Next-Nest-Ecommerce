"use client";

import React from "react";
import Link from "next/link";
import { Layout, Typography, Row, Col, Space, Divider, Grid } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  GoogleSquareFilled,
  InstagramFilled,
  LinkedinFilled,
} from "@ant-design/icons";

const { Footer } = Layout;
const { useBreakpoint } = Grid;

const AppFooter = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  // Cấu hình mục lục & route nội bộ
  const aboutLinks = [
    { label: "Về chúng tôi", href: "/about" },
    { label: "Hành trình", href: "/about#story" },
    { label: "Đội ngũ", href: "/about#team" },
    { label: "Giá trị cốt lõi", href: "/about#values" },
  ];
  const supportLinks = [
    { label: "Trung tâm trợ giúp", href: "/support#help-center" },
    { label: "Hướng dẫn mua hàng", href: "/support#how-to-buy" },
    { label: "Vận chuyển", href: "/support#shipping" },
    { label: "Đổi trả & Hoàn tiền", href: "/support#returns" },
  ];
  const policyLinks = [
    { label: "Chính sách bảo mật", href: "/policies#privacy" },
    { label: "Điều khoản dịch vụ", href: "/policies#terms" },
    { label: "Bảo vệ người tiêu dùng", href: "/policies#consumer" },
    { label: "Chính sách bảo hành", href: "/policies#warranty" },
  ];

  const linkStyle: React.CSSProperties = {
    display: "block",
    color: "#ccc",
    textDecoration: "none",
    padding: isMobile ? "10px 0" : "6px 0",
    lineHeight: 1.35,
  };

  const sectionTitleStyle: React.CSSProperties = {
    color: "#fff",
    marginBottom: isMobile ? 8 : 12,
    fontSize: isMobile ? 14 : 16,
    letterSpacing: 0.4,
  };

  const footerPadding = isMobile ? "28px 16px 0" : "60px 40px 0";
  const iconSize = isMobile ? 22 : 24;
  const iconStyle: React.CSSProperties = {
    fontSize: iconSize,
    color: "#fff",
    cursor: "pointer",
    transition: "opacity .2s ease",
  };

  return (
    <Footer
      role="contentinfo"
      style={{
        backgroundColor: "#1f1f1f",
        color: "#fff",
        padding: footerPadding,
        marginTop: "auto",
      }}
    >
      <style jsx global>{`
        .footer-link:hover {
          color: #fff !important;
        }
        .footer-social:hover {
          opacity: 0.8;
        }
      `}</style>

      <Row
        gutter={[isMobile ? 12 : 32, isMobile ? 12 : 32]}
        justify={isMobile ? "start" : "center"}
        style={{ marginBottom: isMobile ? 24 : 48 }}
      >
        {/* ABOUT */}
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            VỀ CHÚNG TÔI
          </Typography.Title>
          <nav aria-label="About">
            {aboutLinks.map((l, idx) => (
              <Link
                key={idx}
                href={l.href}
                className="footer-link"
                style={linkStyle}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Col>

        {/* SUPPORT */}
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            HỖ TRỢ
          </Typography.Title>
          <nav aria-label="Support">
            {supportLinks.map((l, idx) => (
              <Link
                key={idx}
                href={l.href}
                className="footer-link"
                style={linkStyle}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Col>

        {/* POLICIES */}
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            CHÍNH SÁCH
          </Typography.Title>
          <nav aria-label="Policies">
            {policyLinks.map((l, idx) => (
              <Link
                key={idx}
                href={l.href}
                className="footer-link"
                style={linkStyle}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </Col>

        {/* CONNECT & CONTACT */}
        <Col xs={24} sm={12} md={6} style={{ textAlign: "left" }}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            KẾT NỐI VỚI CHÚNG TÔI
          </Typography.Title>
          <Space size={isMobile ? 12 : "middle"} wrap>
            <a
              aria-label="Facebook"
              href="https://www.facebook.com/?locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
            >
              <FacebookFilled style={iconStyle} />
            </a>
            <a
              aria-label="X (Twitter)"
              href="https://x.com/home"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
            >
              <TwitterSquareFilled style={iconStyle} />
            </a>
            <a
              aria-label="Gmail"
              href="https://mail.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
            >
              <GoogleSquareFilled style={iconStyle} />
            </a>
            <a
              aria-label="Instagram"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
            >
              <InstagramFilled style={iconStyle} />
            </a>
            <a
              aria-label="LinkedIn"
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-social"
            >
              <LinkedinFilled style={iconStyle} />
            </a>
          </Space>

          <div style={{ marginTop: isMobile ? 16 : 24 }}>
            <Typography.Paragraph
              style={{
                color: "#ddd",
                marginBottom: 4,
                fontSize: isMobile ? 13 : 14,
              }}
            >
              <strong>Hotline:</strong>{" "}
              <a href="tel:0721123213" style={{ color: "#ddd" }}>
                0721123213
              </a>
            </Typography.Paragraph>
            <Typography.Paragraph
              style={{
                color: "#ddd",
                marginBottom: 0,
                fontSize: isMobile ? 13 : 14,
              }}
            >
              <strong>Địa chỉ:</strong> 123/6, TP Thủ Đức, TP Hồ Chí Minh
            </Typography.Paragraph>
          </div>
        </Col>
      </Row>

      <Divider style={{ backgroundColor: "#333", margin: 0 }} />

      <div
        style={{
          textAlign: "center",
          padding: isMobile ? "16px 8px" : "22px 0",
          fontSize: isMobile ? 12 : 14,
          color: "#aaa",
        }}
      >
        © 2025 Bản quyền thuộc về M1nh
      </div>
    </Footer>
  );
};

export default AppFooter;
