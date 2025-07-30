import React, { useEffect, useState } from "react";
import { Modal, Input, notification, Select, Form, InputNumber } from "antd";
import { IUser } from "next-auth";
import { updateUserAction } from "@/lib/actions";

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
    const { name, email, age, gender, role, address, company } = values;
    if (dataUpdate) {
      const data = {
        _id: dataUpdate._id,
        name,
        email,
        age,
        gender,
        role,
        address,
        // company: { _id: company, name: "None" }, // disable this
      };

      const d = await updateUserAction(data, access_token);
      if (d.data) {
        //success
        await getData();
        notification.success({
          message: "Cập nhật user thành công.",
        });
        handleCloseCreateModal();
      } else {
        ///
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
