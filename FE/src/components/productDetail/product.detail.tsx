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

const { Title, Text } = Typography;

interface IProps {
  currentProduct: IProduct | null;
}

type UserAction = "MINUS" | "PLUS";

const ProductDetail = ({ currentProduct }: IProps) => {
  const [loading, setLoading] = useState(true);
  const [imageGallery, setImageGallery] = useState<any[]>([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const refGallery = useRef<ReactImageGallery>(null);
  const router = useRouter();
  const { setCarts, user } = useCurrentApp();
  const { message } = App.useApp();

  // Build image list for gallery
  useEffect(() => {
    if (!currentProduct) return;

    const images: any[] = [];
    if (currentProduct.thumbnail) {
      images.push({
        original: `${process.env.NEXT_PUBLIC_BACKEND_URL}${currentProduct.thumbnail}`,
        thumbnail: `${process.env.NEXT_PUBLIC_BACKEND_URL}${currentProduct.thumbnail}`,
      });
    }

    if (Array.isArray(currentProduct.images)) {
      currentProduct.images.forEach((item) => {
        const url = item.startsWith("/images/")
          ? `${process.env.NEXT_PUBLIC_BACKEND_URL}${item}`
          : `${process.env.NEXT_PUBLIC_BACKEND_URL}images/slider/${item}`;
        images.push({ original: url, thumbnail: url });
      });
    }

    setImageGallery(images);
  }, [currentProduct]);

  // Quantity logic
  const handleQuantityChange = (type: UserAction) => {
    if (type == "MINUS") {
      if (currentQuantity - 1 <= 0) return;
      setCurrentQuantity(currentQuantity - 1);
    }
    if (type === "PLUS" && currentProduct) {
      if (currentQuantity === +currentProduct.quantity) return; //max

      setCurrentQuantity(currentQuantity + 1);
    }
  };

  /// input value

  const handleChangeInput = (value: string) => {
    if (!isNaN(+value)) {
      if (+value > 0 && currentProduct && +value <= +currentProduct.quantity) {
        setCurrentQuantity(+value);
      }
    }
  };

  // Add to cart
  const handleAddToCart = (isBuyNow = false) => {
    if (!user) {
      message.error("Bạn cần đăng nhập để thực hiện tính năng này.");
      return;
    }

    const cartStorage = localStorage.getItem("carts");
    let carts: ICart[] = cartStorage ? JSON.parse(cartStorage) : [];

    if (currentProduct) {
      const index = carts.findIndex((c) => c._id === currentProduct._id);
      if (index > -1) carts[index].quantity += currentQuantity;
      else
        carts.push({
          _id: currentProduct._id,
          quantity: currentQuantity,
          detail: currentProduct,
        });

      localStorage.setItem("carts", JSON.stringify(carts));
      setCarts(carts);
    }

    if (isBuyNow) router.push("/order");
    else message.success("Đã thêm sản phẩm vào giỏ hàng 🎉");
  };

  if (!currentProduct) return null;

  return (
    <div style={{ background: "#f5f5f5", padding: "30px 0" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Breadcrumb
          style={{ marginBottom: 16 }}
          items={[
            { title: <Link href="/">Trang chủ</Link> },
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
            {/*  Hình ảnh bên trái */}
            <Col xs={24} md={10}>
              <ReactImageGallery
                ref={refGallery}
                items={imageGallery}
                showPlayButton={false}
                showFullscreenButton={false}
                slideOnThumbnailOver
                lazyLoad={true}
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
                <Tag color="blue">{currentProduct.brand}</Tag>

                <Title level={3} style={{ margin: 0 }}>
                  {currentProduct.name}
                </Title>

                <div>
                  <Rate disabled defaultValue={5} style={{ fontSize: 14 }} />

                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    Đã bán {currentProduct.sold ?? 0}
                  </Text>
                </div>
                <div style={{ width: "100%", marginTop: 8 }}>
                  <Text type="secondary">{currentProduct.description}</Text>
                </div>

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
                    />
                    <InputNumber
                      value={currentQuantity}
                      min={1}
                      max={currentProduct.quantity}
                      onChange={(value) => {
                        if (value !== null) {
                          handleChangeInput(value.toString());
                        }
                      }}
                      style={{ width: 60 }}
                    />

                    <Button
                      icon={<PlusOutlined />}
                      onClick={() => handleQuantityChange("PLUS")}
                    />
                  </Space>
                </div>

                <Divider style={{ margin: "12px 0" }} />

                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => handleAddToCart()}
                  >
                    Thêm vào giỏ hàng
                  </Button>
                  <Button
                    size="large"
                    danger
                    onClick={() => handleAddToCart(true)}
                  >
                    Mua ngay
                  </Button>
                </Space>
              </Space>
            </Col>
          </Row>
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
