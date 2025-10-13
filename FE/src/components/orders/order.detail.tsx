import { App, Button, Col, Divider, Empty, InputNumber, Row } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCurrentApp } from "@/components/context/app.context";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { isMobile } from "react-device-detect";
import { useRouter } from "next/navigation";

interface IProps {
  setCurrentStep: (v: number) => void;
}

const OrderDetail = (props: IProps) => {
  const { setCurrentStep } = props;
  const { carts, setCarts } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);
  const { message } = App.useApp();
  const router = useRouter();

  useEffect(() => {
    if (carts && carts.length > 0) {
      const sum = carts.reduce(
        (acc, item) => acc + item.quantity * item.detail.price,
        0
      );
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleOnChangeInput = (value: number, product: IProduct) => {
    if (!value || +value < 1) return;
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && product) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const idx = carts.findIndex((c) => c._id === product?._id);
      if (idx > -1) {
        carts[idx].quantity = +value;
        localStorage.setItem("carts", JSON.stringify(carts));
        setCarts(carts);
      }
    }
  };

  const handleRemoveProduct = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      setCarts(newCarts);
    }
  };

  const handleNextStep = () => {
    if (!carts.length) {
      message.error("Không tồn tại sản phẩm trong giỏ hàng.");
      return;
    }
    setCurrentStep(1);
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", overflow: "hidden" }}>
        <Row gutter={[20, 20]}>
          <Col md={18} xs={24}>
            {carts?.map((item, index) => {
              const currentPrice = item?.detail?.price ?? 0;
              return (
                <div
                  key={`index-${index}`}
                  style={{
                    display: "flex",
                    gap: "30px",
                    marginBottom: "20px",
                    background: "white",
                    padding: "20px",
                    borderRadius: "5px",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  {/* Product info */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      width: "50%",
                      justifyContent: "space-between",
                    }}
                  >
                    <Image
                      onClick={() => router.push(`/product-detail/${item._id}`)}
                      style={{ cursor: "pointer" }}
                      src={getImageUrl(item.detail.thumbnail)}
                      alt="thumbnail"
                      width={70}
                      height={70}
                    />
                    <div style={{ flex: 1, marginLeft: "10px" }}>
                      <div style={{ fontWeight: 500, cursor: "pointer" }}>
                        <a
                          onClick={() =>
                            router.push(`/product-detail/${item._id}`)
                          }
                        >
                          {item?.detail?.name}
                        </a>
                      </div>
                      <div style={{ color: "#555" }}>
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(currentPrice)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    style={{
                      width: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "10px",
                    }}
                  >
                    <InputNumber
                      min={1}
                      onChange={(value) =>
                        handleOnChangeInput(value as number, item.detail)
                      }
                      value={item.quantity}
                    />
                    <div>
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(currentPrice * (item?.quantity ?? 0))}
                    </div>
                    <DeleteTwoTone
                      style={{ cursor: "pointer" }}
                      onClick={() => handleRemoveProduct(item._id)}
                      twoToneColor="#eb2f96"
                    />
                  </div>
                </div>
              );
            })}

            {carts.length === 0 && (
              <Empty description="Không có sản phẩm trong giỏ hàng" />
            )}
          </Col>

          {/* Right side */}
          <Col md={6} xs={24}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "5px",
                gap: "20px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Tạm tính</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>Tổng tiền</span>
                <span
                  style={{
                    color: "#fe3834",
                    fontSize: "22px",
                    fontWeight: 400,
                  }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <Button
                color="danger"
                variant="solid"
                onClick={() => handleNextStep()}
              >
                Mua Hàng ({carts?.length ?? 0})
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default OrderDetail;
