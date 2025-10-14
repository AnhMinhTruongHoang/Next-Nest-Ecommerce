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
            <Button type="primary" key="home" onClick={() => router.push("/")}>
              Tiếp tục mua sắm
            </Button>,
          ]}
        />
      )}
    </div>
  );
}
