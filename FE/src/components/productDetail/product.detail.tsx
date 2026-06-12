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
} from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
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

const { Title, Text } = Typography;

interface IProps {
  currentProduct: IProduct | null;
}

type UserAction = "MINUS" | "PLUS";

const ProductDetail = ({ currentProduct }: IProps) => {
  const [imageGallery, setImageGallery] = useState<any[]>([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);

  const refGallery = useRef<ReactImageGallery>(null);
  const router = useRouter();
  const { setCarts } = useCurrentApp();
  const { message } = App.useApp();

  const stock = Number(currentProduct?.stock ?? currentProduct?.quantity ?? 0);

  useEffect(() => {
    if (!currentProduct) return;

    const imgs: any[] = [];

    const thumb = getImageUrl(currentProduct.thumbnail);
    if (thumb) imgs.push({ original: thumb, thumbnail: thumb });

    if (Array.isArray(currentProduct.images)) {
      currentProduct.images.forEach((item) => {
        const url = getImageUrl(item);
        if (url) imgs.push({ original: url, thumbnail: url });
      });
    }

    if (!imgs.length) {
      imgs.push({
        original: "/images/noimage.png",
        thumbnail: "/images/noimage.png",
      });
    }

    setImageGallery(imgs);
  }, [currentProduct]);

  const getInCartQuantity = () => {
    const raw = localStorage.getItem("carts");
    const carts: ICart[] = raw ? JSON.parse(raw) : [];
    const idx = carts.findIndex((c) => c._id === currentProduct?._id);
    return idx > -1 ? Number(carts[idx].quantity || 0) : 0;
  };

  const availableStock = Math.max(0, stock - getInCartQuantity());

  const handleQuantityChange = (type: UserAction) => {
    if (!currentProduct) return;
    if (type === "MINUS") {
      setCurrentQuantity((q) => Math.max(1, q - 1));
    } else {
      setCurrentQuantity((q) => Math.min(q + 1, availableStock));
    }
  };

  const handleChangeInput = (value: string) => {
    const n = Number(value);
    if (!Number.isFinite(n)) return;
    setCurrentQuantity(Math.min(Math.max(1, n), availableStock));
  };

  const handleAddToCart = () => {
    if (!currentProduct) return message.error("Không tìm thấy sản phẩm");
    if (availableStock <= 0) return message.error("Hết hàng");

    const raw = localStorage.getItem("carts");
    let carts: ICart[] = raw ? JSON.parse(raw) : [];

    const idx = carts.findIndex((c) => c._id === currentProduct._id);
    const inCart = idx > -1 ? Number(carts[idx].quantity || 0) : 0;

    const addQty = Math.min(currentQuantity, Math.max(0, stock - inCart));
    if (addQty <= 0)
      return message.warning("Bạn đã thêm tối đa số lượng tồn kho");

    if (idx > -1) carts[idx].quantity = inCart + addQty;
    else
      carts.push({
        _id: currentProduct._id,
        quantity: addQty,
        detail: currentProduct,
      });

    localStorage.setItem("carts", JSON.stringify(carts));
    setCarts(carts);
    message.success("Đã thêm vào giỏ hàng");
  };

  const handleAddBuyNow = () => {
    if (!currentProduct) return message.error("Không tìm thấy sản phẩm");
    if (availableStock <= 0) return message.error("Hết hàng");

    const raw = localStorage.getItem("carts");
    let carts: ICart[] = raw ? JSON.parse(raw) : [];

    const idx = carts.findIndex((c) => c._id === currentProduct._id);
    const finalQty = Math.min(currentQuantity, availableStock);

    if (idx > -1) carts[idx].quantity = finalQty;
    else
      carts.push({
        _id: currentProduct._id,
        quantity: finalQty,
        detail: currentProduct,
      });

    localStorage.setItem("carts", JSON.stringify(carts));
    setCarts(carts);
    router.push("/order");
  };

  if (!currentProduct) return null;

  const sold = Number(currentProduct.sold || 0);
  const isOutOfStock = availableStock <= 0;

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <Breadcrumb
          className="product-breadcrumb"
          style={{ marginBottom: 16 }}
          items={[
            {
              title: (
                <Link href="/productsList" style={{ color: "#00FFE0" }}>
                  Sản phẩm
                </Link>
              ),
            },
            {
              title: <span style={{ color: "#b8b8b8" }}>Chi tiết sản phẩm</span>,
            },
          ]}
        />
  
        <Card
          variant="borderless"
          className="product-detail-card"
          styles={{
            body: {
              backgroundColor: "#181A1B",
              padding: 24,
            },
          }}
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} md={10}>
              <ReactImageGallery
                ref={refGallery}
                items={imageGallery.filter((i) => i.original)}
                showPlayButton={false}
                showFullscreenButton={false}
                slideOnThumbnailOver
                lazyLoad
                additionalClass="product-gallery"
                onClick={() => setIsOpenModalGallery(true)}
              />
            </Col>
  
            <Col xs={24} md={14}>
              <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                <Title level={3} className="product-title">
                  {currentProduct.name}
                </Title>
  
                {currentProduct.brand && (
                  <Tag color="blue">{currentProduct.brand}</Tag>
                )}
  
                <div className="product-rating-row">
                  <Rate
                    disabled
                    defaultValue={5}
                    style={{ fontSize: 14, color: "#faad14" }}
                  />
  
                  <Text className="product-sub-text">Đã bán {sold}</Text>
  
                  {isOutOfStock ? (
                    <Tag color="error">Hết hàng</Tag>
                  ) : (
                    <Tag color="green">Còn {availableStock} sản phẩm</Tag>
                  )}
                </div>
  
                {currentProduct.description && (
                  <Text className="product-description">
                    {currentProduct.description}
                  </Text>
                )}
  
                <Title level={4} className="product-price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProduct.price ?? 0)}
                </Title>
  
                <Divider className="dark-divider" />
  
                <div>
                  <Text strong className="quantity-label">
                    Số lượng:
                  </Text>
  
                  <Space style={{ marginLeft: 12 }}>
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange("MINUS")}
                      disabled={isOutOfStock || currentQuantity <= 1}
                    />
  
                    <InputNumber
                      className="quantity-input"
                      value={currentQuantity}
                      min={1}
                      max={availableStock}
                      onChange={(v) => v && handleChangeInput(v.toString())}
                    />
  
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange("PLUS")}
                      disabled={isOutOfStock || currentQuantity >= availableStock}
                    />
                  </Space>
                </div>
  
                <Divider className="dark-divider" />
  
                <Space wrap>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    disabled={isOutOfStock}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ hàng
                  </Button>
  
                  <Button
                    size="large"
                    danger
                    disabled={isOutOfStock}
                    onClick={handleAddBuyNow}
                  >
                    Mua ngay
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
  
          <br />
  
          <div className="comment-wrapper">
            <UsersComment
              productId={currentProduct._id}
              accessToken={
                typeof window !== "undefined"
                  ? localStorage.getItem("access_token") || undefined
                  : undefined
              }
            />
          </div>
  
          <Divider className="dark-divider" />
  
          <SuggestionList currentProduct={currentProduct} />
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
          background-color: #1e2021;
          min-height: 100vh;
          padding: 30px 16px;
        }
  
        .product-detail-container {
          max-width: 1200px;
          margin: 0 auto;
        }
  
        .product-detail-card {
          border-radius: 16px !important;
          overflow: hidden;
          background-color: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.28) !important;
        }
  
        .product-title {
          color: #ffffff !important;
          margin: 0 !important;
          font-weight: 800 !important;
        }
  
        .product-sub-text,
        .product-description {
          color: #b8b8b8 !important;
        }
  
        .product-description {
          line-height: 1.7;
        }
  
        .product-price {
          color: #ff4d4f !important;
          margin-top: 8px !important;
          font-weight: 800 !important;
        }
  
        .product-rating-row {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }
  
        .quantity-label {
          color: #ffffff !important;
        }
  
        .dark-divider {
          border-color: #303435 !important;
          margin: 12px 0 !important;
        }
  
        .quantity-input .ant-input-number-input {
          color: #ffffff !important;
          background-color: #111314 !important;
        }
  
        .quantity-input {
          background-color: #111314 !important;
          border-color: #303435 !important;
        }
  
        .quantity-input:hover,
        .quantity-input:focus-within {
          border-color: #00ffe0 !important;
        }
  
        .product-gallery {
          background-color: #111314;
          border-radius: 14px;
          overflow: hidden;
          border: 1px solid #2a2d2e;
        }
  
        .product-gallery .image-gallery-slide-wrapper {
          background-color: #111314;
        }
  
        .product-gallery .image-gallery-image {
          background-color: #111314;
          object-fit: contain;
        }
  
        .product-gallery .image-gallery-thumbnail {
          background-color: #181a1b;
          border: 1px solid #303435;
          border-radius: 8px;
          overflow: hidden;
        }
  
        .product-gallery .image-gallery-thumbnail.active,
        .product-gallery .image-gallery-thumbnail:hover {
          border-color: #00ffe0;
        }
  
        .product-gallery .image-gallery-icon {
          color: #ffffff;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.8));
        }
  
        .product-breadcrumb .ant-breadcrumb-separator {
          color: #777 !important;
        }
  
        .comment-wrapper {
          margin-top: 16px;
        }
  
        .comment-wrapper .ant-card {
          background-color: #181a1b !important;
          border-color: #2a2d2e !important;
        }
  
        .comment-wrapper .ant-card-body {
          background-color: #181a1b !important;
        }
  
        .comment-wrapper .ant-typography,
        .comment-wrapper p,
        .comment-wrapper span {
          color: #e5e7eb;
        }
  
        @media (max-width: 768px) {
          .product-detail-page {
            padding: 20px 12px;
          }
  
          .product-detail-card .ant-card-body {
            padding: 16px !important;
          }
  
          .product-title {
            font-size: 22px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;
