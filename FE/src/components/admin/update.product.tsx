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
  // Upload states
  const [thumbnailList, setThumbnailList] = useState<UploadFile[]>([]);
  const [sliderList, setSliderList] = useState<UploadFile[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const { notification } = App.useApp();

  // Lấy danh sách category khi modal mở
  useEffect(() => {
    if (isUpdateModalOpen) {
      fetch("http://localhost:8000/api/v1/categories", {
        headers: { Authorization: `Bearer ${access_token}` },
      })
        .then((res) => res.json())
        .then((d) => {
          if (d.data) setCategories(d.data);
        });
    }
  }, [isUpdateModalOpen]);

  // Set giá trị form + load sẵn ảnh khi có dataUpdate
  const getFullUrl = (url: string) => {
    if (!url) return "";
    // Nếu đã là absolute url thì return
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
  };

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

      // Thumbnail
      if (dataUpdate.thumbnail) {
        setThumbnailList([
          {
            uid: "-1",
            name: "thumbnail.png",
            status: "done",
            url: getFullUrl(dataUpdate.thumbnail),
          } as UploadFile,
        ]);
      } else {
        setThumbnailList([]);
      }

      // Slider images
      if (Array.isArray(dataUpdate.images)) {
        setSliderList(
          dataUpdate.images.map((url, idx) => ({
            uid: String(idx),
            name: `slider-${idx}.png`,
            status: "done",
            url: getFullUrl(url),
          })) as UploadFile[]
        );
      } else {
        setSliderList([]);
      }
    }
  }, [dataUpdate]);

  /// img func
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
      message.error("You can only upload JPG/PNG/WEBP file!");
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must smaller than 5MB!");
    }
    return isValid && isLt5M;
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
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
      const thumbnailFile = thumbnailList.find((f) => f.status === "done");
      const thumbnailUrl =
        thumbnailFile?.response?.data?.file || thumbnailFile?.url || "";

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
          message: "Cập nhật product thành công.",
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
      title={<div style={{ textAlign: "center" }}>Update product</div>}
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
        <Divider>Thumbnail</Divider>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Upload
            name="thumbnail"
            listType="picture-circle"
            beforeUpload={beforeUpload}
            action="http://localhost:8000/api/v1/products/upload"
            headers={{
              Authorization: `Bearer ${access_token}`,
            }}
            fileList={thumbnailList}
            onChange={({ file, fileList }) => {
              if (file.status === "done") {
                const url = file.response?.data?.file;
                if (url) {
                  file.url = getFullUrl(url);
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
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input product name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Brand"
          name="brand"
          rules={[{ required: true, message: "Please input brand!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Price"
          name="price"
          rules={[{ required: true, message: "Please input price!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Stock"
          name="stock"
          rules={[{ required: true, message: "Please input stock quantity!" }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Category"
          name="category"
          rules={[{ required: true, message: "Please select category!" }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Option key={cat._id} value={cat._id}>
                {cat.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>

      <Divider>Images</Divider>

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
        action="http://localhost:8000/api/v1/products/upload-slider"
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

export default UpdateProductModal;
