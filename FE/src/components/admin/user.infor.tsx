// "use client";

// import { useCurrentApp } from "@/components/context/app.context";
// import {
//   App,
//   Avatar,
//   Button,
//   Col,
//   Form,
//   Input,
//   Modal,
//   Row,
//   Upload,
// } from "antd";
// import { useEffect, useState } from "react";
// import type { FormProps } from "antd";
// import type { UploadChangeParam } from "antd/es/upload";


// type FieldType = {
//   _id: string;
//   email: string;
//   name: string;
//   phone: string;
// };

// interface IUserInfoModalProps {
//   openManageAccount: boolean;
//   setOpenManageAccount: (open: boolean) => void;
// }

// const UserInfoModal: React.FC<IUserInfoModalProps> = ({
//   openManageAccount,
//   setOpenManageAccount,
// }) => {
//   const [form] = Form.useForm();
//   const { user, setUser } = useCurrentApp();
//   const [isSubmit, setIsSubmit] = useState(false);
//   const token = localStorage.getItem("access_token");
//   const { message, notification } = App.useApp();

//   useEffect(() => {
//     if (openManageAccount && user) {
//       form.setFieldsValue({
//         _id: user._id,
//         email: user.email,
//         phone: user.phone,
//         name: user.name,
//       });
//     }
//     console.log(user);
//     console.log("tokken", token);
//   }, [openManageAccount, user, form]);

//   const propsUpload = {
//     maxCount: 1,
//     multiple: false,
//     showUploadList: false,
//     onChange(info: UploadChangeParam) {
//       if (info.file.status === "done") {
//         message.success("Upload file thành công");
//       } else if (info.file.status === "error") {
//         message.error("Upload file thất bại");
//       }
//     },
//   };

//   const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
//     const { name, phone, _id } = values;
//     setIsSubmit(true);

//     const res = await updateUserInfoAPI(_id, name, phone);

//     if (res && res.data) {
//       setUser({
//         ...user!,
//         name,
//         phone,
//       });
//       message.success("Cập nhật thông tin user thành công");
//       localStorage.removeItem("access_token");
//       setOpenManageAccount(false);
//     } else {
//       notification.error({
//         message: "Đã có lỗi xảy ra",
//         description: res.message,
//       });
//     }
//     setIsSubmit(false);
//   };

//   return (
//     <Modal
//       title="Thông tin người dùng"
//       open={openManageAccount}
//       onCancel={() => setOpenManageAccount(false)}
//       footer={null}
//       centered
//     >
//       <Row gutter={[24, 24]}>
//         <Col sm={24} md={14}>
//           <Form
//             form={form}
//             name="user-info"
//             onFinish={onFinish}
//             autoComplete="off"
//             layout="vertical"
//           >
//             <Form.Item<FieldType> name="_id" hidden>
//               <Input hidden />
//             </Form.Item>

//             <Form.Item<FieldType>
//               label="Email"
//               name="email"
//               rules={[
//                 { required: true, message: "Email không được để trống!" },
//               ]}
//             >
//               <Input disabled />
//             </Form.Item>

//             <Form.Item<FieldType>
//               label="Tên hiển thị"
//               name="name"
//               rules={[
//                 {
//                   required: true,
//                   message: "Tên hiển thị không được để trống!",
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item<FieldType>
//               label="Số điện thoại"
//               name="phone"
//               rules={[
//                 {
//                   required: true,
//                   message: "Số điện thoại không được để trống!",
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>

//             <Button
//               type="primary"
//               loading={isSubmit}
//               onClick={() => form.submit()}
//               block
//             >
//               Cập nhật
//             </Button>
//           </Form>
//         </Col>
//       </Row>
//     </Modal>
//   );
// };

// export default UserInfoModal;
