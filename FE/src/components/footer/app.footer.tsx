"use client";

import React from "react";
import Link from "next/link";
import { Layout, Typography, Row, Col, Space, Divider } from "antd";
import {
  FacebookFilled,
  TwitterSquareFilled,
  GoogleSquareFilled,
  InstagramFilled,
  LinkedinFilled,
} from "@ant-design/icons";

const { Footer } = Layout;

const AppFooter = () => {
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

  return (
    <Footer role="contentinfo" className="gz-app-footer">
      <div className="gz-footer-container">
        <Row gutter={[20, 20]} className="gz-footer-row">
          {/* ABOUT */}
          <Col xs={24} sm={12} lg={6}>
            <div className="gz-footer-section">
              <Typography.Title level={5} className="gz-footer-title">
                VỀ CHÚNG TÔI
              </Typography.Title>

              <nav aria-label="About" className="gz-footer-nav">
                {aboutLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="gz-footer-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </Col>

          {/* SUPPORT */}
          <Col xs={24} sm={12} lg={6}>
            <div className="gz-footer-section">
              <Typography.Title level={5} className="gz-footer-title">
                HỖ TRỢ
              </Typography.Title>

              <nav aria-label="Support" className="gz-footer-nav">
                {supportLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="gz-footer-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </Col>

          {/* POLICIES */}
          <Col xs={24} sm={12} lg={6}>
            <div className="gz-footer-section">
              <Typography.Title level={5} className="gz-footer-title">
                CHÍNH SÁCH
              </Typography.Title>

              <nav aria-label="Policies" className="gz-footer-nav">
                {policyLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="gz-footer-link"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </Col>

          {/* CONNECT */}
          <Col xs={24} sm={12} lg={6}>
            <div className="gz-footer-section gz-footer-contact-section">
              <Typography.Title level={5} className="gz-footer-title">
                KẾT NỐI VỚI CHÚNG TÔI
              </Typography.Title>

              <Space size={14} wrap className="gz-footer-social-list">
                <a
                  aria-label="Facebook"
                  href="https://www.facebook.com/?locale=vi_VN"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gz-footer-social"
                >
                  <FacebookFilled />
                </a>

                <a
                  aria-label="X Twitter"
                  href="https://x.com/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gz-footer-social"
                >
                  <TwitterSquareFilled />
                </a>

                <a
                  aria-label="Gmail"
                  href="https://mail.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gz-footer-social"
                >
                  <GoogleSquareFilled />
                </a>

                <a
                  aria-label="Instagram"
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gz-footer-social"
                >
                  <InstagramFilled />
                </a>

                <a
                  aria-label="LinkedIn"
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="gz-footer-social"
                >
                  <LinkedinFilled />
                </a>
              </Space>

              <div className="gz-footer-contact">
                <p>
                  <strong>Hotline:</strong>{" "}
                  <a href="tel:0721123213">0721123213</a>
                </p>

                <p>
                  <strong>Địa chỉ:</strong> 123/6, TP Thủ Đức, TP Hồ Chí Minh
                </p>
              </div>
            </div>
          </Col>
        </Row>

        <Divider className="gz-footer-divider" />

        <div className="gz-footer-bottom">©2025 GamerZone</div>
      </div>

      <style jsx global>{`
        .gz-app-footer {
          width: 100%;
          margin-top: auto;
          padding: 56px 40px 0 !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          color: #ffffff !important;
          border-top: 1px solid #2a2d2e;
        }

        .gz-footer-container {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
        }

        .gz-footer-row {
          margin-bottom: 40px;
        }

        .gz-footer-section {
          height: 100%;
          min-height: 190px;
          padding: 6px 4px;
        }

        .gz-footer-title.ant-typography {
          margin: 0 0 14px !important;
          color: #ffffff !important;
          font-size: 15px !important;
          font-weight: 900 !important;
          line-height: 1.3 !important;
          letter-spacing: 0.5px !important;
          text-transform: uppercase;
        }

        .gz-footer-nav {
          display: grid;
          gap: 2px;
        }

        .gz-footer-link {
          display: block;
          width: fit-content;
          padding: 6px 0;
          color: #cbd5e1 !important;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.45;
          text-decoration: none !important;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .gz-footer-link:hover {
          color: #00ffe0 !important;
          transform: translateX(3px);
        }

        .gz-footer-social-list {
          display: flex !important;
          align-items: center;
        }

        .gz-footer-social {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #ffffff !important;
          font-size: 24px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid #303435;
          transition: color 0.2s ease, border-color 0.2s ease,
            background 0.2s ease, transform 0.2s ease;
        }

        .gz-footer-social:hover {
          color: #00ffe0 !important;
          border-color: rgba(0, 255, 224, 0.45);
          background: rgba(0, 255, 224, 0.08);
          transform: translateY(-2px);
        }

        .gz-footer-contact {
          margin-top: 18px;
          display: grid;
          gap: 8px;
        }

        .gz-footer-contact p {
          margin: 0;
          color: #cbd5e1;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.5;
        }

        .gz-footer-contact strong {
          color: #ffffff;
          font-weight: 900;
        }

        .gz-footer-contact a {
          color: #cbd5e1 !important;
          text-decoration: none !important;
        }

        .gz-footer-contact a:hover {
          color: #00ffe0 !important;
        }

        .gz-footer-divider {
          margin: 0 !important;
          border-color: #303435 !important;
        }

        .gz-footer-bottom {
          padding: 22px 0;
          color: #94a3b8;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.4;
          text-align: center;
        }

        @media (max-width: 991px) {
          .gz-app-footer {
            padding: 42px 24px 0 !important;
          }

          .gz-footer-row {
            margin-bottom: 30px;
          }

          .gz-footer-section {
            min-height: 170px;
          }
        }

        @media (max-width: 575px) {
          .gz-app-footer {
            padding: 28px 14px 0 !important;
          }

          .gz-footer-row {
            margin-bottom: 22px;
          }

          .gz-footer-section {
            min-height: auto;
            padding: 16px 14px;
            text-align: center;
            border-radius: 16px;
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.045),
                rgba(255, 255, 255, 0.012)
              ),
              #111314;
            border: 1px solid #2a2d2e;
          }

          .gz-footer-title.ant-typography {
            margin-bottom: 10px !important;
            font-size: 14px !important;
          }

          .gz-footer-nav {
            justify-items: center;
            gap: 0;
          }

          .gz-footer-link {
            width: 100%;
            padding: 9px 0;
            font-size: 13px;
            text-align: center;
          }

          .gz-footer-link:hover {
            transform: none;
          }

          .gz-footer-social-list {
            width: 100%;
            justify-content: center;
          }

          .gz-footer-social {
            width: 38px;
            height: 38px;
            font-size: 22px;
            border-radius: 13px;
          }

          .gz-footer-contact {
            margin-top: 16px;
            justify-items: center;
          }

          .gz-footer-contact p {
            max-width: 290px;
            font-size: 13px;
            text-align: center;
          }

          .gz-footer-bottom {
            padding: 16px 8px;
            font-size: 12px;
          }
        }

        @media (max-width: 380px) {
          .gz-app-footer {
            padding-left: 10px !important;
            padding-right: 10px !important;
          }

          .gz-footer-section {
            padding: 14px 12px;
            border-radius: 15px;
          }

          .gz-footer-social {
            width: 36px;
            height: 36px;
            font-size: 21px;
          }

          .gz-footer-contact p {
            font-size: 12px;
          }
        }
      `}</style>
    </Footer>
  );
};

export default AppFooter;
