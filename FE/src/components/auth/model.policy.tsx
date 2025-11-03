"use client";

import { Modal, Typography, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;

interface TermsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const TermsModal = ({ isModalOpen, setIsModalOpen }: TermsModalProps) => {
  return (
    <Modal
      title={
        <div style={{ textAlign: "center" }}>
          Điều khoản dịch vụ & Chính sách bảo mật
        </div>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={() => setIsModalOpen(false)}
      okText="Đồng ý"
      cancelText="Đóng"
      width={800}
      style={{ top: 40 }}
    >
      <Typography>
        <Title level={4}>1. Điều khoản dịch vụ</Title>
        <Paragraph>
          Khi sử dụng dịch vụ của chúng tôi, bạn đồng ý tuân thủ các quy định và
          hướng dẫn được đưa ra. Người dùng không được phép sử dụng dịch vụ cho
          các mục đích vi phạm pháp luật, gây hại đến hệ thống hoặc xâm phạm
          quyền lợi của bên thứ ba.
        </Paragraph>
        <Paragraph>
          <Text strong>Trách nhiệm của người dùng:</Text> Cung cấp thông tin
          chính xác, bảo mật tài khoản, và tuân thủ các quy định hiện hành.
        </Paragraph>

        <Divider />

        <Title level={4}>2. Chính sách bảo mật</Title>
        <Paragraph>
          Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu sẽ chỉ
          được sử dụng cho mục đích cung cấp dịch vụ và cải thiện trải nghiệm
          người dùng.
        </Paragraph>
        <Paragraph>
          <Text strong>Thu thập thông tin:</Text> Bao gồm email, số điện thoại,
          địa chỉ giao hàng khi bạn đăng ký hoặc mua hàng.
        </Paragraph>
        <Paragraph>
          <Text strong>Bảo mật:</Text> Thông tin của bạn được mã hóa và lưu trữ
          an toàn. Chúng tôi không chia sẻ dữ liệu cho bên thứ ba nếu không có
          sự đồng ý của bạn, trừ khi pháp luật yêu cầu.
        </Paragraph>

        <Divider />

        <Paragraph
          type="secondary"
          style={{ fontSize: 13, textAlign: "center" }}
        >
          Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc và đồng ý với
          Điều khoản dịch vụ & Chính sách bảo mật.
        </Paragraph>
      </Typography>
    </Modal>
  );
};

export default TermsModal;
