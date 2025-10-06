"use client";

import { Col, Image, Modal, Row } from "antd";
import { useEffect, useRef, useState } from "react";
import ImageGallery from "react-image-gallery";
import "../../styles/product.scss";

interface IProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  currentIndex: number;
  items: {
    original: string;
    thumbnail: string;
    originalClass: string;
    thumbnailClass: string;
  }[];
  title: string;
}

const ModalGallery = ({
  isOpen,
  setIsOpen,
  currentIndex,
  items,
  title,
}: IProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const refGallery = useRef<ImageGallery>(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex);
      // Khi modal mở, nhảy tới ảnh hiện tại
      setTimeout(() => {
        refGallery.current?.slideToIndex(currentIndex);
      }, 100);
    } else {
      setActiveIndex(0); // reset khi đóng modal
    }
  }, [isOpen, currentIndex]);

  return (
    <Modal
      width={
        typeof window !== "undefined" && window.innerWidth < 768
          ? "90vw"
          : "60vw"
      }
      open={isOpen}
      onCancel={() => setIsOpen(false)}
      footer={null}
      closable={false}
      className="modal-gallery"
      centered
    >
      <Row gutter={[20, 20]}>
        <Col xs={24} md={16}>
          {items?.length > 0 && (
            <ImageGallery
              ref={refGallery}
              items={items}
              showPlayButton={false}
              showFullscreenButton={false}
              showThumbnails={false}
              startIndex={currentIndex}
              onSlide={(i) => setActiveIndex(i)}
              slideDuration={0}
            />
          )}
        </Col>

        <Col xs={24} md={8}>
          <div style={{ padding: "5px 0 20px 0", fontWeight: 500 }}>
            {title}
          </div>
          <Row gutter={[10, 10]}>
            {items?.map((item, i) => (
              <Col key={`image-${i}`}>
                <div
                  className={`thumb-item ${activeIndex === i ? "active" : ""}`}
                  style={{
                    border:
                      activeIndex === i
                        ? "2px solid #1890ff"
                        : "2px solid transparent",
                    borderRadius: 8,
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <Image
                    width={90}
                    height={90}
                    src={item.original}
                    preview={false}
                    onClick={() => refGallery.current?.slideToIndex(i)}
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Modal>
  );
};

export default ModalGallery;
