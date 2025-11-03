"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Descriptions,
  Image,
  UploadProps,
  GetProp,
  UploadFile,
  Upload,
  Divider,
} from "antd";
import { v4 as uuidv4 } from "uuid";

interface ViewProductModalProps {
  isViewModalOpen: boolean;
  productData: IProduct | null;
  setViewProduct: (product: IProduct | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

// helper build full url
const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
};

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isViewModalOpen,
  setViewProduct,
  setIsViewModalOpen,
  productData,
}) => {
  const safeText = (val: any) =>
    typeof val === "object" && val !== null ? val.name : val;

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (productData) {
      const imgs: UploadFile[] = [];

      if (productData.thumbnail) {
        imgs.push({
          uid: uuidv4(),
          name: "thumbnail",
          status: "done",
          url: getImageUrl(productData.thumbnail),
        });
      }

      if (productData.images?.length) {
        productData.images.forEach((item) => {
          imgs.push({
            uid: uuidv4(),
            name: item,
            status: "done",
            url: getImageUrl(item),
          });
        });
      }

      setFileList(imgs);
    }
  }, [productData]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <Modal
      open={isViewModalOpen}
      onCancel={() => {
        setIsViewModalOpen(false);
        setViewProduct(null);
      }}
      footer={null}
      width={700}
      title={<div style={{ textAlign: "center" }}>Chi tiết sản phẩm</div>}
    >
      {productData && (
        <Descriptions bordered column={1} size="small">
          {productData.thumbnail && (
            <Descriptions.Item label="Ảnh đại diện">
              <Image
                src={getImageUrl(productData.thumbnail)}
                alt="thumbnail"
                width={120}
              />
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Tên sản phẩm">
            {safeText(productData.name)}
          </Descriptions.Item>
          <Descriptions.Item label="Thương hiệu">
            {safeText(productData.brand)}
          </Descriptions.Item>
          <Descriptions.Item label="Danh mục">
            {safeText(productData.category)}
          </Descriptions.Item>
          <Descriptions.Item label="Giá">
            {productData.price.toLocaleString("vi-VN")} ₫
          </Descriptions.Item>
          <Descriptions.Item label="Tồn kho">
            {productData.stock}
          </Descriptions.Item>
          <Descriptions.Item label="Đã bán">
            {productData.sold}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo">
            {new Date(productData.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày cập nhật">
            {new Date(productData.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      )}

      <Divider>Xem trước hình ảnh</Divider>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Upload
          action="#"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
          showUploadList={{ showRemoveIcon: false }}
        />
      </div>

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
    </Modal>
  );
};

export default ViewProductModal;
