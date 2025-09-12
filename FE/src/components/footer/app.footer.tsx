"use client";

import React from "react";
import { Layout, Typography, Row, Col, Space, Divider } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  GoogleSquareFilled,
  InstagramFilled,
  LinkedinFilled,
  GithubFilled,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter = () => {
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

  return (
    <Footer
      style={{
        backgroundColor: "#1f1f1f",
        color: "#fff",
        padding: "60px 40px 0",
        marginTop: "auto",
      }}
    >
      {/* Links Grid */}
      <Row gutter={[32, 32]} justify="center" style={{ marginBottom: 48 }}>
        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={{ color: "#fff" }}>
            ABOUT
          </Typography.Title>
          {aboutLinks.map((link, idx) => (
            <a
              key={idx}
              href="#"
              style={{
                display: "block",
                color: "#ccc",
                marginBottom: 8,
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={{ color: "#fff" }}>
            SUPPORT
          </Typography.Title>
          {supportLinks.map((link, idx) => (
            <a
              key={idx}
              href="#"
              style={{
                display: "block",
                color: "#ccc",
                marginBottom: 8,
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={{ color: "#fff" }}>
            POLICIES
          </Typography.Title>
          {policyLinks.map((link, idx) => (
            <a
              key={idx}
              href="#"
              style={{
                display: "block",
                color: "#ccc",
                marginBottom: 8,
                textDecoration: "none",
              }}
            >
              {link}
            </a>
          ))}
        </Col>

        <Col xs={24} sm={12} md={6}>
          <Typography.Title level={5} style={{ color: "#fff" }}>
            CONNECT WITH US
          </Typography.Title>
          <Space size="middle" style={{ marginTop: 8 }}>
            <FacebookFilled
              style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
            />
            <TwitterSquareFilled
              style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
            />
            <GoogleSquareFilled
              style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
            />
            <InstagramFilled
              style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
            />
            <LinkedinFilled
              style={{ fontSize: 24, color: "#fff", cursor: "pointer" }}
            />
          </Space>
          <Typography.Title
            level={5}
            style={{ color: "#fff", marginTop: "25px" }}
          >
            <div>
              <p>Hotline: 0721123213</p>
              <p>Address: 123/6, Thu Đuc City, Ho Chi Minh City</p>
            </div>
          </Typography.Title>
        </Col>
      </Row>

      <Divider style={{ backgroundColor: "#333", margin: 0 }} />

      {/* Bottom Text */}
      <div
        style={{
          textAlign: "center",
          padding: "22px 0",
          fontSize: 14,
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
