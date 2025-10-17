import React, { useEffect, useState } from "react";
import {
  Modal,
  Input,
  notification,
  Select,
  Form,
  InputNumber,
  App,
} from "antd";

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

  console.log("Access Token:", access_token);

  useEffect(() => {
    if (dataUpdate) {
      //code
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

  const handleCloseCreateModal = () => {
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
          message: "Cập nhật user thành công!",
        });
        await getData();
        handleCloseCreateModal();
      } else {
        notification.error({
          message: "Cập nhật thất bại!",
          description: result?.message || "Lỗi không xác định",
        });
      }
    } catch (err: any) {
      notification.error({
        message: "Lỗi kết nối server!",
        description: err?.message || "Không thể kết nối API",
      });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Modal
      title={<div style={{ textAlign: "center" }}>Update user</div>}
      open={isUpdateModalOpen}
      onOk={() => form.submit()}
      onCancel={() => handleCloseCreateModal()}
      maskClosable={false}
      confirmLoading={isSubmit}
    >
      <Form name="basic" onFinish={onFinish} layout="vertical" form={form}>
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please input your name!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Email"
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input type="email" />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Password"
          name="password"
          rules={[
            {
              required: dataUpdate ? false : true,
              message: "Please input your password!",
            },
          ]}
        >
          <Input.Password disabled={dataUpdate ? true : false} />
        </Form.Item>
        <Form.Item
          style={{ marginBottom: 5 }}
          label="Age"
          name="age"
          rules={[{ required: true, message: "Please input your age!" }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          label="Address"
          name="address"
          rules={[{ required: true, message: "Please input your address!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          style={{ marginBottom: 5 }}
          name="gender"
          label="Gender"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select a option and change input text above"
            // onChange={onGenderChange}
            allowClear
          >
            <Option value="MALE">male</Option>
            <Option value="FEMALE">female</Option>
            <Option value="OTHER">other</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UpdateUserModal;
