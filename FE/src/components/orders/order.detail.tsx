"use client";

import {
  App,
  Button,
  Col,
  Divider,
  Empty,
  InputNumber,
  Row,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useMemo } from "react";
import { useCurrentApp } from "@/components/context/app.context";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";
import { useRouter } from "next/navigation";

interface IProps {
  setCurrentStep: (v: number) => void;
}

const { Text } = Typography;

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const OrderDetail = ({ setCurrentStep }: IProps) => {
  const { carts, setCarts } = useCurrentApp();
  const { message } = App.useApp();
  const router = useRouter();

  const totalPrice = useMemo(() => {
    return carts.reduce(
      (acc, item) => acc + item.quantity * item.detail.price,
      0
    );
  }, [carts]);

  const handleOnChangeInput = (value: number | null, product: IProduct) => {
    if (!value || value < 1) return;

    const cartStorage = localStorage.getItem("carts");

    if (cartStorage && product) {
      const nextCarts = JSON.parse(cartStorage) as ICart[];
      const index = nextCarts.findIndex((item) => item._id === product?._id);

      if (index > -1) {
        nextCarts[index].quantity = Number(value);
        localStorage.setItem("carts", JSON.stringify(nextCarts));
        setCarts(nextCarts);
      }
    }
  };

  const handleRemoveProduct = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");

    if (cartStorage) {
      const nextCarts = (JSON.parse(cartStorage) as ICart[]).filter(
        (item) => item._id !== _id
      );

      localStorage.setItem("carts", JSON.stringify(nextCarts));
      setCarts(nextCarts);
      message.success("Removed from cart.");
    }
  };

  const handleNextStep = () => {
    if (!carts.length) {
      message.error("Your cart is empty.");
      return;
    }

    setCurrentStep(1);
  };

  return (
    <div className="gz-order-page">
      <Row gutter={[20, 20]}>
        <Col xs={24} lg={17}>
          <div className="gz-order-list-card">
            <div className="gz-order-card-head">
              <div>
                <span>Shopping Cart</span>
                <h2>Your Items</h2>
              </div>

              <div className="gz-order-count">{carts.length} items</div>
            </div>

            {carts.length === 0 ? (
              <div className="gz-order-empty">
                <Empty
                  description={
                    <span style={{ color: "#b8c0cc", fontWeight: 700 }}>
                      Your cart is empty
                    </span>
                  }
                />
              </div>
            ) : (
              <div className="gz-order-items">
                {carts.map((item) => {
                  const currentPrice = item?.detail?.price ?? 0;
                  const imageUrl =
                    getImageUrl(item.detail.thumbnail) || "/images/noimage.png";

                  return (
                    <article className="gz-order-item" key={item._id}>
                      <button
                        type="button"
                        className="gz-order-img-btn"
                        onClick={() =>
                          router.push(`/product-detail/${item._id}`)
                        }
                        aria-label={item.detail.name}
                      >
                        <Image
                          src={imageUrl}
                          alt={item.detail.name || "Product thumbnail"}
                          width={92}
                          height={92}
                          className="gz-order-img"
                        />
                      </button>

                      <div className="gz-order-info">
                        <button
                          type="button"
                          className="gz-order-name"
                          onClick={() =>
                            router.push(`/product-detail/${item._id}`)
                          }
                        >
                          {item?.detail?.name}
                        </button>

                        <Text className="gz-order-unit-price">
                          {formatCurrency(currentPrice)}
                        </Text>
                      </div>

                      <div className="gz-order-actions">
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) =>
                            handleOnChangeInput(
                              value as number | null,
                              item.detail
                            )
                          }
                          className="gz-order-qty"
                        />

                        <div className="gz-order-line-total">
                          <span>Total</span>
                          <strong>
                            {formatCurrency(currentPrice * item.quantity)}
                          </strong>
                        </div>

                        <Button
                          danger
                          type="text"
                          icon={<DeleteOutlined />}
                          onClick={() => handleRemoveProduct(item._id)}
                          className="gz-order-remove-btn"
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </Col>

        <Col xs={24} lg={7}>
          <aside className="gz-order-summary-card">
            <h3 style={{ textAlign: "center", marginBottom: 5 }}>
              Order Summary
            </h3>

            <div className="gz-summary-row">
              <span>Subtotal</span>
              <strong>{formatCurrency(totalPrice)}</strong>
            </div>

            <Divider className="gz-summary-divider" />

            <div className="gz-summary-row total">
              <span>Total</span>
              <strong>{formatCurrency(totalPrice)}</strong>
            </div>

            <Button
              type="primary"
              block
              icon={<ArrowRightOutlined />}
              iconPosition="end"
              onClick={handleNextStep}
              className="gz-order-checkout-btn"
            >
              Checkout ({carts.length})
            </Button>
          </aside>
        </Col>
      </Row>

      <style jsx global>{`
        .gz-order-page {
          width: 100%;
        }

        .gz-order-list-card,
        .gz-order-summary-card {
          border-radius: 22px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.25);
        }

        .gz-order-list-card {
          padding: 18px;
        }

        .gz-order-card-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px solid #2a2d2e;
        }

        .gz-order-card-head span {
          display: block;
          margin-bottom: 5px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 950;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .gz-order-card-head h2 {
          margin: 0;
          color: #ffffff;
          font-size: 24px;
          font-weight: 950;
        }

        .gz-order-count {
          flex-shrink: 0;
          padding: 7px 13px;
          border-radius: 999px;
          color: #00ffe0;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.2);
          font-size: 13px;
          font-weight: 900;
        }

        .gz-order-empty {
          padding: 34px 12px;
          border-radius: 18px;
          background: #181a1b;
          border: 1px dashed #303435;
        }

        .gz-order-items {
          display: grid;
          gap: 14px;
        }

        .gz-order-item {
          display: grid;
          grid-template-columns: 92px 1fr auto;
          gap: 16px;
          align-items: center;
          padding: 14px;
          border-radius: 18px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .gz-order-item:hover {
          transform: translateY(-2px);
          border-color: rgba(0, 255, 224, 0.32);
          box-shadow: 0 12px 26px rgba(0, 255, 224, 0.08);
        }

        .gz-order-img-btn {
          width: 92px;
          height: 92px;
          padding: 0;
          border: 1px solid #303435;
          border-radius: 16px;
          background: #0f1112;
          cursor: pointer;
          overflow: hidden;
        }

        .gz-order-img {
          width: 100%;
          height: 100%;
          padding: 8px;
          object-fit: contain;
          transition: transform 0.25s ease;
        }

        .gz-order-img-btn:hover .gz-order-img {
          transform: scale(1.06);
        }

        .gz-order-info {
          min-width: 0;
        }

        .gz-order-name {
          padding: 0;
          margin: 0 0 8px;
          display: -webkit-box;
          color: #ffffff;
          background: transparent;
          border: 0;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.45;
          text-align: left;
          cursor: pointer;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .gz-order-name:hover {
          color: #00ffe0;
        }

        .gz-order-unit-price {
          color: #ff4d4f !important;
          font-size: 15px;
          font-weight: 950;
        }

        .gz-order-actions {
          min-width: 290px;
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 16px;
        }

        .gz-order-qty {
          width: 88px !important;
        }

        .gz-order-qty .ant-input-number-input {
          color: #ffffff !important;
          text-align: center !important;
          font-weight: 900;
        }

        .gz-order-qty.ant-input-number {
          background: #111314 !important;
          border-color: #303435 !important;
          border-radius: 12px !important;
        }

        .gz-order-qty.ant-input-number:hover,
        .gz-order-qty.ant-input-number-focused {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }

        .gz-order-line-total {
          min-width: 120px;
          text-align: right;
        }

        .gz-order-line-total span {
          display: block;
          color: #8b949e;
          font-size: 12px;
          font-weight: 700;
        }

        .gz-order-line-total strong {
          display: block;
          margin-top: 3px;
          color: #ffffff;
          font-size: 15px;
          font-weight: 950;
        }

        .gz-order-remove-btn {
          width: 38px !important;
          height: 38px !important;
          border-radius: 999px !important;
          background: rgba(255, 77, 79, 0.08) !important;
        }

        .gz-order-summary-card {
          position: sticky;
          top: 92px;
          padding: 20px;
        }

        .gz-summary-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          margin-bottom: 12px;
          border-radius: 16px;
          color: #00ffe0;
          font-size: 22px;
          background: rgba(0, 255, 224, 0.08);
          border: 1px solid rgba(0, 255, 224, 0.18);
        }

        .gz-order-summary-card h3 {
          margin: 0 0 18px;
          color: #ffffff;
          font-size: 22px;
          font-weight: 950;
        }

        .gz-summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          color: #b8c0cc;
          font-size: 14px;
          font-weight: 700;
        }

        .gz-summary-row strong {
          color: #ffffff;
          font-weight: 950;
        }

        .gz-summary-row.total span {
          color: #ffffff;
          font-size: 16px;
          font-weight: 950;
        }

        .gz-summary-row.total strong {
          color: #ff4d4f;
          font-size: 24px;
        }

        .gz-summary-divider {
          margin: 16px 0 !important;
          border-color: #303435 !important;
        }

        .gz-order-checkout-btn {
          height: 46px !important;
          margin-top: 20px;
          border: none !important;
          border-radius: 999px !important;
          color: #061313 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          font-weight: 950 !important;
          box-shadow: 0 14px 30px rgba(0, 255, 224, 0.14) !important;
        }
@media (max-width: 992px) {
  .gz-payment-item {
    grid-template-columns: 78px 1fr;
    gap: 12px;
    align-items: center;
  }

  .gz-payment-img-box {
    width: 78px;
    height: 78px;
  }

  .gz-payment-item-total {
    grid-column: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-top: 12px;
    margin-top: 2px;
    border-top: 1px solid #2a2d2e;
    text-align: left;
  }
}

          .gz-order-item {
            grid-template-columns: 82px 1fr;
          }

          .gz-order-img-btn {
            width: 82px;
            height: 82px;
          }

          .gz-order-actions {
            grid-column: 1 / -1;
            width: 100%;
            min-width: 0;
            justify-content: space-between;
            padding-top: 12px;
            border-top: 1px solid #2a2d2e;
          }
        }

        @media (max-width: 520px) {
          .gz-order-list-card {
            padding: 12px;
            border-radius: 18px;
          }

          .gz-order-card-head {
            align-items: flex-start;
            flex-direction: column;
          }

          .gz-order-card-head h2 {
            font-size: 21px;
          }

          .gz-order-item {
            grid-template-columns: 76px 1fr;
            gap: 12px;
            padding: 12px;
            border-radius: 16px;
          }

          .gz-order-img-btn {
            width: 76px;
            height: 76px;
          }

          .gz-order-actions {
            gap: 10px;
          }

          .gz-order-line-total {
            min-width: auto;
          }

          .gz-summary-row.total strong {
            font-size: 21px;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderDetail;
