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

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (v: boolean) => void;
}
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const CreateProductModal = (props: IProps) => {
  const { access_token, getData, isCreateModalOpen, setIsCreateModalOpen } =
    props;
  const { message, notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Upload states
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [sliderList, setSliderList] = useState<UploadFile[]>([]);

  // Category state
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  // Lấy danh sách danh mục khi mở modal
  useEffect(() => {
    if (isCreateModalOpen) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`, {
        headers: { Authorization: `Bearer ${access_token}` },
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
  }, [isCreateModalOpen]);

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
    // Thumbnail
    const thumbnailFile = thumbnailList.find((f) => f.status === "done");
    const thumbnailUrl =
      thumbnailFile?.response?.data?.file || thumbnailFile?.url || "";

    // Slider
    const sliderUrls = sliderList
      .filter((f) => f.status === "done")
      .flatMap((f) => {
        if (Array.isArray(f.response?.data?.files)) {
          return f.response.data.files;
        }
        if (typeof f.url === "string") {
          return [f.url];
        }
        return [];
      })
      .filter((url) => !!url);

    setLoading(true);
    try {
      if (!thumbnailUrl || sliderUrls.length === 0) {
        notification.error({ message: "Upload ảnh chưa hoàn tất!" });
        setLoading(false);
        return;
      }

      const payload = {
        ...values,
        thumbnail: thumbnailUrl,
        images: sliderUrls,
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
    <Modal
      title={<div style={{ textAlign: "center" }}>Thêm sản phẩm mới</div>}
      open={isCreateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseCreateModal}
      maskClosable={false}
      confirmLoading={loading}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <Form
        form={form}
        name="createProduct"
        onFinish={onFinish}
        layout="vertical"
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
                const url = file.response?.data?.file;
                if (url) {
                  file.url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
                }
              }
              setThumbnailList(fileList);
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
              <Select.Option key={cat._id} value={cat._id}>
                {cat.name}
              </Select.Option>
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
            const urls = file.response?.data?.files;
            if (Array.isArray(urls) && urls.length > 0) {
              file.url = `${process.env.NEXT_PUBLIC_BACKEND_URL}${urls[0]}`;
            }
          }
          setSliderList(fileList);
        }}
        onPreview={handlePreview}
      >
        {uploadButton}
      </Upload>

      <Divider />
    </Modal>
  );
};

export default CreateProductModal;
