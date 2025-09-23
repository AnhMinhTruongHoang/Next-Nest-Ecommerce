"use client";

import React, { useState } from "react";
import {
  Modal,
  Descriptions,
  Image,
  Carousel,
  UploadProps,
  GetProp,
  UploadFile,
  Upload,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IProduct } from "next-auth";

interface ViewProductModalProps {
  isOpen: boolean;
  productData: IProduct | null;
  setViewProduct: (product: IProduct | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isOpen,
  setViewProduct,
  setIsViewModalOpen,
  productData,
}) => {
  const safeText = (val: any) =>
    typeof val === "object" && val !== null ? val.name : val;

  /// image slide

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: "-1",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-2",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-3",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
    {
      uid: "-4",
      name: "image.png",
      status: "done",
      url: "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
    },
  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  ///

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
          <Descriptions.Item label="Updated At">
            {new Date(productData.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      )}
      <hr />
      <>
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        ></Upload>
        {previewImage && (
          <Image
            wrapperStyle={{ display: "none" }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </>
    </Modal>
  );
};

export default ViewProductModal;
