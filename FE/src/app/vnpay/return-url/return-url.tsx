import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const VNPayReturn = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading"
  );

  useEffect(() => {
    if (!router.isReady) return;

    // Lấy query params từ VNPay redirect về
    const query = router.query;

    // Gọi API backend để verify chữ ký và update trạng thái đơn hàng
    fetch(
      `http://localhost:8000/api/v1/vnpay/return-url?${new URLSearchParams(
        query as any
      )}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.message?.includes("thành công")) {
          setStatus("success");
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [router.isReady]);

  if (status === "loading") return <p>Đang xử lý thanh toán...</p>;
  if (status === "success") return <p>Thanh toán thành công 🎉</p>;
  return <p>Thanh toán thất bại ❌</p>;
};

export default VNPayReturn;
