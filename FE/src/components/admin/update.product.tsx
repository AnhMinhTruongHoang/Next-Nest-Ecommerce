"use client";

import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  Select,
  Form,
  InputNumber,
  UploadFile,
  GetProp,
  UploadProps,
  message,
  Divider,
  Upload,
  Image,
  App,
} from "antd";
import { updateProductAction } from "@/lib/product.actions";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { getImageUrl } from "@/utils/getImageUrl";

interface ICategory {
  _id: string;
  name: string;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

interface IProps {
  access_token: string;
  getData: () => Promise<void>;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IProduct;
  setDataUpdate: (v: null | IProduct) => void;
}

const UpdateProductModal = (props: IProps) => {
  const {
    access_token,
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  const [form] = Form.useForm();
  const { Option } = Select;
  const [isSubmit, setIsSubmit] = useState(false);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [sliderList, setSliderList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();

  // Lấy danh mục khi mở modal
  useEffect(() => {
    if (isUpdateModalOpen) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/categories`, {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.data) setCategories(d.data);
        })
        .catch(() => {
          notification.error({ message: "Không tải được danh mục" });
        });
    }
  }, [isUpdateModalOpen, access_token, notification]);

  // Set form + ảnh khi có dataUpdate
  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        brand: dataUpdate.brand,
        price: dataUpdate.price,
        stock: dataUpdate.stock,
        category:
          typeof dataUpdate.category === "object"
            ? (dataUpdate.category as any)._id
            : dataUpdate.category,
      });

      // thumbnail
      if (dataUpdate.thumbnail) {
        setThumbnailList([
          {
            uid: "-1",
            name: "thumbnail.png",
            status: "done",
            url: getImageUrl(dataUpdate.thumbnail),
          } as UploadFile,
        ]);
      } else {
        setThumbnailList([]);
      }

      // slider images
      if (Array.isArray(dataUpdate.images)) {
        setSliderList(
          dataUpdate.images.map((url, idx) => ({
            uid: String(idx),
            name: `slider-${idx}.png`,
            status: "done",
            url: getImageUrl(url),
          })) as UploadFile[]
        );
      } else {
        setSliderList([]);
      }
    }
  }, [dataUpdate, form]);

  // ===== helper preview =====
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

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields();
    setDataUpdate(null);
    setThumbnailList([]);
    setSliderList([]);
  };

  const onFinish = async (values: any) => {
    setIsSubmit(true);
    if (dataUpdate) {
      // thumbnail: ưu tiên path trong response, fallback về URL hiện tại
      const thumbnailFile = thumbnailList.find((f) => f.status === "done");
      const thumbnailUrl =
        thumbnailFile?.response?.data?.file ||
        thumbnailFile?.url ||
        dataUpdate.thumbnail ||
        "";

      // slider images: lấy path từ response, nếu không có thì dùng url hiện tại
      const sliderUrls = sliderList
        .filter((f) => f.status === "done")
        .flatMap((f) => {
          if (Array.isArray(f.response?.data?.files)) {
            // BE trả về mảng file path / filename
            return f.response.data.files as string[];
          }
          if (typeof f.url === "string") {
            return [f.url];
          }
          return [];
        })
        .filter((u) => !!u);

      const payload = {
        _id: dataUpdate._id,
        ...values,
        thumbnail: thumbnailUrl,
        images: sliderUrls,
      };

      const d = await updateProductAction(payload, access_token);
      if (d.data) {
        await getData();
        notification.success({
          message: "Cập nhật sản phẩm thành công.",
        });
        handleCloseModal();
      } else {
        notification.error({
          message: "Có lỗi xảy ra",
          description: JSON.stringify(d.message),
        });
      }
    }
    setIsSubmit(false);
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Cập nhật sản phẩm</div>}
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={handleCloseModal}
      maskClosable={false}
      confirmLoading={isSubmit}
      width="90%"
      style={{ maxWidth: 600 }}
    >
      <Form
        name="updateProduct"
        onFinish={onFinish}
        layout="vertical"
        form={form}
      >
        <Divider>Ảnh đại diện</Divider>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Upload
            name="thumbnail"
            listType="picture-circle"
            beforeUpload={beforeUpload}
            action={`${process.env.NEXT_PUBLIC_BACKEND_URL}/upload`}
            headers={{
              Authorization: `Bearer ${access_token}`,
            }}
            fileList={thumbnailList}
            onChange={({ file, fileList }) => {
              if (file.status === "done") {
                const path = file.response?.data?.file as string | undefined;
                if (path) {
                  file.url = getImageUrl(path);
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
          label="Giá"
          name="price"
          rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Tồn kho"
          name="stock"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng tồn kho!" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
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
            const urls = file.response?.data?.files as string[] | undefined;
            if (Array.isArray(urls) && urls.length > 0) {
              const raw = urls[0];
              // BE có thể trả filename hoặc path, xử lý cả 2
              const path = raw.startsWith("/") ? raw : `/slider/${raw}`;
              file.url = getImageUrl(path);
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

export default UpdateProductModal;
