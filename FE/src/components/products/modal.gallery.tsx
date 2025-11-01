"use client";

import { Col, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";

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

const ModalGallery = ({ isOpen, setIsOpen, currentIndex, items }: IProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(currentIndex || 0);
  const [isMobile, setIsMobile] = useState(false);
  const refGallery = useRef<ImageGallery>(null);

  // Detect viewport (SSR safe)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  // Sync index khi mở modal
  useEffect(() => {
    if (isOpen && items.length > 0) {
      setActiveIndex(currentIndex);
      setTimeout(() => refGallery.current?.slideToIndex(currentIndex), 80);
    }
  }, [isOpen, currentIndex, items]);

  // Modal size
  const modalWidth = isMobile ? "100vw" : "84vw";

  return (
    <Modal
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      centered
      className="modal-gallery"
      width={modalWidth}
      destroyOnHidden
      styles={{
        body: {
          padding: isMobile ? "8px 8px" : "12px 20px",
          overflow: "hidden",
        },
        content: {
          borderRadius: 16,
          maxHeight: "92vh",
        },
      }}
    >
      <Row gutter={[16, 16]} align="middle" justify="center">
        <Col xs={24} md={20}>
          {items?.length > 0 && (
            <div className="modal-gallery__stage">
              <ImageGallery
                ref={refGallery}
                items={items}
                showPlayButton={false}
                showFullscreenButton={false}
                showThumbnails={false}
                additionalClass="modal-gallery__gallery"
                startIndex={currentIndex}
                onSlide={(i) => setActiveIndex(i)}
                slideDuration={0}
              />
            </div>
          )}
        </Col>
      </Row>

      {/* Khung cố định theo tỉ lệ — tất cả ảnh cùng size */}
      <style jsx>{`
        .modal-gallery__stage {
          width: 100%;
        }
      `}</style>

      {/* Override react-image-gallery để ép kích thước đồng nhất, không theo tỉ lệ gốc */}
      <style jsx global>{`
        .modal-gallery .image-gallery-content,
        .modal-gallery__gallery.image-gallery,
        .modal-gallery__gallery .image-gallery-slide-wrapper {
          height: auto;
          width: 100%;
        }

        /* KHUNG CỐ ĐỊNH THEO TỈ LỆ (mọi slide giống nhau) */
        .modal-gallery__gallery .image-gallery-slide {
          /* Desktop: 16:9 */
          aspect-ratio: 16 / 9;
          width: 100%;
          background: #000;
          border-radius: 12px;
          overflow: hidden;

          /* Để nội dung bám khung */
          display: block;
        }

        /* Tablet: 4:3 */
        @media (max-width: 992px) {
          .modal-gallery__gallery .image-gallery-slide {
            aspect-ratio: 4 / 3;
          }
        }

        /* Mobile: 1:1 */
        @media (max-width: 576px) {
          .modal-gallery__gallery .image-gallery-slide {
            aspect-ratio: 1 / 1;
          }
        }

        /* ẢNH LẤP KÍN KHUNG, KHÔNG THEO TỈ LỆ GỐC (đồng nhất size, có thể crop) */
        .modal-gallery__gallery .image-gallery-image,
        .modal-gallery__gallery .image-gallery-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover; /* quan trọng: ép fill khung */
          display: block;
          background: #000;
        }

        /* Nút điều hướng */
        .modal-gallery__gallery .image-gallery-icon {
          line-height: 0;
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.6));
        }
        .modal-gallery__gallery .image-gallery-left-nav,
        .modal-gallery__gallery .image-gallery-right-nav {
          padding: 6px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.35);
        }
        @media (max-width: 768px) {
          .modal-gallery__gallery .image-gallery-left-nav,
          .modal-gallery__gallery .image-gallery-right-nav {
            transform: scale(1.1);
          }
        }

        /* Loại bỏ outline khi focus slide */
        .modal-gallery__gallery
          .image-gallery-content
          .image-gallery-slide:focus {
          outline: none;
        }
      `}</style>
    </Modal>
  );
};

export default ModalGallery;
