"use client";

import { updatePaymentOrderAPI } from "@/utils/api";
import { App, Button, Result, Skeleton, Card } from "antd";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrentApp } from "@/components/context/app.context";

const VNPayReturnPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { notification, message } = App.useApp();
  const { setCarts } = useCurrentApp();

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error">("error");
  const didCallRef = useRef(false);

  const paymentRef = searchParams.get("vnp_TxnRef") ?? "";
  const responseCode = searchParams.get("vnp_ResponseCode") ?? "";

  useEffect(() => {
    // Thiếu param → hiển thị lỗi gọn gàng
    if (!paymentRef || !responseCode) {
      setStatus("error");
      setLoading(false);
      return;
    }

    if (didCallRef.current) return;
    didCallRef.current = true;

    const verifyPayment = async () => {
      setLoading(true);
      try {
        const result = await updatePaymentOrderAPI(
          responseCode === "00" ? "PAYMENT_SUCCEED" : "PAYMENT_FAILED",
          paymentRef
        );

        // BE đã confirm & trừ kho thành công khi "00"
        if (responseCode === "00") {
          // ✅ Clear giỏ hàng phía FE sau khi BE đã cập nhật stock/sold
          localStorage.removeItem("carts");
          setCarts([]);
          setStatus("success");
          message.success("Thanh toán thành công!");
        } else {
          setStatus("error");
          message.error("Thanh toán thất bại hoặc đã huỷ.");
        }

        // Có thể inspect result để hiển thị thêm thông tin đơn hàng nếu muốn
        // console.log("confirm result:", result);
      } catch (err: any) {
        notification.error({
          message: "Lỗi kết nối",
          description: err?.message || "Không thể kết nối tới server",
        });
        setStatus("error");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [paymentRef, responseCode, notification, message, setCarts]);

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
          ? "linear-gradient(135deg, #d4fc79, #96e6a1)"
          : "linear-gradient(135deg, #f85032, #e73827)",
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
                <Button size="large">Trang chủ</Button>
              </Link>,
            ]}
          />
        )}
      </Card>
    </div>
  );
};

export default VNPayReturnPage;
