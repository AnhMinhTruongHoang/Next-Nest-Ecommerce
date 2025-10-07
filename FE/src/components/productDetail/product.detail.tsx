"use client";

import { Row, Col, Rate, Divider, App, Breadcrumb } from "antd";
import ImageGallery from "react-image-gallery";
import { useEffect, useRef, useState } from "react";
import { CarTwoTone, MinusOutlined, PlusOutlined } from "@ant-design/icons";
import "../../styles/product.scss";
import ModalGallery from "@/components/products/modal.gallery";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCurrentApp } from "@/components/context/app.context";

interface IProps {
  currentProduct: IProduct | null;
}

type UserAction = "MINUS" | "PLUS";

const ProductDetail = ({ currentProduct }: IProps) => {
  const [imageGallery, setImageGallery] = useState<
    {
      original: string;
      thumbnail: string;
      originalClass?: string;
      thumbnailClass?: string;
    }[]
  >([]);

  const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuantity, setCurrentQuantity] = useState(1);

  const refGallery = useRef<ImageGallery>(null);
  const router = useRouter();
  const { setCarts, user } = useCurrentApp();
  const { message } = App.useApp();

  useEffect(() => {
    if (currentProduct) {
      const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const images: {
        original: string;
        thumbnail: string;
        originalClass?: string;
        thumbnailClass?: string;
      }[] = [];

      // Thumbnail chính
      if (currentProduct.thumbnail) {
        images.push({
          original: `${baseURL}/images/thumbnails/${currentProduct.thumbnail}`,
          thumbnail: `${baseURL}/images/thumbnails/${currentProduct.thumbnail}`,
          originalClass: "original-image",
          thumbnailClass: "thumbnail-image",
        });
      }

      // Danh sách slider (nếu có)
      if (currentProduct.slider?.length) {
        currentProduct.slider.forEach((img: string) => {
          images.push({
            original: `${baseURL}/images/slider/${img}`,
            thumbnail: `${baseURL}/images/slider/${img}`,
            originalClass: "original-image",
            thumbnailClass: "thumbnail-image",
          });
        });
      }

      setImageGallery(images);
    }
  }, [currentProduct]);

  const handleOnClickImage = () => {
    setIsOpenModalGallery(true);
    setCurrentIndex(refGallery.current?.getCurrentIndex() ?? 0);
  };

  const handleChangeButton = (type: UserAction) => {
    if (type === "MINUS" && currentQuantity > 1)
      setCurrentQuantity(currentQuantity - 1);
    if (
      type === "PLUS" &&
      currentProduct &&
      currentQuantity < +currentProduct.quantity
    )
      setCurrentQuantity(currentQuantity + 1);
  };

  const handleChangeInput = (value: string) => {
    const num = +value;
    if (!isNaN(num) && num > 0 && num <= (currentProduct?.quantity ?? 1))
      setCurrentQuantity(num);
  };

  const handleAddToCart = (isBuyNow = false) => {
    if (!user) {
      message.error("Bạn cần đăng nhập để thực hiện tính năng này.");
      return;
    }

    const cartStorage = localStorage.getItem("carts");
    let carts: ICart[] = cartStorage ? JSON.parse(cartStorage) : [];

    if (currentProduct) {
      const index = carts.findIndex((c) => c._id === currentProduct._id);
      if (index > -1) {
        carts[index].quantity += currentQuantity;
      } else {
        carts.push({
          _id: currentProduct._id,
          quantity: currentQuantity,
          detail: currentProduct,
        });
      }
      localStorage.setItem("carts", JSON.stringify(carts));
      setCarts(carts);
    }

    if (isBuyNow) router.push("/order");
    else message.success("Thêm sản phẩm vào giỏ hàng thành công.");
  };

  return (
    <div style={{ background: "#efefef", padding: "20px 0" }}>
      <div
        className="view-detail-product"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          minHeight: "calc(100vh - 150px)",
        }}
      >
        <Breadcrumb
          separator=">"
          items={[
            { title: <Link href="/">Trang Chủ</Link> },
            { title: "Xem chi tiết sản phẩm" },
          ]}
        />

        <div style={{ padding: 20, background: "#fff", borderRadius: 5 }}>
          <Row gutter={[20, 20]}>
            <Col md={10} sm={0} xs={0}>
              <ImageGallery
                ref={refGallery}
                items={imageGallery}
                showPlayButton={false}
                showFullscreenButton={false}
                renderLeftNav={() => <></>}
                renderRightNav={() => <></>}
                slideOnThumbnailOver
                onClick={handleOnClickImage}
              />
            </Col>

            <Col md={14} sm={24}>
              <Col span={24}>
                <div className="author">
                  Thương hiệu: <a href="#">{currentProduct?.brand}</a>
                </div>
                <div className="title">{currentProduct?.name}</div>

                <div className="rating">
                  <Rate
                    value={5}
                    disabled
                    style={{ color: "#ffce3d", fontSize: 12 }}
                  />
                  <span className="sold">
                    <Divider type="vertical" /> Đã bán{" "}
                    {currentProduct?.sold ?? 0}
                  </span>
                </div>

                <div className="price">
                  <span className="currency">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(currentProduct?.price ?? 0)}
                  </span>
                </div>

                <div className="delivery">
                  <div>
                    <span className="left">Vận chuyển</span>
                    <span className="right">Miễn phí vận chuyển</span>
                  </div>
                </div>

                <div className="quantity">
                  <span className="left">Số lượng</span>
                  <span className="right">
                    <button
                      title="minus"
                      onClick={() => handleChangeButton("MINUS")}
                    >
                      <MinusOutlined />
                    </button>
                    <input
                      placeholder="Quantity"
                      value={currentQuantity}
                      onChange={(e) => handleChangeInput(e.target.value)}
                    />
                    <button
                      title="plus"
                      onClick={() => handleChangeButton("PLUS")}
                    >
                      <PlusOutlined />
                    </button>
                  </span>
                </div>

                <div className="buy">
                  <button className="cart" onClick={() => handleAddToCart()}>
                    <CarTwoTone className="icon-cart" />
                    <span>Thêm vào giỏ hàng</span>
                  </button>
                  <button onClick={() => handleAddToCart(true)} className="now">
                    Mua ngay
                  </button>
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </div>

      <ModalGallery
        isOpen={isOpenModalGallery}
        setIsOpen={setIsOpenModalGallery}
        currentIndex={currentIndex}
        items={imageGallery}
        title={currentProduct?.name ?? ""}
      />
    </div>
  );
};

export default ProductDetail;
