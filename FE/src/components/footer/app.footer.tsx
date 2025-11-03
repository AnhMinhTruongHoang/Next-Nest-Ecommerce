"use client";

import React from "react";
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

  const aboutLinks = ["Về chúng tôi", "Tuyển dụng", "Blog", "Liên hệ"];
  const supportLinks = [
    "Trung tâm trợ giúp",
    "Hướng dẫn mua hàng",
    "Vận chuyển",
    "Đổi trả & Hoàn tiền",
  ];
  const policyLinks = [
    "Chính sách bảo mật",
    "Điều khoản dịch vụ",
    "Bảo vệ người tiêu dùng",
    "Chính sách bảo hành",
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
            {aboutLinks.map((link, idx) => (
              <a key={idx} href="#" style={linkStyle}>
                {link}
              </a>
            ))}
          </nav>
        </Col>

        {/* SUPPORT */}
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            HỖ TRỢ
          </Typography.Title>
          <nav aria-label="Support">
            {supportLinks.map((link, idx) => (
              <a key={idx} href="#" style={linkStyle}>
                {link}
              </a>
            ))}
          </nav>
        </Col>

        {/* POLICIES */}
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            CHÍNH SÁCH
          </Typography.Title>
          <nav aria-label="Policies">
            {policyLinks.map((link, idx) => (
              <a key={idx} href="#" style={linkStyle}>
                {link}
              </a>
            ))}
          </nav>
        </Col>

        {/* CONNECT & CONTACT */}
        <Col
          xs={24}
          sm={12}
          md={6}
          style={{ textAlign: isMobile ? "left" : "left" }}
        >
          <Typography.Title level={5} style={sectionTitleStyle}>
            KẾT NỐI VỚI CHÚNG TÔI
          </Typography.Title>
          <Space size={isMobile ? 12 : "middle"} wrap>
            <a aria-label="Facebook" href="#">
              <FacebookFilled style={iconStyle} />
            </a>
            <a aria-label="Twitter" href="#">
              <TwitterSquareFilled style={iconStyle} />
            </a>
            <a aria-label="Google" href="#">
              <GoogleSquareFilled style={iconStyle} />
            </a>
            <a aria-label="Instagram" href="#">
              <InstagramFilled style={iconStyle} />
            </a>
            <a aria-label="LinkedIn" href="#">
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
