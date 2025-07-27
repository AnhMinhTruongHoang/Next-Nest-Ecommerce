"use client";

import React from "react";
import { Layout, Typography, Input, Button, Row, Col, Space } from "antd";
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
  const links = ["Link 1", "Link 2", "Link 3", "Link 4"];

  return (
    <Footer
      style={{ backgroundColor: "#212121", color: "#fff", paddingTop: 40 }}
    >
      {/* Social Icons */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <Space size="middle">
          <FacebookFilled style={{ fontSize: 24, color: "#fff" }} />
          <TwitterSquareFilled style={{ fontSize: 24, color: "#fff" }} />
          <GoogleSquareFilled style={{ fontSize: 24, color: "#fff" }} />
          <InstagramFilled style={{ fontSize: 24, color: "#fff" }} />
          <LinkedinFilled style={{ fontSize: 24, color: "#fff" }} />
          <GithubFilled style={{ fontSize: 24, color: "#fff" }} />
        </Space>
      </div>

      {/* Newsletter */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <Typography.Text style={{ color: "#fff", fontWeight: "bold" }}>
          Sign up for our newsletter
        </Typography.Text>
        <Input
          placeholder="Email address"
          size="middle"
          style={{ width: 240, borderRadius: 4 }}
        />
        <Button
          type="default"
          style={{
            color: "#fff",
            borderColor: "#fff",
            height: 40,
          }}
        >
          Subscribe
        </Button>
      </div>

      {/* Description */}
      <Typography.Paragraph
        style={{
          color: "#ccc",
          textAlign: "center",
          marginBottom: 32,
          maxWidth: 800,
          margin: "0 auto",
        }}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt distinctio
        earum repellat quaerat voluptatibus placeat nam, commodi optio pariatur
        est quia magnam eum harum corrupti dicta, aliquam sequi voluptate quas.
      </Typography.Paragraph>

      {/* Links Grid */}
      <Row gutter={[32, 24]} justify="center" style={{ marginBottom: 40 }}>
        {[1, 2, 3, 4].map((col) => (
          <Col key={col} xs={12} sm={6}>
            <Typography.Title level={5} style={{ color: "#fff" }}>
              LINKS
            </Typography.Title>
            {links.map((link, idx) => (
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
        ))}
      </Row>

      {/* Bottom Text */}
      <div
        style={{
          textAlign: "center",
          padding: "12px 0",
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          fontSize: 14,
          color: "#ccc",
        }}
      >
        © 2025 Copyright:{" "}
        <a href="https://ant.design" style={{ color: "#ccc" }}>
          Ant Design
        </a>
      </div>
    </Footer>
  );
};

export default AppFooter;
