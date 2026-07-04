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
      className="gz-terms-modal"
      title={
        <div className="gz-terms-title">
          Điều khoản dịch vụ & Chính sách bảo mật
        </div>
      }
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      onOk={() => setIsModalOpen(false)}
      okText="Đồng ý"
      cancelText="Đóng"
      width={800}
      centered
    >
      <Typography className="gz-terms-content">
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

        <Paragraph className="gz-terms-footer-note">
          Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc và đồng ý với
          Điều khoản dịch vụ & Chính sách bảo mật.
        </Paragraph>
      </Typography>

      <style jsx global>{`
        .gz-terms-modal .ant-modal-content {
          overflow: hidden;
          border-radius: 22px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.018)
            ),
            #151718 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 28px 90px rgba(0, 0, 0, 0.55),
            0 0 0 1px rgba(0, 255, 224, 0.04) !important;
          padding: 0 !important;
        }

        .gz-terms-modal .ant-modal-header {
          padding: 22px 24px 18px !important;
          margin: 0 !important;
          background: radial-gradient(
              circle at top center,
              rgba(0, 255, 224, 0.14),
              transparent 55%
            ),
            #151718 !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .gz-terms-title {
          color: #ffffff;
          font-size: 20px;
          font-weight: 950;
          text-align: center;
          letter-spacing: -0.02em;
        }

        .gz-terms-modal .ant-modal-body {
          max-height: 68vh;
          overflow-y: auto;
          padding: 24px !important;
        }

        .gz-terms-modal .ant-modal-footer {
          margin: 0 !important;
          padding: 16px 24px 22px !important;
          border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
        }

        .gz-terms-modal .ant-modal-close {
          top: 16px !important;
          color: #d1d5db !important;
        }

        .gz-terms-modal .ant-modal-close:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-terms-content h4.ant-typography {
          color: #00ffe0 !important;
          font-weight: 950 !important;
          margin-top: 0 !important;
          margin-bottom: 12px !important;
        }

        .gz-terms-content .ant-typography,
        .gz-terms-content p {
          color: #d1d5db !important;
          font-size: 15px;
          line-height: 1.75;
        }

        .gz-terms-content strong {
          color: #ffffff !important;
          font-weight: 900;
        }

        .gz-terms-content .ant-divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
          margin: 22px 0 !important;
        }

        .gz-terms-footer-note {
          margin-bottom: 0 !important;
          color: #8b949e !important;
          font-size: 13px !important;
          text-align: center;
        }

        .gz-terms-modal .ant-btn {
          height: 40px !important;
          border-radius: 999px !important;
          font-weight: 850 !important;
        }

        .gz-terms-modal .ant-btn-default {
          color: #ffffff !important;
          background: #0b0f10 !important;
          border-color: rgba(255, 255, 255, 0.14) !important;
        }

        .gz-terms-modal .ant-btn-default:hover {
          color: #00ffe0 !important;
          border-color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-terms-modal .ant-btn-primary {
          color: #061313 !important;
          background: #00b894 !important;
          border: none !important;
          box-shadow: 0 10px 24px rgba(0, 184, 148, 0.2) !important;
        }

        .gz-terms-modal .ant-btn-primary:hover {
          background: #00d1a6 !important;
        }

        @media (max-width: 576px) {
          .gz-terms-modal {
            width: calc(100vw - 24px) !important;
            max-width: calc(100vw - 24px) !important;
          }

          .gz-terms-title {
            font-size: 17px;
            line-height: 1.35;
            padding-right: 18px;
          }

          .gz-terms-modal .ant-modal-header {
            padding: 18px 18px 14px !important;
          }

          .gz-terms-modal .ant-modal-body {
            max-height: 66vh;
            padding: 18px !important;
          }

          .gz-terms-modal .ant-modal-footer {
            padding: 14px 18px 18px !important;
          }

          .gz-terms-content .ant-typography,
          .gz-terms-content p {
            font-size: 14px;
          }
        }
      `}</style>
    </Modal>
  );
};

export default TermsModal;
