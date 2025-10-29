"use client";

import { updatePaymentOrderAPI } from "@/utils/api";
import { App, Button, Result, Skeleton, Card } from "antd";
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
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f5f5",
        }}
      >
        <Skeleton active paragraph={{ rows: 4 }} style={{ width: 400 }} />
      </div>
    );
  }

  const isSuccess = status === "success";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: isSuccess
          ? "linear-gradient(135deg, #d4fc79, #96e6a1)" // xanh lá nhẹ khi thành công
          : "linear-gradient(135deg, #f85032, #e73827)", // đỏ cam khi lỗi
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Card
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 16,
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}
      >
        {isSuccess ? (
          <Result
            status="success"
            title="🎉 Thanh toán thành công!"
            subTitle={
              <div style={{ fontSize: 16, marginTop: 8 }}>
                Cảm ơn bạn đã mua hàng tại <b>GamerZone</b> 💚
              </div>
            }
            extra={[
              <Link href="/" key="home">
                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: "#00C853",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Về trang chủ
                </Button>
              </Link>,
            ]}
          />
        ) : (
          <Result
            status="error"
            title="❌ Thanh toán thất bại"
            subTitle={
              <div style={{ fontSize: 16, marginTop: 8 }}>
                Giao dịch không thành công. Vui lòng thử lại hoặc liên hệ hỗ
                trợ.
              </div>
            }
            extra={[
              <Link href="/" key="home">
                <Button
                  type="primary"
                  size="large"
                  style={{
                    background: "#ff1744",
                    border: "none",
                    borderRadius: 8,
                    fontWeight: 600,
                  }}
                >
                  Quay lại trang chủ
                </Button>
              </Link>,
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default VNPayReturnPage;
