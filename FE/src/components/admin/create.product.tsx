"use client";

import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Modal,
  Select,
  InputNumber,
  Upload,
  Row,
  Col,
  App,
  Image,
  Divider,
} from "antd";
import type { GetProp, UploadFile, UploadProps } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";

const { Option } = Select;

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
type MyUploadFile = UploadFile & { path?: string };

/* ========== HELPER getImageUrl LOCAL ========== */
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://next-nest-ecommerce.onrender.com";

const buildAuthHeader = (token: string) =>
  token?.startsWith("Bearer ") ? token : `Bearer ${token}`;

const getImageUrl = (url?: string) => {
  if (!url) return "";

  // nếu đã là full URL
  if (url.startsWith("http")) return url;

  // nếu BE trả sẵn /images/...
  if (url.startsWith("/images/")) return `${BACKEND_URL}${url}`;

  // nếu path dạng /thumbnails/... hoặc /slider/...
  if (url.startsWith("/")) return `${BACKEND_URL}/images${url}`;

  // nếu chỉ là tên file, hoặc thumbnails/xxx.jpg
  return `${BACKEND_URL}/images/${url}`;
};
/* ============================================= */

const CreateProductModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Upload states
  const [thumbnailList, setThumbnailList] = useState<MyUploadFile[]>([]);
  const [sliderList, setSliderList] = useState<MyUploadFile[]>([]);

  // Category state
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  // Lấy danh sách danh mục khi mở modal
  useEffect(() => {
    if (isCreateModalOpen) {
      fetch(`${BACKEND_URL}/categories`, {
        headers: { Authorization: buildAuthHeader(access_token) },
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.data) setCategories(d.data);
        })
        .catch(() => {
          notification.error({
            message: "Không thể tải danh sách danh mục",
          });
        });
    }
  }, [isCreateModalOpen, access_token, notification]);

  // preview base64
  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const beforeUpload = (file: File) => {
    const isValid =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/webp";
    if (!isValid) {
      message.error("Chỉ được phép tải lên file JPG/PNG/WEBP!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Ảnh phải nhỏ hơn 5MB!");
    }
    return isValid && isLt5M;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Tải lên</div>
    </button>
  );

  const handleCloseCreateModal = () => {
    form.resetFields();
    setThumbnailList([]);
    setSliderList([]);
    setIsCreateModalOpen(false);
  };

  const onFinish = async (values: any) => {
    // Lấy file thumbnail
    const thumbnailFile = thumbnailList.find((f) => f.status === "done");
    const thumbnailPath =
      (thumbnailFile as MyUploadFile | undefined)?.path ||
      ((thumbnailFile as any)?.response?.file as string) ||
      "";

    // Lấy list path slider
    const sliderPaths: string[] = sliderList
      .filter((f) => f.status === "done")
      .map((f) => {
        const mf = f as MyUploadFile;
        if (mf.path) return mf.path;
        const files = (f as any)?.response?.files as string[] | undefined;
        return files?.[0];
      })
      .filter(Boolean) as string[];

    setLoading(true);
    try {
      if (!thumbnailPath) {
        notification.error({ message: "Chưa có ảnh thumbnail!" });
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        thumbnail: thumbnailPath, // ví dụ: /images/thumbnails/xxx.png
        images: sliderPaths, // ví dụ: ["/images/slider/1.png", ...]
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/products`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const d = await res.json();

      if (d.data) {
        await getData();
        notification.success({ message: "Tạo mới sản phẩm thành công." });
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(d.message),
        });
      }
    } catch (error) {
      notification.error({
        message: "Có lỗi xảy ra",
        description: "Không thể kết nối tới máy chủ.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        open={isCreateModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCloseCreateModal}
        maskClosable={false}
        confirmLoading={loading}
        okText="Tạo mới"
        cancelText="Hủy"
        centered
        width={720}
        forceRender
        destroyOnHidden
        rootClassName="gz-product-modal-root"
        okButtonProps={{ className: "gz-product-modal-ok-btn" }}
        cancelButtonProps={{ className: "gz-product-modal-cancel-btn" }}
        title={
          <div className="gz-product-modal-title-wrap">
            <div className="gz-product-modal-title-content">
              <span className="gz-product-modal-eyebrow">
                Product Management
              </span>
              <h3>Thêm sản phẩm mới</h3>
              <p>Tạo sản phẩm, hình ảnh, danh mục và tồn kho</p>
            </div>
          </div>
        }
      >
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          preserve={false}
          className="gz-product-modal-form"
        >
          <Divider>Ảnh đại diện</Divider>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Upload
              name="thumbnail"
              listType="picture-circle"
              beforeUpload={beforeUpload}
              action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/upload`}
              headers={{
                Authorization: `Bearer ${access_token}`,
              }}
              fileList={thumbnailList}
              onChange={({ file, fileList }) => {
                if (file.status === "done") {
                  const path = (file.response as any)?.file as
                    | string
                    | undefined;
                  if (path) {
                    (file as MyUploadFile).path = path; // lưu path để gửi lên BE
                    file.url = getImageUrl(path); // hiển thị preview
                  }
                }
                setThumbnailList(fileList as MyUploadFile[]);
              }}
              onPreview={handlePreview}
            >
              {thumbnailList.length >= 1 ? null : uploadButton}
            </Upload>
          </div>

          <Divider />

          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thương hiệu"
            name="brand"
            rules={[{ required: true, message: "Vui lòng nhập thương hiệu!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="category"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map((cat) => (
                <Option key={cat._id} value={cat._id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={[16, 8]}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Giá"
                name="price"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫"
                  }
                  parser={(value) =>
                    (value ? value.replace(/[₫.\s]/g, "") : "") as any
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                label="Tồn kho"
                name="stock"
                rules={[
                  { required: true, message: "Vui lòng nhập số lượng tồn!" },
                ]}
              >
                <InputNumber style={{ width: "100%" }} min={0} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Đã bán" name="sold">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
        </Form>

        <Divider>Hình ảnh chi tiết</Divider>

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

        <Upload
          name="slider"
          listType="picture-card"
          multiple
          beforeUpload={beforeUpload}
          action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/products/upload-slider`}
          headers={{
            Authorization: `Bearer ${access_token}`,
          }}
          fileList={sliderList}
          onChange={({ file, fileList }) => {
            if (file.status === "done") {
              const urls = (file.response as any)?.files as
                | string[]
                | undefined;
              if (Array.isArray(urls) && urls.length > 0) {
                const path = urls[0]; // mỗi file Upload tương ứng 1 path
                (file as MyUploadFile).path = path;
                file.url = getImageUrl(path);
              }
            }
            setSliderList(fileList as MyUploadFile[]);
          }}
          onPreview={handlePreview}
        >
          {uploadButton}
        </Upload>

        <Divider />
      </Modal>
      <style jsx global>{`
        .gz-product-modal-root .ant-modal {
          max-width: calc(100vw - 24px) !important;
        }

        .gz-product-modal-root .ant-modal-content {
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

        .gz-product-modal-root .ant-modal-header {
          padding: 20px 24px 16px !important;
          margin: 0 !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-product-modal-root .ant-modal-body {
          padding: 18px 24px 10px !important;
          max-height: 72vh;
          overflow-y: auto;
        }

        .gz-product-modal-root .ant-modal-footer {
          padding: 14px 24px 18px !important;
          margin: 0 !important;
          border-top: 1px solid #2a2d2e !important;
        }

        .gz-product-modal-root .ant-modal-close {
          color: #e5e7eb !important;
        }

        .gz-product-modal-root .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-product-modal-root .ant-modal-title {
          width: 100%;
        }

        .gz-product-modal-title-wrap {
          width: 100%;
          padding: 0 34px;
          text-align: center;
        }

        .gz-product-modal-eyebrow {
          display: block;
          margin: 0 0 6px;
          color: #00ffe0;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 0.9px;
          text-transform: uppercase;
          text-align: center;
        }

        .gz-product-modal-title-wrap h3 {
          margin: 0;
          color: #ffffff;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
        }

        .gz-product-modal-title-wrap p {
          margin: 7px auto 0;
          max-width: 420px;
          color: #a3aab5;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.4;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-product-modal-form .ant-form-item {
          margin-bottom: 14px !important;
        }

        .gz-product-modal-form .ant-form-item:last-child {
          margin-bottom: 0 !important;
        }

        .gz-product-modal-form .ant-form-item-label {
          padding-bottom: 6px !important;
        }

        .gz-product-modal-form .ant-form-item-label > label {
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 800 !important;
        }

        .gz-product-modal-form .ant-form-item-required::before {
          color: #ff4d4f !important;
        }

        .gz-product-modal-form .ant-form-item-explain-error {
          color: #ff7875 !important;
          font-size: 12px !important;
          margin-top: 4px !important;
        }

        .gz-product-modal-root .ant-divider {
          margin: 16px 0 !important;
          color: #00ffe0 !important;
          border-color: #303435 !important;
        }

        .gz-product-modal-root .ant-divider::before,
        .gz-product-modal-root .ant-divider::after {
          border-color: #303435 !important;
        }

        .gz-product-modal-root .ant-divider-inner-text {
          color: #00ffe0 !important;
          font-size: 16px !important;
          font-weight: 900 !important;
        }

        .gz-product-modal-root .ant-input,
        .gz-product-modal-root textarea.ant-input,
        .gz-product-modal-root .ant-input-number,
        .gz-product-modal-root .ant-select-selector {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.025)
            ),
            #242829 !important;
          border: 1px solid #3a4042 !important;
          color: #f3f4f6 !important;
          border-radius: 12px !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
        }

        .gz-product-modal-root .ant-input:hover,
        .gz-product-modal-root .ant-input:focus,
        .gz-product-modal-root textarea.ant-input:hover,
        .gz-product-modal-root textarea.ant-input:focus,
        .gz-product-modal-root .ant-input-number:hover,
        .gz-product-modal-root .ant-input-number-focused,
        .gz-product-modal-root .ant-select:hover .ant-select-selector,
        .gz-product-modal-root .ant-select-focused .ant-select-selector {
          background: #2a2f31 !important;
          border-color: rgba(0, 255, 224, 0.65) !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.09),
            inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
        }

        .gz-product-modal-root .ant-input::placeholder,
        .gz-product-modal-root textarea.ant-input::placeholder,
        .gz-product-modal-root .ant-select-selection-placeholder,
        .gz-product-modal-root .ant-input-number-input::placeholder {
          color: #9ca3af !important;
          opacity: 1 !important;
          font-weight: 500 !important;
        }

        .gz-product-modal-root .ant-input-number-input,
        .gz-product-modal-root .ant-select-selection-item {
          color: #f9fafb !important;
        }

        .gz-product-modal-root .ant-select-arrow,
        .gz-product-modal-root .ant-input-number-handler-up-inner,
        .gz-product-modal-root .ant-input-number-handler-down-inner {
          color: #9ca3af !important;
        }

        .gz-product-modal-root .ant-input-number-handler-wrap {
          background: #2a2f31 !important;
          border-start-end-radius: 12px !important;
          border-end-end-radius: 12px !important;
        }

        .gz-product-modal-root .ant-input-number-handler {
          border-color: #3a4042 !important;
        }

        .gz-product-modal-root .ant-select-dropdown {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 12px !important;
        }

        .gz-product-modal-root .ant-upload-wrapper {
          color: #e5e7eb !important;
        }

        .gz-product-modal-root .ant-upload {
          background: #242829 !important;
          border-color: #3a4042 !important;
          color: #e5e7eb !important;
        }

        .gz-product-modal-root .ant-upload:hover {
          border-color: rgba(0, 255, 224, 0.65) !important;
        }

        .gz-product-modal-root .ant-upload button {
          color: #e5e7eb !important;
        }

        .gz-product-modal-root .ant-upload-list-item {
          border-color: #3a4042 !important;
          background: #242829 !important;
        }

        .gz-product-modal-root .ant-upload-list-item:hover {
          background: #2a2f31 !important;
        }

        .gz-product-modal-root .ant-upload-list-item-actions .anticon {
          color: #ffffff !important;
        }

        .gz-product-modal-ok-btn {
          height: 40px !important;
          border: none !important;
          border-radius: 12px !important;
          color: #ffffff !important;
          font-weight: 900 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.24) !important;
        }

        .gz-product-modal-ok-btn:hover {
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
          color: #ffffff !important;
        }

        .gz-product-modal-cancel-btn {
          height: 40px !important;
          border-radius: 12px !important;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
          font-weight: 800 !important;
        }

        .gz-product-modal-cancel-btn:hover {
          border-color: #00ffe0 !important;
          color: #00ffe0 !important;
        }

        @media (max-width: 768px) {
          .gz-product-modal-root .ant-modal {
            top: 12px !important;
            max-width: calc(100vw - 20px) !important;
          }

          .gz-product-modal-root .ant-modal-header {
            padding: 18px 16px 14px !important;
          }

          .gz-product-modal-root .ant-modal-body {
            padding: 14px 16px 8px !important;
            max-height: 72vh;
          }

          .gz-product-modal-root .ant-modal-footer {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            padding: 12px 16px 16px !important;
          }

          .gz-product-modal-root .ant-modal-footer .ant-btn {
            width: 100%;
            margin-inline-start: 0 !important;
          }

          .gz-product-modal-title-wrap {
            padding: 0 30px;
          }

          .gz-product-modal-title-wrap h3 {
            font-size: 20px;
          }

          .gz-product-modal-title-wrap p {
            max-width: 260px;
            font-size: 12px;
          }

          .gz-product-modal-root .ant-divider-inner-text {
            font-size: 15px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-product-modal-title-wrap {
            padding: 0 26px;
          }

          .gz-product-modal-eyebrow {
            font-size: 10px;
          }

          .gz-product-modal-title-wrap h3 {
            font-size: 18px;
          }

          .gz-product-modal-title-wrap p {
            max-width: 210px;
            font-size: 12px;
          }

          .gz-product-modal-root .ant-modal-footer {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  );
};

export default CreateProductModal;
