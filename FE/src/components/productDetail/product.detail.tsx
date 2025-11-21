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
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Title level={3} style={{ margin: 0 }}>
                  {currentProduct.name}
                </Title>

                {currentProduct.brand && (
                  <Tag color="blue">{currentProduct.brand}</Tag>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />
                  <Text type="secondary">Đã bán {sold}</Text>
                  {isOutOfStock ? (
                    <Tag color="error">Hết hàng</Tag>
                  ) : (
                    <Tag color="green">Còn {availableStock} sản phẩm</Tag>
                  )}
                </div>

                {currentProduct.description && (
                  <Text type="secondary">{currentProduct.description}</Text>
                )}

                <Title level={4} style={{ color: "#ff4d4f", marginTop: 8 }}>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(currentProduct.price ?? 0)}
                </Title>

                <Divider />

                <div>
                  <Text strong>Số lượng:</Text>
                  <Space>
                    <Button
                      icon={<MinusOutlined />}
                      onClick={() => handleQuantityChange("MINUS")}
                      disabled={isOutOfStock || currentQuantity <= 1}
                    />
                    <InputNumber
                      value={currentQuantity}
                      min={1}
                      max={availableStock}
                      onChange={(v) => v && handleChangeInput(v.toString())}
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

                <Divider />

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
