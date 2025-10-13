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
  const [imageGallery, setImageGallery] = useState<any[]>([]);
  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentQuantity, setCurrentQuantity] = useState<number>(1);
  const [listProduct, setListProduct] = useState<IProduct[]>([]);
  const refGallery = useRef<ReactImageGallery>(null);
  const router = useRouter();
  const { setCarts } = useCurrentApp();
  const { message } = App.useApp();

  // Build image list for gallery
  useEffect(() => {
    if (!currentProduct) return;

    const images: any[] = [];

    const buildUrl = (url: string) => {
      if (!url) return "";
      return url.startsWith("http")
        ? url
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
    };

    if (currentProduct.thumbnail) {
      const thumb = buildUrl(currentProduct.thumbnail);
      images.push({
        original: thumb,
        thumbnail: thumb,
      });
    }

    if (Array.isArray(currentProduct.images)) {
      currentProduct.images.forEach((item) => {
        const url = buildUrl(item);
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
  const handleAddToCart = () => {
    //set local storage
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage && currentProduct) {
      // update carts
      const carts = JSON.parse(cartStorage) as ICart[];
      // check cart
      let isExistIndex = carts.findIndex((c) => c._id === currentProduct?._id);
      if (isExistIndex > -1) {
        carts[isExistIndex].quantity =
          carts[isExistIndex].quantity + currentQuantity;
      } else {
        carts.push({
          quantity: currentQuantity,
          _id: currentProduct._id,
          detail: currentProduct,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts));
      setCarts(carts);
      console.log(currentProduct);
      console.log(carts);
    }
    /// neu chua co cart
    else {
      const data = [
        {
          _id: currentProduct?._id!,
          quantity: currentQuantity,
          detail: currentProduct!,
        },
      ];
      localStorage.setItem("carts", JSON.stringify(data));
      setCarts(data);
    }
  };

  if (!currentProduct) return null;

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
                    onClick={() => router.push("/order")}
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
