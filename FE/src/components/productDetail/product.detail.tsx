"use client";

import {
  Row,
  Col,
  Rate,
  Divider,
  App,
  Breadcrumb,
  Button,
  Card,
  InputNumber,
  Space,
  Typography,
  Tag,
} from "antd";
import {
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

import { useCurrentApp } from "@/components/context/app.context";
import ModalGallery from "@/components/products/modal.gallery";
import "../../styles/product.scss";
import UsersComment from "../ui/comment";
import SuggestionList from "./product.suggestion";
import { getImageUrl } from "@/utils/getImageUrl";

const { Title, Text, Paragraph } = Typography;

interface IProps {
  currentProduct: IProduct | null;
}

type UserAction = "MINUS" | "PLUS";

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

const ProductDetail = ({ currentProduct }: IProps) => {
  const [imageGallery, setImageGallery] = useState<any[]>([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [cartQuantity, setCartQuantity] = useState<number>(0);
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);

  const refGallery = useRef<ReactImageGallery>(null);
  const router = useRouter();
  const { setCarts } = useCurrentApp();
  const { message } = App.useApp();

  const stock = Number(currentProduct?.stock ?? currentProduct?.quantity ?? 0);
  const availableStock = Math.max(0, stock - cartQuantity);
  const sold = Number(currentProduct?.sold || 0);
  const isOutOfStock = availableStock <= 0;

  const productImages = useMemo(() => {
    if (!currentProduct) return [];

    const imgs: any[] = [];

    const thumb = getImageUrl(currentProduct.thumbnail);
    if (thumb) {
      imgs.push({
        original: thumb,
        thumbnail: thumb,
        originalAlt: currentProduct.name,
        thumbnailAlt: currentProduct.name,
      });
    }

    if (Array.isArray(currentProduct.images)) {
      currentProduct.images.forEach((item, index) => {
        const url = getImageUrl(item);
        if (!url) return;

        imgs.push({
          original: url,
          thumbnail: url,
          originalAlt: `${currentProduct.name}-${index + 1}`,
          thumbnailAlt: `${currentProduct.name}-${index + 1}`,
        });
      });
    }

    if (!imgs.length) {
      imgs.push({
        original: "/images/noimage.png",
        thumbnail: "/images/noimage.png",
        originalAlt: "No image",
        thumbnailAlt: "No image",
      });
    }

    return imgs;
  }, [currentProduct]);

  useEffect(() => {
    setImageGallery(productImages);
  }, [productImages]);

  const syncCartQuantity = () => {
    if (typeof window === "undefined" || !currentProduct?._id) return;

    try {
      const raw = localStorage.getItem("carts");
      const carts: ICart[] = raw ? JSON.parse(raw) : [];
      const item = carts.find((c) => c._id === currentProduct._id);

      setCartQuantity(Number(item?.quantity || 0));
    } catch {
      setCartQuantity(0);
    }
  };

  useEffect(() => {
    syncCartQuantity();

    if (typeof window !== "undefined") {
      setAccessToken(localStorage.getItem("access_token") || undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct?._id]);

  useEffect(() => {
    if (availableStock <= 0) {
      setCurrentQuantity(1);
      return;
    }

    setCurrentQuantity((quantity) =>
      Math.min(Math.max(1, quantity), availableStock)
    );
  }, [availableStock]);

  const handleQuantityChange = (type: UserAction) => {
    if (!currentProduct || isOutOfStock) return;

    if (type === "MINUS") {
      setCurrentQuantity((quantity) => Math.max(1, quantity - 1));
      return;
    }

    setCurrentQuantity((quantity) => Math.min(quantity + 1, availableStock));
  };

  const handleChangeInput = (value: number | string | null) => {
    if (!value || isOutOfStock) {
      setCurrentQuantity(1);
      return;
    }

    const numberValue = Number(value);
    if (!Number.isFinite(numberValue)) return;

    setCurrentQuantity(Math.min(Math.max(1, numberValue), availableStock));
  };

  const getCurrentCarts = (): ICart[] => {
    if (typeof window === "undefined") return [];

    try {
      const raw = localStorage.getItem("carts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveCarts = (carts: ICart[]) => {
    localStorage.setItem("carts", JSON.stringify(carts));
    setCarts(carts);
    syncCartQuantity();
  };

  const handleAddToCart = () => {
    if (!currentProduct) return message.error("Không tìm thấy sản phẩm");
    if (availableStock <= 0) return message.error("Hết hàng");

    const carts = getCurrentCarts();
    const index = carts.findIndex((item) => item._id === currentProduct._id);
    const inCart = index > -1 ? Number(carts[index].quantity || 0) : 0;
    const addQty = Math.min(currentQuantity, Math.max(0, stock - inCart));

    if (addQty <= 0) {
      return message.warning("Bạn đã thêm tối đa số lượng tồn kho");
    }

    if (index > -1) {
      carts[index].quantity = inCart + addQty;
    } else {
      carts.push({
        _id: currentProduct._id,
        quantity: addQty,
        detail: currentProduct,
      });
    }

    saveCarts(carts);
    message.success("Đã thêm vào giỏ hàng");
  };

  const handleAddBuyNow = () => {
    if (!currentProduct) return message.error("Không tìm thấy sản phẩm");
    if (availableStock <= 0) return message.error("Hết hàng");

    const carts = getCurrentCarts();
    const index = carts.findIndex((item) => item._id === currentProduct._id);
    const finalQty = Math.min(currentQuantity, availableStock);

    if (index > -1) {
      carts[index].quantity = finalQty;
      carts[index].detail = currentProduct;
    } else {
      carts.push({
        _id: currentProduct._id,
        quantity: finalQty,
        detail: currentProduct,
      });
    }

    saveCarts(carts);
    router.push("/order");
  };

  if (!currentProduct) return null;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <Breadcrumb
          className="product-breadcrumb"
          items={[
            {
              title: (
                <Link href="/productsList" className="product-breadcrumb-link">
                  Sản phẩm
                </Link>
              ),
            },
            {
              title: (
                <span className="product-breadcrumb-current">
                  Chi tiết sản phẩm
                </span>
              ),
            },
          ]}
        />

        <Card variant="borderless" className="product-detail-card">
          <div className="product-detail-grid">
            <section className="product-gallery-panel">
              <ReactImageGallery
                ref={refGallery}
                items={imageGallery.filter((item) => item.original)}
                showPlayButton={false}
                showFullscreenButton={false}
                slideOnThumbnailOver
                lazyLoad
                additionalClass="product-gallery"
                onClick={() => setIsOpenModalGallery(true)}
              />
            </section>

            <section className="product-info-panel">
              <div className="product-info-header">
                <span className="product-eyebrow">GamerZone Product</span>

                <Title level={2} className="product-title">
                  {currentProduct.name}
                </Title>

                <div className="product-meta-row">
                  {currentProduct.brand && (
                    <Tag className="product-brand-tag">
                      {currentProduct.brand}
                    </Tag>
                  )}

                  {isOutOfStock ? (
                    <Tag className="product-stock-tag out">Hết hàng</Tag>
                  ) : (
                    <Tag className="product-stock-tag in">
                      Còn {availableStock} sản phẩm
                    </Tag>
                  )}
                </div>

                <div className="product-rating-row">
                  <Rate
                    disabled
                    defaultValue={5}
                    style={{ fontSize: 15, color: "#faad14" }}
                  />

                  <Text className="product-sub-text">Đã bán {sold}</Text>
                </div>
              </div>

              {currentProduct.description && (
                <Paragraph className="product-description">
                  {currentProduct.description}
                </Paragraph>
              )}

              <div className="product-price-box">
                <span>Giá bán</span>
                <strong>{formatCurrency(currentProduct.price)}</strong>
              </div>

              <Divider className="dark-divider" />

              <div className="product-quantity-box">
                <Text strong className="quantity-label">
                  Số lượng
                </Text>

                <div className="quantity-control">
                  <Button
                    className="quantity-btn"
                    icon={<MinusOutlined />}
                    onClick={() => handleQuantityChange("MINUS")}
                    disabled={isOutOfStock || currentQuantity <= 1}
                  />

                  <InputNumber
                    className="quantity-input"
                    value={currentQuantity}
                    min={1}
                    max={availableStock || 1}
                    onChange={handleChangeInput}
                    disabled={isOutOfStock}
                  />

                  <Button
                    className="quantity-btn"
                    icon={<PlusOutlined />}
                    onClick={() => handleQuantityChange("PLUS")}
                    disabled={isOutOfStock || currentQuantity >= availableStock}
                  />
                </div>
              </div>

              <div className="product-note-box">
                <div>
                  <b>Trong giỏ:</b> {cartQuantity}
                </div>
                <div>
                  <b>Tồn kho:</b> {stock}
                </div>
              </div>

              <Divider className="dark-divider" />

              <div className="product-action-row">
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  disabled={isOutOfStock}
                  onClick={handleAddToCart}
                  className="product-add-cart-btn"
                >
                  Thêm vào giỏ hàng
                </Button>

                <Button
                  size="large"
                  danger
                  icon={<ThunderboltOutlined />}
                  disabled={isOutOfStock}
                  onClick={handleAddBuyNow}
                  className="product-buy-now-btn"
                >
                  Mua ngay
                </Button>
              </div>
            </section>
          </div>

          <Divider className="dark-divider product-section-divider" />

          <section className="product-comment-section">
            <UsersComment
              productId={currentProduct._id}
              accessToken={accessToken}
            />
          </section>

          <Divider className="dark-divider product-section-divider" />

          <section className="product-suggestion-section">
            <SuggestionList currentProduct={currentProduct} />
          </section>
        </Card>
      </div>

      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={refGallery.current?.getCurrentIndex() ?? 0}
        items={imageGallery}
        title={currentProduct.name}
      />

      <style jsx global>{`
        .product-detail-page {
          min-height: 100vh;
          padding: 30px 16px 44px;
          background: radial-gradient(
              circle at top left,
              rgba(0, 255, 224, 0.055),
              transparent 34%
            ),
            radial-gradient(
              circle at top right,
              rgba(255, 77, 0, 0.06),
              transparent 34%
            ),
            #1e2021;
        }

        .product-detail-container {
          width: 100%;
          max-width: 1240px;
          margin: 0 auto;
        }

        .product-breadcrumb {
          margin-bottom: 16px !important;
        }

        .product-breadcrumb-link {
          color: #00ffe0 !important;
          font-weight: 800;
          text-decoration: none !important;
        }

        .product-breadcrumb-current {
          color: #b8c0cc !important;
          font-weight: 700;
        }

        .product-breadcrumb .ant-breadcrumb-separator {
          color: #777 !important;
        }

        .product-detail-card {
          overflow: hidden;
          border-radius: 22px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid #2a2d2e !important;
          box-shadow: 0 22px 60px rgba(0, 0, 0, 0.36),
            inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
        }

        .product-detail-card .ant-card-body {
          padding: 24px !important;
          background: transparent !important;
        }

        .product-detail-grid {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
          gap: 28px;
          align-items: start;
        }

        .product-gallery-panel,
        .product-info-panel {
          min-width: 0;
        }

        .product-gallery-panel {
          position: sticky;
          top: 88px;
        }

        .product-gallery {
          overflow: hidden;
          border-radius: 18px;
          background: #0f1112;
          border: 1px solid #303435;
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.22);
        }

        .product-gallery .image-gallery-slide-wrapper {
          background: #0f1112;
          border-radius: 18px 18px 0 0;
        }

        .product-gallery .image-gallery-slide {
          background: #0f1112;
        }

        .product-gallery .image-gallery-image {
          width: 100% !important;
          height: 470px !important;
          object-fit: contain !important;
          background: #0f1112;
          cursor: zoom-in;
        }

        .product-gallery .image-gallery-thumbnails-wrapper {
          background: #111314;
          border-top: 1px solid #303435;
        }

        .product-gallery .image-gallery-thumbnails {
          padding: 12px 8px !important;
        }

        .product-gallery .image-gallery-thumbnail {
          overflow: hidden;
          width: 74px !important;
          border-radius: 12px !important;
          background: #181a1b !important;
          border: 1px solid #303435 !important;
          transition: border-color 0.2s ease, transform 0.2s ease;
        }

        .product-gallery .image-gallery-thumbnail.active,
        .product-gallery .image-gallery-thumbnail:hover {
          border-color: #00ffe0 !important;
          transform: translateY(-2px);
        }

        .product-gallery .image-gallery-thumbnail-image {
          height: 64px !important;
          object-fit: cover !important;
        }

        .product-gallery .image-gallery-icon {
          color: #ffffff !important;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.85));
        }

        .product-gallery .image-gallery-left-nav,
        .product-gallery .image-gallery-right-nav {
          padding: 0 10px !important;
        }

        .product-gallery .image-gallery-left-nav .image-gallery-svg,
        .product-gallery .image-gallery-right-nav .image-gallery-svg {
          width: 32px !important;
          height: 64px !important;
        }

        .product-info-panel {
          padding: 20px;
          border-radius: 18px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            ),
            #111314;
          border: 1px solid #2a2d2e;
        }

        .product-info-header {
          display: grid;
          gap: 10px;
        }

        .product-eyebrow {
          color: #00ffe0;
          font-size: 11px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .product-title {
          margin: 0 !important;
          color: #ffffff !important;
          font-size: clamp(24px, 3vw, 34px) !important;
          font-weight: 900 !important;
          line-height: 1.22 !important;
        }

        .product-meta-row,
        .product-rating-row {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
        }

        .product-brand-tag,
        .product-stock-tag {
          margin-inline-end: 0 !important;
          border-radius: 999px !important;
          font-weight: 900 !important;
          padding: 3px 10px !important;
          line-height: 1.35 !important;
        }

        .product-brand-tag {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.09) !important;
          border: 1px solid rgba(0, 255, 224, 0.25) !important;
        }

        .product-stock-tag.in {
          color: #22c55e !important;
          background: rgba(34, 197, 94, 0.1) !important;
          border: 1px solid rgba(34, 197, 94, 0.28) !important;
        }

        .product-stock-tag.out {
          color: #ff4d4f !important;
          background: rgba(255, 77, 79, 0.1) !important;
          border: 1px solid rgba(255, 77, 79, 0.28) !important;
        }

        .product-sub-text {
          color: #b8c0cc !important;
          font-size: 13px;
          font-weight: 700;
        }

        .product-description {
          margin: 16px 0 0 !important;
          padding: 14px;
          color: #cbd5e1 !important;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.75;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid #303435;
        }

        .product-price-box {
          margin-top: 18px;
          padding: 16px;
          display: grid;
          gap: 5px;
          border-radius: 16px;
          background: radial-gradient(
              circle at top left,
              rgba(255, 77, 79, 0.14),
              transparent 60%
            ),
            #151819;
          border: 1px solid rgba(255, 77, 79, 0.22);
        }

        .product-price-box span {
          color: #a3aab5;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .product-price-box strong {
          color: #ff4d4f;
          font-size: clamp(24px, 3vw, 34px);
          font-weight: 950;
          line-height: 1.15;
        }

        .dark-divider {
          margin: 16px 0 !important;
          border-color: #303435 !important;
        }

        .product-section-divider {
          margin: 24px 0 !important;
        }

        .product-quantity-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .quantity-label {
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 900 !important;
        }

        .quantity-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .quantity-btn {
          width: 40px !important;
          height: 40px !important;
          display: inline-flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 12px !important;
          color: #ffffff !important;
          background: #181a1b !important;
          border: 1px solid #303435 !important;
          font-weight: 900 !important;
        }

        .quantity-btn:hover:not(:disabled) {
          color: #00ffe0 !important;
          border-color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .quantity-btn:disabled {
          color: #6b7280 !important;
          background: #101112 !important;
          border-color: #242829 !important;
        }

        .quantity-input {
          width: 86px !important;
          height: 40px !important;
          background: #181a1b !important;
          border-color: #303435 !important;
          border-radius: 12px !important;
        }

        .quantity-input:hover,
        .quantity-input:focus-within {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.1) !important;
        }

        .quantity-input .ant-input-number-input {
          height: 38px !important;
          color: #ffffff !important;
          background: transparent !important;
          text-align: center !important;
          font-weight: 900 !important;
        }

        .quantity-input .ant-input-number-handler-wrap {
          display: none !important;
        }

        .product-note-box {
          margin-top: 12px;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .product-note-box div {
          padding: 10px 12px;
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 700;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid #303435;
        }

        .product-note-box b {
          color: #ffffff;
          font-weight: 900;
        }

        .product-action-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .product-add-cart-btn,
        .product-buy-now-btn {
          height: 48px !important;
          border-radius: 14px !important;
          font-size: 15px !important;
          font-weight: 900 !important;
        }

        .product-add-cart-btn {
          color: #061313 !important;
          background: linear-gradient(135deg, #00ffe0, #00b894) !important;
          border: none !important;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.16) !important;
        }

        .product-add-cart-btn:hover:not(:disabled) {
          color: #061313 !important;
          background: linear-gradient(135deg, #56fff0, #00d1aa) !important;
        }

        .product-buy-now-btn {
          color: #ffffff !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          border: none !important;
          box-shadow: 0 12px 28px rgba(255, 77, 0, 0.18) !important;
        }

        .product-buy-now-btn:hover:not(:disabled) {
          color: #ffffff !important;
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
        }

        .product-add-cart-btn:disabled,
        .product-buy-now-btn:disabled {
          color: #8b949e !important;
          background: #242829 !important;
          box-shadow: none !important;
        }

        .product-comment-section,
        .product-suggestion-section {
          min-width: 0;
        }

        .product-comment-section .ant-card,
        .comment-wrapper .ant-card {
          background: #111314 !important;
          border-color: #2a2d2e !important;
          border-radius: 16px !important;
        }

        .product-comment-section .ant-card-body,
        .comment-wrapper .ant-card-body {
          background: transparent !important;
        }

        .product-comment-section .ant-typography,
        .product-comment-section p,
        .product-comment-section span,
        .comment-wrapper .ant-typography,
        .comment-wrapper p,
        .comment-wrapper span {
          color: #e5e7eb;
        }

        @media (max-width: 991px) {
          .product-detail-page {
            padding: 22px 12px 36px;
          }

          .product-detail-card .ant-card-body {
            padding: 18px !important;
          }

          .product-detail-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }

          .product-gallery-panel {
            position: relative;
            top: auto;
          }

          .product-gallery .image-gallery-image {
            height: 420px !important;
          }

          .product-info-panel {
            padding: 18px;
          }
        }

        @media (max-width: 768px) {
          .product-detail-page {
            padding: 18px 10px 32px;
          }

          .product-detail-card {
            border-radius: 18px !important;
          }

          .product-detail-card .ant-card-body {
            padding: 14px !important;
          }

          .product-gallery,
          .product-info-panel {
            border-radius: 16px;
          }

          .product-gallery .image-gallery-image {
            height: 360px !important;
          }

          .product-gallery .image-gallery-thumbnail {
            width: 62px !important;
          }

          .product-gallery .image-gallery-thumbnail-image {
            height: 54px !important;
          }

          .product-info-panel {
            padding: 16px;
          }

          .product-title {
            font-size: 24px !important;
          }

          .product-quantity-box {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
          }

          .quantity-control {
            width: 100%;
            display: grid;
            grid-template-columns: 42px minmax(0, 1fr) 42px;
          }

          .quantity-btn {
            width: 42px !important;
            height: 42px !important;
          }

          .quantity-input {
            width: 100% !important;
            height: 42px !important;
          }

          .quantity-input .ant-input-number-input {
            height: 40px !important;
          }

          .product-action-row {
            grid-template-columns: 1fr;
          }

          .product-add-cart-btn,
          .product-buy-now-btn {
            width: 100%;
            height: 46px !important;
          }
        }

        @media (max-width: 480px) {
          .product-detail-page {
            padding: 14px 8px 28px;
          }

          .product-breadcrumb {
            margin-bottom: 12px !important;
            font-size: 12px;
          }

          .product-detail-card {
            border-radius: 16px !important;
          }

          .product-detail-card .ant-card-body {
            padding: 10px !important;
          }

          .product-detail-grid {
            gap: 12px;
          }

          .product-gallery .image-gallery-image {
            height: 310px !important;
          }

          .product-gallery .image-gallery-thumbnails {
            padding: 9px 6px !important;
          }

          .product-gallery .image-gallery-thumbnail {
            width: 54px !important;
            border-radius: 9px !important;
          }

          .product-gallery .image-gallery-thumbnail-image {
            height: 48px !important;
          }

          .product-gallery .image-gallery-left-nav,
          .product-gallery .image-gallery-right-nav {
            padding: 0 4px !important;
          }

          .product-gallery .image-gallery-left-nav .image-gallery-svg,
          .product-gallery .image-gallery-right-nav .image-gallery-svg {
            width: 24px !important;
            height: 48px !important;
          }

          .product-info-panel {
            padding: 14px;
            border-radius: 15px;
          }

          .product-eyebrow {
            text-align: center;
            font-size: 10px;
          }

          .product-title {
            font-size: 22px !important;
            text-align: center;
          }

          .product-meta-row,
          .product-rating-row {
            justify-content: center;
          }

          .product-description {
            padding: 12px;
            font-size: 13px;
            text-align: center;
          }

          .product-price-box {
            margin-top: 14px;
            padding: 14px;
            text-align: center;
          }

          .product-price-box strong {
            font-size: 25px;
          }

          .product-note-box {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .product-note-box div {
            text-align: center;
          }

          .product-section-divider {
            margin: 18px 0 !important;
          }
        }

        @media (max-width: 360px) {
          .product-gallery .image-gallery-image {
            height: 270px !important;
          }

          .product-title {
            font-size: 20px !important;
          }

          .product-price-box strong {
            font-size: 23px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
