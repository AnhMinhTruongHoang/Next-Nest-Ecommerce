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

  const aboutLinks = ["About Us", "Careers", "Blog", "Contact"];
  const supportLinks = [
    "Help Center",
    "How to Buy",
    "Shipping",
    "Returns & Refunds",
  ];
  const policyLinks = [
    "Privacy Policy",
    "Terms of Service",
    "Consumer Protection",
    "Warranty Policy",
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
      {/* Links Grid */}
      <Row
        gutter={[isMobile ? 12 : 32, isMobile ? 12 : 32]}
        justify={isMobile ? "start" : "center"}
        style={{ marginBottom: isMobile ? 24 : 48 }}
      >
        {/* ABOUT */}
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={sectionTitleStyle}>
            ABOUT
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
            SUPPORT
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
            POLICIES
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
            CONNECT WITH US
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
              <strong>Address:</strong> 123/6, Thu Duc City, Ho Chi Minh City
            </Typography.Paragraph>
          </div>
        </Col>
      </Row>

      <Divider style={{ backgroundColor: "#333", margin: 0 }} />

      {/* Bottom Text */}
      <div
        style={{
          textAlign: "center",
          padding: isMobile ? "16px 8px" : "22px 0",
          fontSize: isMobile ? 12 : 14,
          color: "#aaa",
        }}
      >
        © 2025 All rights reserved by{" "}
        <a href="#" style={{ color: "#aaa" }}>
          Company
        </a>
      </div>
    </Footer>
  );
};

export default AppFooter;
