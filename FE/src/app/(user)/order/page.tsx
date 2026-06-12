"use client";

import { useState } from "react";
import OrderDetail from "@/components/orders/order.detail";
import Payment from "@/components/orders/payment";
import { Result, Button, Steps } from "antd";
import {
  DollarCircleFilled,
  SmileOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  return (
    <main className="gz-checkout-page">
      <div className="gz-checkout-container">
        <div className="gz-checkout-steps-card">
          <Steps
            current={currentStep}
            responsive={false}
            items={[
              {
                title: "Đặt hàng",
                icon: <SolutionOutlined />,
              },
              {
                title: "Thanh toán",
                icon: <DollarCircleFilled />,
              },
              {
                title: "Hoàn tất",
                icon: <SmileOutlined />,
              },
            ]}
          />
        </div>

        <section className="gz-checkout-content">
          {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}

          {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}

          {currentStep === 2 && (
            <div className="gz-checkout-success-card">
              <Result
                className="gz-checkout-result"
                status="success"
                title="Đặt hàng thành công!"
                subTitle="Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm."
                extra={[
                  <Button
                    type="primary"
                    key="home"
                    onClick={() => router.push("/")}
                    className="gz-continue-btn"
                  >
                    Tiếp tục mua sắm
                  </Button>,
                ]}
              />
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .gz-checkout-page {
          min-height: 100vh;
          background: #1e2021;
          padding: 28px 16px 60px;
          color: #ffffff;
        }

        .gz-checkout-container {
          max-width: 1280px;
          margin: 0 auto;
        }

        .gz-checkout-steps-card {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          padding: 22px 24px;
          margin-bottom: 24px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          overflow-x: auto;
        }

        .gz-checkout-steps-card .ant-steps {
          min-width: 680px;
        }

        .gz-checkout-steps-card .ant-steps-item-title {
          color: #e5e7eb !important;
          font-weight: 700;
        }

        .gz-checkout-steps-card .ant-steps-item-description {
          color: #8b949e !important;
        }

        .gz-checkout-steps-card .ant-steps-item-tail::after {
          background-color: #303435 !important;
        }

        .gz-checkout-steps-card
          .ant-steps-item-process
          .ant-steps-item-icon {
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          border-color: #ff4d00 !important;
          box-shadow: 0 0 0 4px rgba(255, 77, 0, 0.12);
        }

        .gz-checkout-steps-card
          .ant-steps-item-process
          .ant-steps-icon {
          color: #ffffff !important;
        }

        .gz-checkout-steps-card .ant-steps-item-finish .ant-steps-item-icon {
          background: rgba(0, 255, 224, 0.12) !important;
          border-color: #00ffe0 !important;
        }

        .gz-checkout-steps-card .ant-steps-item-finish .ant-steps-icon {
          color: #00ffe0 !important;
        }

        .gz-checkout-steps-card
          .ant-steps-item-finish
          .ant-steps-item-tail::after {
          background-color: #00ffe0 !important;
        }

        .gz-checkout-steps-card .ant-steps-item-wait .ant-steps-item-icon {
          background: #111314 !important;
          border-color: #303435 !important;
        }

        .gz-checkout-steps-card .ant-steps-item-wait .ant-steps-icon {
          color: #8b949e !important;
        }

        .gz-checkout-content {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 18px;
          padding: 24px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          min-height: 420px;
        }

        .gz-checkout-success-card {
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .gz-checkout-result {
          width: 100%;
        }

        .gz-checkout-result .ant-result-title {
          color: #ffffff !important;
          font-weight: 800 !important;
        }

        .gz-checkout-result .ant-result-subtitle {
          color: #8b949e !important;
        }

        .gz-checkout-result .ant-result-icon .anticon {
          color: #52c41a !important;
        }

        .gz-continue-btn {
          height: 42px !important;
          min-width: 160px;
          border: none !important;
          border-radius: 999px !important;
          font-weight: 800 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 10px 22px rgba(255, 77, 0, 0.2) !important;
        }

        .gz-continue-btn:hover {
          background: linear-gradient(135deg, #ff651a, #ff8a26) !important;
        }

        @media (max-width: 768px) {
          .gz-checkout-page {
            padding: 16px 10px 40px;
          }

          .gz-checkout-steps-card {
            padding: 16px 14px;
            border-radius: 14px;
            margin-bottom: 16px;
          }

          .gz-checkout-content {
            padding: 14px;
            border-radius: 14px;
          }

          .gz-checkout-steps-card .ant-steps {
            min-width: 520px;
          }

          .gz-checkout-steps-card .ant-steps-item-title {
            font-size: 13px;
          }

          .gz-checkout-success-card {
            min-height: 360px;
          }

          .gz-checkout-result .ant-result-title {
            font-size: 22px !important;
          }

          .gz-checkout-result .ant-result-subtitle {
            font-size: 13px !important;
          }

          .gz-continue-btn {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .gz-checkout-page {
            padding: 12px 8px 36px;
          }

          .gz-checkout-steps-card .ant-steps {
            min-width: 460px;
          }

          .gz-checkout-content {
            padding: 12px;
          }
        }
      `}</style>
    </main>
  );
}