"use client";

import { updatePaymentOrderAPI } from "@/utils/api";
import { App, Button, Result, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const VNPayReturnPage = () => {
  const searchParams = useSearchParams();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error">("error");

  const paymentRef = searchParams.get("vnp_TxnRef") ?? "";
  const responseCode = searchParams.get("vnp_ResponseCode") ?? "";

  useEffect(() => {
    if (!paymentRef) return;

    const verifyPayment = async () => {
      setLoading(true);
      try {
        const result = await updatePaymentOrderAPI(
          responseCode === "00" ? "PAYMENT_SUCCEED" : "PAYMENT_FAILED",
          paymentRef
        );

        if (result?.data) {
          setStatus(responseCode === "00" ? "success" : "error");
        } else {
          throw new Error(result?.message || "Không thể xác thực thanh toán");
        }
      } catch (err: any) {
        notification.error({
          message: "Lỗi kết nối",
          description: err.message || "Không thể kết nối tới server",
        });
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentRef, responseCode, notification]);

  if (loading) {
    return (
      <div style={{ padding: 80 }}>
        <Skeleton active />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {status === "success" ? (
        <Result
          status="success"
          title="🎉 Thanh toán thành công!"
          subTitle="Đơn hàng của bạn đã được ghi nhận."
          extra={[
            <Link href="/" key="home">
              <Button type="primary">Trang chủ</Button>
            </Link>,
            <Link href="/orders/history" key="history">
              <Button>Lịch sử mua hàng</Button>
            </Link>,
          ]}
        />
      ) : (
        <Result
          status="error"
          title="❌ Thanh toán thất bại"
          subTitle="Vui lòng thử lại hoặc liên hệ admin hỗ trợ."
          extra={
            <Link href="/" key="home">
              <Button type="primary">Trang chủ</Button>
            </Link>
          }
        />
      )}
    </div>
  );
};

export default VNPayReturnPage;
