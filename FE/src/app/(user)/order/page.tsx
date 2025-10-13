"use client";

import { useState } from "react";
import OrderDetail from "@/components/orders/order.detail";
import Payment from "@/components/orders/payment";
import { Result, Button, Steps } from "antd";
import {
  DollarCircleFilled,
  LoadingOutlined,
  PayCircleFilled,
  SmileOutlined,
  SolutionOutlined,
} from "@ant-design/icons";

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div style={{ padding: 40 }}>
      <Steps
        current={currentStep}
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
        style={{ marginBottom: 40 }}
      />

      {currentStep === 0 && <OrderDetail setCurrentStep={setCurrentStep} />}
      {currentStep === 1 && <Payment setCurrentStep={setCurrentStep} />}
      {currentStep === 2 && (
        <Result
          status="success"
          title="Đặt hàng thành công!"
          subTitle="Cảm ơn bạn đã mua hàng. Chúng tôi sẽ liên hệ sớm."
          extra={[
            <Button type="primary" key="home" onClick={() => setCurrentStep(0)}>
              Tiếp tục mua sắm
            </Button>,
          ]}
        />
      )}
    </div>
  );
}
