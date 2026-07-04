"use client";

import { useState } from "react";
import OrderDetail from "@/components/orders/order.detail";
import Payment from "@/components/orders/payment";
import { Result, Button, Steps } from "antd";
import {
  DollarCircleFilled,
  SmileOutlined,
  SolutionOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();

  return (
    <section className="gz-checkout-page">
      <div className="gz-checkout-shell">
        <div className="gz-checkout-head">
          <span>Secure Checkout</span>
          <h1>Complete Your Order</h1>
          <p>Review your cart, choose payment method, and finish checkout.</p>
        </div>

        <div className="gz-checkout-steps-card">
          <Steps
            current={currentStep}
            labelPlacement="vertical"
            items={[
              {
                title: "Order",
                icon: <SolutionOutlined />,
              },
              {
                title: "Payment",
                icon: <DollarCircleFilled />,
              },
              {
                title: "Complete",
                icon: <SmileOutlined />,
              },
            ]}
          />
        </div>

        <div className="gz-checkout-content">
          {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
          {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
          {currentStep === 2 && (
            <div className="gz-checkout-result-card">
              <Result
                status="success"
                title="Order placed successfully!"
                subTitle="Thank you for shopping at GamerZone. We will contact you soon."
                extra={[
                  <Button
                    type="primary"
                    key="home"
                    icon={<HomeOutlined />}
                    onClick={() => router.push("/")}
                    className="gz-checkout-primary-btn"
                  >
                    Continue Shopping
                  </Button>,
                ]}
              />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .gz-checkout-page {
          min-height: calc(100vh - 80px);
          padding: 28px 16px 48px;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.07),
              transparent 34%
            ),
            radial-gradient(
              circle at top right,
              rgba(255, 77, 0, 0.065),
              transparent 34%
            ),
            #1e2021;
        }

        .gz-checkout-shell {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
        }

        .gz-checkout-head {
          max-width: 680px;
          margin: 0 auto 22px;
          text-align: center;
        }

        .gz-checkout-head span {
          display: block;
          margin-bottom: 8px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 950;
          line-height: 1.2;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .gz-checkout-head h1 {
          margin: 0;
          color: #ffffff;
          font-size: 36px;
          font-weight: 950;
          line-height: 1.18;
        }

        .gz-checkout-head p {
          max-width: 520px;
          margin: 10px auto 0;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.55;
        }

        .gz-checkout-steps-card {
          margin-bottom: 24px;
          padding: 18px 22px;
          border-radius: 20px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
        }

        .gz-checkout-steps-card .ant-steps-item-title {
          color: #e5e7eb !important;
          font-weight: 900 !important;
        }

        .gz-checkout-steps-card .ant-steps-item-description {
          color: #8b949e !important;
        }

        .gz-checkout-steps-card .ant-steps-item-icon {
          background: #181a1b !important;
          border-color: #303435 !important;
        }

        .gz-checkout-steps-card .ant-steps-icon {
          color: #8b949e !important;
        }

        .gz-checkout-steps-card .ant-steps-item-active .ant-steps-item-icon,
        .gz-checkout-steps-card .ant-steps-item-finish .ant-steps-item-icon {
          background: rgba(0, 255, 224, 0.12) !important;
          border-color: #00ffe0 !important;
        }

        .gz-checkout-steps-card .ant-steps-item-active .ant-steps-icon,
        .gz-checkout-steps-card .ant-steps-item-finish .ant-steps-icon {
          color: #00ffe0 !important;
        }

        .gz-checkout-steps-card
          .ant-steps-item-finish
          .ant-steps-item-container
          .ant-steps-item-tail::after {
          background-color: #00ffe0 !important;
        }

        .gz-checkout-result-card {
          border-radius: 22px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
          overflow: hidden;
        }

        .gz-checkout-result-card .ant-result-title {
          color: #ffffff !important;
          font-weight: 950 !important;
        }

        .gz-checkout-result-card .ant-result-subtitle {
          color: #b8c0cc !important;
          font-weight: 600;
        }

        .gz-checkout-primary-btn {
          height: 44px !important;
          padding: 0 22px !important;
          border: none !important;
          border-radius: 999px !important;
          color: #061313 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          font-weight: 950 !important;
        }

        @media (max-width: 768px) {
          .gz-checkout-page {
            padding: 22px 10px 38px;
          }

          .gz-checkout-head h1 {
            font-size: 28px;
          }

          .gz-checkout-steps-card {
            padding: 16px 10px;
            border-radius: 18px;
          }

          .gz-checkout-steps-card .ant-steps-item-title {
            font-size: 12px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-checkout-head h1 {
            font-size: 24px;
          }

          .gz-checkout-head p {
            font-size: 13px;
          }
        }
      `}</style>
    </section>
  );
}
