"use client";

import React from "react";
import { Modal, Descriptions, Image, Carousel } from "antd";
import { IProduct } from "next-auth";

interface ViewProductModalProps {
  isOpen: boolean;
  productData: IProduct | null;
  setViewProduct: (product: IProduct | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  setViewProduct,
  setIsViewModalOpen,
  productData,
}) => {
  const safeText = (val: any) =>
    typeof val === "object" && val !== null ? val.name : val;

  return (
    <Modal
      open={isOpen}
      onCancel={() => {
        setIsViewModalOpen(false);
        setViewProduct(null);
      }}
      footer={null}
      width={700}
      title={
        <div
          style={{ textAlign: "center", width: "100%", marginBottom: "15px" }}
        >
          Product Details
        </div>
      }
    >
      {productData && (
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Thumbnail">
            <Image
              src={productData.thumbnail}
              alt={safeText(productData.name)}
              width={100}
            />
          </Descriptions.Item>

          {productData.slider?.length > 0 && (
            <Descriptions.Item label="Slider Images">
              <Carousel autoplay>
                {productData.slider.map((img, idx) => (
                  <div key={idx} style={{ textAlign: "center" }}>
                    <Image src={img} alt={`slider-${idx}`} width={200} />
                  </div>
                ))}
              </Carousel>
            </Descriptions.Item>
          )}

          <Descriptions.Item label="Name">
            {safeText(productData.name)}
          </Descriptions.Item>
          <Descriptions.Item label="Brand">
            {safeText(productData.brand)}
          </Descriptions.Item>
          <Descriptions.Item label="Category">
            {safeText(productData.category)}
          </Descriptions.Item>
          <Descriptions.Item label="Price">
            ${productData.price}
          </Descriptions.Item>
          <Descriptions.Item label="Stock">
            {productData.stock}
          </Descriptions.Item>
          <Descriptions.Item label="Sold">{productData.sold}</Descriptions.Item>
          <Descriptions.Item label="Created At">
            {new Date(productData.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Updated At">
            {new Date(productData.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Modal>
  );
};

export default ViewProductModal;
