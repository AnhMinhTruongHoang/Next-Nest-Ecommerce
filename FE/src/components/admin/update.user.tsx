"use client";
import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Form, InputNumber, App } from "antd";

const { Option } = Select;
interface IProps {
  access_token: string;
  getData: any;
  isUpdateModalOpen: boolean;
  setIsUpdateModalOpen: (v: boolean) => void;
  dataUpdate: null | IUser;
  setDataUpdate: any;
}

const UpdateUserModal = (props: IProps) => {
  const {
    access_token,
    getData,
    isUpdateModalOpen,
    setIsUpdateModalOpen,
    dataUpdate,
    setDataUpdate,
  } = props;

  const [form] = Form.useForm();
  const [isSubmit, setIsSubmit] = useState(false);
  const { notification } = App.useApp();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        name: dataUpdate.name,
        email: dataUpdate.email,
        age: dataUpdate.age,
        address: dataUpdate.address,
        role: dataUpdate.role,
        gender: dataUpdate.gender,
      });
    }
  }, [dataUpdate]);

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    form.resetFields();
    setDataUpdate(null);
  };

  const onFinish = async (values: any) => {
    if (!dataUpdate) return;

    const { name, email, age, gender, role, address } = values;
    const data = {
      _id: dataUpdate._id,
      name,
      email,
      age,
      gender,
      role,
      address,
    };

    setIsSubmit(true);
    try {
      const res = await fetch(
        `http://localhost:8000/api/v1/users/${data._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: access_token.startsWith("Bearer ")
              ? access_token
              : `Bearer ${access_token}`,
          },
          body: JSON.stringify(data),
        }
      );

      const result = await res.json();

      if (res.ok && result?.data) {
        notification.success({
          message: "Cập nhật người dùng thành công!",
        });
        await getData();
        handleCloseUpdateModal();
      } else {
        notification.error({
          message: "Cập nhật thất bại!",
          description: result?.message || "Lỗi không xác định",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối máy chủ!",
        description: err?.message || "Không thể kết nối API",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Cập nhật người dùng</div>}
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseUpdateModal()}
      maskClosable={false}
      confirmLoading={isSubmit}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Email"
          name="email"
          rules={[{ required: true, message: "Vui lòng nhập email!" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Mật khẩu"
          name="password"
          rules={[
            {
              required: dataUpdate ? false : true,
              message: "Vui lòng nhập mật khẩu!",
            },
          ]}
        >
          <Input.Password disabled={dataUpdate ? true : false} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Tuổi"
          name="age"
          rules={[{ required: true, message: "Vui lòng nhập tuổi!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          name="gender"
          label="Giới tính"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Chọn giới tính" allowClear>
            <Option value="MALE">Nam</Option>
            <Option value="FEMALE">Nữ</Option>
            <Option value="OTHER">Khác</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
