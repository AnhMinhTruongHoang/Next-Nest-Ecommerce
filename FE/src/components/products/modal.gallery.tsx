"use client";

import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "../../styles/product.scss";

interface IProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentIndex: number;
  title: string;
  items: {
    original: string;
    thumbnail: string;
    originalClass?: string;
    thumbnailClass?: string;
  }[];
}

const ModalGallery = ({
  isOpen,
  setIsOpen,
  currentIndex,
  items,
  title,
}: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(currentIndex || 0);
  const refGallery = useRef<ImageGallery>(null);

  // 👉 Khi modal mở, nhảy đến đúng hình đang xem ở trang chi tiết
  useEffect(() => {
    if (isOpen && items.length > 0) {
      setActiveIndex(currentIndex);
      setTimeout(() => {
        refGallery.current?.slideToIndex(currentIndex);
      }, 150);
    }
  }, [isOpen, currentIndex, items]);

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      className="modal-gallery"
      // 👉 Tùy chỉnh độ rộng modal theo kích thước màn hình
      width={
        typeof window !== "undefined" && window.innerWidth < 768
          ? "95vw" // Mobile
          : "70vw" // Desktop
      }
      destroyOnHidden
      // 👉 styles: thay thế cho bodyStyle/contentStyle (Ant Design v5+)
      styles={{
        body: {
          // 👉 Điều chỉnh chiều cao hiển thị modal
          // Ví dụ: tăng lên "80vh" nếu muốn modal cao hơn
          height: window.innerWidth < 768 ? "75vh" : "65vh",
          overflow: "hidden",
          padding: "10px 20px",
        },
        content: {
          borderRadius: 16, // 👉 Bo góc modal
          maxHeight: "90vh", // 👉 Giới hạn max chiều cao modal
        },
      }}
    >
      <Row gutter={[20, 20]} align="middle" justify="center">
        {/* 🖼 Khu vực hiển thị ảnh chính */}
        <Col xs={24} md={16}>
          {items?.length > 0 && (
            <div className="modal-gallery__main">
              <ImageGallery
                ref={refGallery}
                items={items}
                showPlayButton={false} // 👉 Ẩn nút play slideshow
                showFullscreenButton={false} // 👉 Ẩn nút fullscreen
                showThumbnails={false} // 👉 Ẩn dải ảnh nhỏ bên dưới
                startIndex={currentIndex}
                onSlide={(i) => setActiveIndex(i)} // 👉 Lưu chỉ số ảnh hiện tại
                slideDuration={0} // 👉 Không hiệu ứng trượt
              />
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalGallery;
