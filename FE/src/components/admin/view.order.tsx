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
  Table,
} from "antd";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

interface ViewOrderModalProps {
  orderData: IOrder | null;
  isViewModalOpen: boolean;
  setOrderData: any;
  setIsViewModalOpen: (open: boolean) => void;
}

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

const getImageUrl = (url?: string) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
};

const ViewOrderModal: React.FC<ViewOrderModalProps> = ({
  orderData,
  setOrderData,
  isViewModalOpen,
  setIsViewModalOpen,
}) => {
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
    if (orderData) {
      const imgs: UploadFile[] = [];
      if (orderData.thumbnail) {
        imgs.push({
          uid: uuidv4(),
          name: "thumbnail",
          status: "done",
          url: getImageUrl(orderData.thumbnail),
        });
      }
      setFileList(imgs);
    }
  }, [orderData]);

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
      onCancel={() => setIsViewModalOpen(false)}
      footer={null}
      width={800}
      title={<div style={{ textAlign: "center" }}>Order Details</div>}
    >
      {orderData && (
        <>
          <Descriptions bordered column={1} size="small">
            {orderData.thumbnail && (
              <Descriptions.Item label="Thumbnail">
                <Image
                  src={getImageUrl(orderData.thumbnail)}
                  alt="thumbnail"
                  width={120}
                />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Order ID">
              {orderData._id}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">
              {orderData.userId}
            </Descriptions.Item>
            <Descriptions.Item label="Phone">
              {orderData.phoneNumber}
            </Descriptions.Item>

            <Descriptions.Item label="Address">
              {orderData.shippingAddress}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {orderData.status.toUpperCase()}
            </Descriptions.Item>
            <Descriptions.Item label="Total Price">
              {orderData.totalPrice.toLocaleString("vi-VN")} ₫
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {dayjs(orderData.createdAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {dayjs(orderData.updatedAt).format("DD/MM/YYYY HH:mm")}
            </Descriptions.Item>
          </Descriptions>

          <Divider>Order Items</Divider>
          <Table
            dataSource={orderData.items}
            rowKey={(item) => item.productId}
            pagination={false}
            size="small"
            columns={[
              {
                title: "Product ID",
                dataIndex: "productId",
                render: (productId: string) => (
                  <a
                    href={`/product-detail/${productId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#1677ff" }}
                  >
                    {productId}
                  </a>
                ),
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
                align: "center",
              },
              {
                title: "Price",
                dataIndex: "price",
                align: "right",
                render: (val: number) =>
                  val.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }),
              },
              {
                title: "Subtotal",
                align: "right",
                render: (_, record) =>
                  (record.price * record.quantity).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }),
              },
            ]}
          />
        </>
      )}
    </Modal>
  );
};

export default ViewOrderModal;
