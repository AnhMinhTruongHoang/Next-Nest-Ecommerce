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
import { getImageUrl } from "@/utils/getImageUrl";

interface ViewProductModalProps {
  isViewModalOpen: boolean;
  productData: IProduct | null;
  setViewProduct: (product: IProduct | null) => void;
  setIsViewModalOpen: (open: boolean) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const ViewProductModal: React.FC<ViewProductModalProps> = ({
  isViewModalOpen,
  setViewProduct,
  setIsViewModalOpen,
  productData,
}) => {
  const safeText = (val: any) =>
    typeof val === "object" && val !== null ? val.name : val;

  const formatCurrency = (value?: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const formatDate = (value?: string | Date) =>
    value ? new Date(value).toLocaleString("vi-VN") : "-";

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
    if (!productData) {
      setFileList([]);
      return;
    }

    const imgs: UploadFile[] = [];

    if (productData.thumbnail) {
      imgs.push({
        uid: uuidv4(),
        name: "thumbnail",
        status: "done",
        url: getImageUrl(productData.thumbnail),
      });
    }

    if (Array.isArray(productData.images) && productData.images.length) {
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
  }, [productData]);

  const handleClose = () => {
    setIsViewModalOpen(false);
    setViewProduct(null);
    setPreviewOpen(false);
    setPreviewImage("");
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview && file.originFileObj) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) =>
    setFileList(newFileList);

  return (
    <>
      <Modal
        open={isViewModalOpen}
        onCancel={handleClose}
        footer={null}
        width={760}
        centered
        destroyOnHidden
        rootClassName="gz-view-product-modal-root"
        title={
          <div className="gz-view-product-title-wrap">
            <span className="gz-view-product-eyebrow">Product Management</span>
            <h3>Chi tiết sản phẩm</h3>
            <p>{productData?.name || "Thông tin chi tiết sản phẩm"}</p>
          </div>
        }
      >
        {productData && (
          <div className="gz-view-product-content">
            {productData.thumbnail && (
              <div className="gz-view-product-hero">
                <Image
                  src={getImageUrl(productData.thumbnail)}
                  alt="thumbnail"
                  className="gz-view-product-main-img"
                  preview
                />

                <div className="gz-view-product-hero-info">
                  <span>Sản phẩm</span>
                  <strong>{safeText(productData.name)}</strong>
                  <p>{safeText(productData.brand) || "Chưa có thương hiệu"}</p>
                </div>
              </div>
            )}

            <Descriptions
              bordered
              column={1}
              size="small"
              className="gz-view-product-descriptions"
            >
              <Descriptions.Item label="Tên sản phẩm">
                {safeText(productData.name)}
              </Descriptions.Item>

              <Descriptions.Item label="Thương hiệu">
                {safeText(productData.brand) || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Danh mục">
                {safeText(productData.category) || "-"}
              </Descriptions.Item>

              <Descriptions.Item label="Giá">
                <span className="gz-view-product-price">
                  {formatCurrency(productData.price)}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Tồn kho">
                <span className="gz-view-product-stock">
                  {productData.stock ?? 0}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Đã bán">
                <span className="gz-view-product-sold">
                  {productData.sold ?? 0}
                </span>
              </Descriptions.Item>

              <Descriptions.Item label="Ngày tạo">
                {formatDate(productData.createdAt)}
              </Descriptions.Item>

              <Descriptions.Item label="Ngày cập nhật">
                {formatDate(productData.updatedAt)}
              </Descriptions.Item>
            </Descriptions>

            <Divider className="gz-view-product-divider">
              Xem trước hình ảnh
            </Divider>

            <div className="gz-view-product-upload-wrap">
              <Upload
                action="#"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                showUploadList={{ showRemoveIcon: false }}
                className="gz-view-product-upload"
              />
            </div>
          </div>
        )}

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

      <style jsx global>{`
        .gz-view-product-modal-root .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }

        .gz-view-product-modal-root .ant-modal-content {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid rgba(0, 255, 224, 0.12) !important;
          border-radius: 20px !important;
          box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55) !important;
          overflow: hidden;
        }

        .gz-view-product-modal-root .ant-modal-header {
          padding: 20px 24px 16px !important;
          margin: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-view-product-modal-root .ant-modal-title {
          width: 100%;
        }

        .gz-view-product-modal-root .ant-modal-body {
          padding: 18px 24px 22px !important;
          max-height: 72vh;
          overflow-y: auto;
        }

        .gz-view-product-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-view-product-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-view-product-title-wrap {
          width: 100%;
          padding: 0 34px;
          text-align: center;
        }

        .gz-view-product-eyebrow {
          display: block;
          margin: 0 0 6px;
          color: #00ffe0 !important;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          text-align: center;
        }

        .gz-view-product-title-wrap h3 {
          margin: 0;
          color: #ffffff !important;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
        }

        .gz-view-product-title-wrap p {
          margin: 7px auto 0;
          max-width: 420px;
          color: #a3aab5 !important;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-view-product-content {
          display: grid;
          gap: 16px;
        }

        .gz-view-product-hero {
          display: grid;
          grid-template-columns: 130px minmax(0, 1fr);
          gap: 16px;
          align-items: center;
          padding: 14px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
        }

        .gz-view-product-main-img {
          width: 120px !important;
          height: 120px !important;
          object-fit: cover !important;
          border-radius: 14px !important;
          background: #242829 !important;
          border: 1px solid #303435 !important;
        }

        .gz-view-product-hero-info {
          min-width: 0;
        }

        .gz-view-product-hero-info span {
          display: block;
          margin-bottom: 6px;
          color: #00ffe0;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .gz-view-product-hero-info strong {
          display: block;
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.3;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-view-product-hero-info p {
          margin: 7px 0 0;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 700;
        }

        .gz-view-product-descriptions {
          overflow: hidden;
          border-radius: 16px !important;
          border: 1px solid #2a2d2e !important;
          background: #111314 !important;
        }

        .gz-view-product-descriptions .ant-descriptions-view {
          border-color: #2a2d2e !important;
          border-radius: 16px !important;
        }

        .gz-view-product-descriptions .ant-descriptions-row {
          border-color: #2a2d2e !important;
        }

        .gz-view-product-descriptions .ant-descriptions-item-label {
          width: 180px;
          background: #151819 !important;
          border-color: #2a2d2e !important;
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 900 !important;
        }

        .gz-view-product-descriptions .ant-descriptions-item-content {
          background: #111314 !important;
          border-color: #2a2d2e !important;
          color: #f9fafb !important;
          font-size: 13px !important;
          font-weight: 700 !important;
          word-break: break-word;
        }

        .gz-view-product-price {
          color: #ffb020 !important;
          font-weight: 900 !important;
        }

        .gz-view-product-stock {
          color: #00ffe0 !important;
          font-weight: 900 !important;
        }

        .gz-view-product-sold {
          color: #00c781 !important;
          font-weight: 900 !important;
        }

        .gz-view-product-divider {
          margin: 4px 0 0 !important;
          border-color: #303435 !important;
          color: #00ffe0 !important;
        }

        .gz-view-product-divider .ant-divider-inner-text {
          color: #00ffe0 !important;
          font-size: 15px !important;
          font-weight: 900 !important;
        }

        .gz-view-product-upload-wrap {
          display: flex;
          justify-content: center;
          padding: 14px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          overflow-x: auto;
        }

        .gz-view-product-upload .ant-upload-list {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
        }

        .gz-view-product-upload .ant-upload-list-picture-card-container,
        .gz-view-product-upload .ant-upload-list-item-container {
          width: 92px !important;
          height: 92px !important;
        }

        .gz-view-product-upload .ant-upload-list-item {
          background: #242829 !important;
          border: 1px solid #303435 !important;
          border-radius: 14px !important;
          overflow: hidden;
        }

        .gz-view-product-upload .ant-upload-list-item:hover {
          border-color: rgba(0, 255, 224, 0.65) !important;
        }

        .gz-view-product-upload .ant-upload-list-item-thumbnail img {
          object-fit: cover !important;
        }

        .gz-view-product-upload .ant-upload-list-item-actions .anticon {
          color: #ffffff !important;
        }

        .gz-view-product-modal-root .ant-image-mask {
          border-radius: 14px !important;
        }

        @media (max-width: 768px) {
          .gz-view-product-modal-root .ant-modal {
            top: 12px !important;
            max-width: calc(100vw - 20px) !important;
          }

          .gz-view-product-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-view-product-modal-root .ant-modal-body {
            padding: 14px 16px 16px !important;
            max-height: 72vh;
          }

          .gz-view-product-title-wrap {
            padding: 0 30px;
          }

          .gz-view-product-title-wrap h3 {
            font-size: 20px;
          }

          .gz-view-product-title-wrap p {
            max-width: 260px;
            font-size: 12px;
          }

          .gz-view-product-hero {
            grid-template-columns: 1fr;
            justify-items: center;
            text-align: center;
            gap: 12px;
            padding: 14px 12px;
          }

          .gz-view-product-main-img {
            width: 112px !important;
            height: 112px !important;
          }

          .gz-view-product-hero-info {
            width: 100%;
          }

          .gz-view-product-hero-info strong {
            font-size: 18px;
            white-space: normal;
          }

          .gz-view-product-descriptions .ant-descriptions-item-label {
            width: 130px;
            font-size: 12px !important;
          }

          .gz-view-product-descriptions .ant-descriptions-item-content {
            font-size: 12px !important;
          }

          .gz-view-product-upload-wrap {
            padding: 12px;
          }

          .gz-view-product-upload .ant-upload-list-picture-card-container,
          .gz-view-product-upload .ant-upload-list-item-container {
            width: 82px !important;
            height: 82px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-view-product-title-wrap {
            padding: 0 26px;
          }

          .gz-view-product-title-wrap h3 {
            font-size: 18px;
          }

          .gz-view-product-title-wrap p {
            max-width: 210px;
          }

          .gz-view-product-modal-root .ant-modal-body {
            padding: 12px !important;
          }

          .gz-view-product-content {
            gap: 12px;
          }

          .gz-view-product-hero {
            border-radius: 15px;
          }

          .gz-view-product-main-img {
            width: 104px !important;
            height: 104px !important;
          }

          .gz-view-product-descriptions {
            border-radius: 15px !important;
          }

          .gz-view-product-descriptions .ant-descriptions-item-label,
          .gz-view-product-descriptions .ant-descriptions-item-content {
            display: block !important;
            width: 100% !important;
            border-inline-end: none !important;
          }

          .gz-view-product-descriptions .ant-descriptions-item-label {
            padding: 9px 12px 4px !important;
            background: #151819 !important;
          }

          .gz-view-product-descriptions .ant-descriptions-item-content {
            padding: 4px 12px 10px !important;
          }

          .gz-view-product-upload-wrap {
            justify-content: flex-start;
            border-radius: 15px;
          }

          .gz-view-product-upload .ant-upload-list {
            justify-content: flex-start;
            flex-wrap: nowrap;
          }

          .gz-view-product-upload .ant-upload-list-picture-card-container,
          .gz-view-product-upload .ant-upload-list-item-container {
            width: 78px !important;
            height: 78px !important;
            flex-shrink: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ViewProductModal;
