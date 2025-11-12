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

  // Tính tồn kho khả dụng (ưu tiên stock, fallback sang quantity nếu BE cũ)
  const stock =
    (currentProduct?.stock ?? currentProduct?.quantity ?? 0) > 0
      ? Number(currentProduct?.stock ?? currentProduct?.quantity ?? 0)
      : 0;

  // Build image list for gallery
  useEffect(() => {
    if (!currentProduct) return;

    const images: any[] = [];
    const buildUrl = (url?: string) => {
      if (!url || url.trim() === "") return null;
      return url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
    };

    const thumb = buildUrl(currentProduct.thumbnail);
    if (thumb) images.push({ original: thumb, thumbnail: thumb });

    if (Array.isArray(currentProduct.images)) {
      currentProduct.images.forEach((item) => {
        const url = buildUrl(item);
        if (url) images.push({ original: url, thumbnail: url });
      });
    }

    if (images.length === 0) {
      images.push({
        original: "/images/noimage.png",
        thumbnail: "/images/noimage.png",
      });
    }

    setImageGallery(images);
  }, [currentProduct]);

  // Lấy số lượng item này đã có trong giỏ (để chặn vượt stock)
  const getInCartQuantity = () => {
    const cartStorage = localStorage.getItem("carts");
    const carts: ICart[] = cartStorage ? JSON.parse(cartStorage) : [];
    const idx = carts.findIndex((c) => c._id === currentProduct?._id);
    return idx > -1 ? Number(carts[idx].quantity || 0) : 0;
  };

  const availableStock = Math.max(0, stock - getInCartQuantity());

  // Quantity logic
  const handleQuantityChange = (type: UserAction) => {
    if (!currentProduct) return;

    if (type === "MINUS") {
      setCurrentQuantity((q) => Math.max(1, q - 1));
    } else {
      // PLUS
      setCurrentQuantity((q) => {
        const next = q + 1;
        if (availableStock <= 0) return q;
        return Math.min(next, availableStock);
      });
    }
  };

  // input value
  const handleChangeInput = (value: string) => {
    if (!currentProduct) return;
    const n = Number(value);
    if (Number.isFinite(n)) {
      if (availableStock <= 0) {
        setCurrentQuantity(1);
        return;
      }
      if (n > 0) {
        setCurrentQuantity(Math.min(n, availableStock));
      }
    }
  };

  // Add to cart
  const handleAddToCart = () => {
    if (!currentProduct) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }

    if (availableStock <= 0) {
      message.error("Sản phẩm đã hết hàng");
      return;
    }

    if (currentQuantity <= 0) {
      message.error("Số lượng không hợp lệ");
      return;
    }

    const cartStorage = localStorage.getItem("carts");
    let carts: ICart[] = cartStorage ? JSON.parse(cartStorage) : [];

    const idx = carts.findIndex((c) => c._id === currentProduct._id);
    const inCart = idx > -1 ? Number(carts[idx].quantity || 0) : 0;

    const canAdd = Math.max(0, stock - inCart);
    if (canAdd <= 0) {
      message.warning("Bạn đã thêm tối đa theo tồn kho");
      return;
    }

    const addQty = Math.min(currentQuantity, canAdd);

    if (idx > -1) {
      carts[idx].quantity = inCart + addQty;
    } else {
      carts.push({
        _id: currentProduct._id,
        quantity: addQty,
        detail: currentProduct,
      });
    }

    localStorage.setItem("carts", JSON.stringify(carts));
    setCarts(carts);
    message.success("Đã thêm vào giỏ hàng");
  };

  const handleAddBuyNow = () => {
    if (!currentProduct) {
      message.error("Không tìm thấy sản phẩm");
      return;
    }
    if (availableStock <= 0) {
      message.error("Sản phẩm đã hết hàng");
      return;
    }
    if (currentQuantity <= 0) {
      message.error("Số lượng không hợp lệ");
      return;
    }

    const cartStorage = localStorage.getItem("carts");
    let carts: ICart[] = cartStorage ? JSON.parse(cartStorage) : [];

    const idx = carts.findIndex((c) => c._id === currentProduct._id);
    const inCart = idx > -1 ? Number(carts[idx].quantity || 0) : 0;
    const canSet = Math.max(0, stock);

    const finalQty = Math.min(currentQuantity, canSet);

    if (idx > -1) {
      carts[idx].quantity = finalQty;
      carts[idx].detail = currentProduct;
    } else {
      carts.push({
        _id: currentProduct._id,
        quantity: finalQty,
        detail: currentProduct,
      });
    }

    localStorage.setItem("carts", JSON.stringify(carts));
    setCarts(carts);
    router.push("/order");
  };

  if (!currentProduct) return null;

  const sold = Number(currentProduct.sold || 0);
  const isOutOfStock = stock <= 0;

  return (
    <div style={{ background: "#f5f5f5", padding: "30px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link href="/productsList">Sản phẩm</Link> },
            { title: "Chi tiết sản phẩm" },
          ]}
        />

        <Card
          variant="borderless"
          style={{
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <Row gutter={[32, 32]}>
            <Col xs={24} md={10}>
              <ReactImageGallery
                ref={refGallery}
                items={imageGallery.filter(
                  (img) => img.original && img.original.trim() !== ""
                )}
                showPlayButton={false}
                showFullscreenButton={false}
                slideOnThumbnailOver
                lazyLoad
                additionalClass="product-gallery"
                onClick={() => setIsOpenModalGallery(true)}
              />
            </Col>

            {/*  Thông tin sản phẩm */}
            <Col xs={24} md={14}>
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {currentProduct.name}
                </Title>

                {currentProduct.brand ? (
                  <Tag color="blue">{currentProduct.brand}</Tag>
                ) : null}

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                  <Text type="secondary">Đã bán {sold}</Text>
                  {isOutOfStock ? (
                    <Tag color="error" style={{ marginLeft: 8 }}>
                      Hết hàng
                    </Tag>
                  ) : (
                    <Tag color="green" style={{ marginLeft: 8 }}>
                      Còn {stock} sản phẩm
                    </Tag>
                  )}
                </div>

                {currentProduct.description ? (
                  <div style={{ width: "100%", marginTop: 8 }}>
                    <Text type="secondary">{currentProduct.description}</Text>
                  </div>
                ) : null}

                <Title
                  level={4}
                  style={{ color: "#ff4d4f", fontWeight: 600, marginTop: 8 }}
                >
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProduct.price ?? 0)}
                </Title>

                <Divider style={{ margin: "12px 0" }} />

                <div>
                  <Text strong>Số lượng: </Text>
                  <Space>
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange("MINUS")}
                      disabled={isOutOfStock || currentQuantity <= 1}
                    />
                    <InputNumber
                      value={currentQuantity}
                      min={1}
                      max={Math.max(1, availableStock || stock || 1)}
                      onChange={(value) => {
                        if (value !== null) {
                          handleChangeInput(value.toString());
                        }
                      }}
                      disabled={isOutOfStock}
                      style={{ width: 80 }}
                    />
                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange("PLUS")}
                      disabled={
                        isOutOfStock || currentQuantity >= availableStock
                      }
                    />
                  </Space>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <Space wrap>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    size="large"
                    danger
                    onClick={handleAddBuyNow}
                    disabled={isOutOfStock}
                  >
                    Mua ngay
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>

          <br />
          <br />
          <UsersComment
            productId={currentProduct._id}
            accessToken={
              typeof window !== "undefined"
                ? localStorage.getItem("access_token") || undefined
                : undefined
            }
          />

          <Divider />
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
    </div>
  );
};

export default ProductDetail;
