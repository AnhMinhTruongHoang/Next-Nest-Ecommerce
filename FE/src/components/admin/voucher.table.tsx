"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  Input,
  Space,
  Spin,
  App,
  Tag,
  Form,
  Modal,
  Select,
  DatePicker,
  Switch,
  InputNumber,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

type TVoucherType = "PERCENT" | "AMOUNT";

interface IVoucher {
  _id: string;
  code: string;
  type: TVoucherType;
  amount: number;
  maxDiscount?: number;
  minOrder?: number;
  startAt?: string | null;
  endAt?: string | null;
  isActive: boolean;
  usedCount: number;
  totalUses: number;
  userUsageLimit?: number;
  createdAt?: string;
  updatedAt?: string;
}

type Meta = { current: number; pageSize: number; pages: number; total: number };

const VouchersTable: React.FC = () => {
  const [danhSach, setDanhSach] = useState<IVoucher[]>([]);
  const [dangTai, setDangTai] = useState(false);
  const [meta, setMeta] = useState<Meta>({
    current: 1,
    pageSize: 20,
    pages: 0,
    total: 0,
  });
  const [accessToken, setAccessToken] = useState<string>("");
  const { notification } = App.useApp();

  // State modal
  const [voucherXem, setVoucherXem] = useState<IVoucher | null>(null);
  const [moModalXem, setMoModalXem] = useState(false);
  const [moModalTao, setMoModalTao] = useState(false);
  const [moModalCapNhat, setMoModalCapNhat] = useState(false);
  const [duLieuCapNhat, setDuLieuCapNhat] = useState<IVoucher | null>(null);

  // Bộ lọc cục bộ (client-side) cho Code
  const [boLocCode, setBoLocCode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        const tokenDinhDang = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
        setAccessToken(tokenDinhDang);
      }
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      layDuLieu(meta.current, meta.pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) h.Authorization = accessToken;
    return h;
  }, [accessToken]);

  const layDuLieu = async (trangHienTai = 1, kichThuocTrang = 20) => {
    setDangTai(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vouchers?current=${trangHienTai}&pageSize=${kichThuocTrang}`,
        { headers }
      );
      const duLieu = await res.json();
      if (duLieu?.data?.result) {
        setDanhSach(duLieu.data.result);
        setMeta(duLieu.data.meta);
      } else {
        notification.error({
          message: duLieu?.message || "Không lấy được danh sách voucher",
        });
      }
    } catch (e: any) {
      notification.error({ message: e?.message || "Lỗi khi gọi API" });
    } finally {
      setDangTai(false);
    }
  };

  const xuLyThayDoiTrang = async (trang: number, kichThuocTrang: number) => {
    await layDuLieu(trang, kichThuocTrang);
  };

  const xuLyXoa = async (voucher: IVoucher) => {
    setDangTai(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vouchers/${voucher._id}`,
        {
          method: "DELETE",
          headers,
        }
      );
      const duLieu = await res.json();
      if (duLieu?.data?._id) {
        notification.success({ message: "Xóa voucher thành công" });
        layDuLieu(meta.current, meta.pageSize);
      } else {
        notification.error({
          message: duLieu?.message || "Xóa voucher thất bại",
        });
      }
    } catch (e: any) {
      notification.error({ message: e?.message || "Lỗi khi xóa voucher" });
    } finally {
      setDangTai(false);
    }
  };

  const cot: ColumnsType<IVoucher> = [
    {
      title: "Mã",
      dataIndex: "code",
      align: "center",
      width: 170,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          className="gz-voucher-code-btn"
          onClick={() => {
            setVoucherXem(record);
            setMoModalXem(true);
          }}
        >
          {record.code}
        </Button>
      ),
      filteredValue: boLocCode ? [boLocCode] : undefined,
      onFilter: (giaTri, record) =>
        record.code.toLowerCase().includes(String(giaTri).toLowerCase()),
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div className="gz-voucher-filter-dropdown">
          <Input
            placeholder="Tìm kiếm mã"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => {
              setBoLocCode(String(selectedKeys[0] || ""));
              confirm();
            }}
          />
  
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setBoLocCode(String(selectedKeys[0] || ""));
                confirm();
              }}
              size="small"
              icon={<SearchOutlined />}
            >
              Tìm kiếm
            </Button>
  
            <Button
              onClick={() => {
                clearFilters?.();
                setSelectedKeys([]);
                setBoLocCode("");
                confirm();
              }}
              size="small"
            >
              Đặt lại
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (daLoc) => (
        <SearchOutlined style={{ color: daLoc ? "#00ffe0" : undefined }} />
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      align: "center",
      width: 130,
      render: (loai: TVoucherType) => (
        <Tag className={`gz-voucher-type ${loai === "PERCENT" ? "percent" : "fixed"}`}>
          {loai}
        </Tag>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      align: "right",
      width: 130,
      render: (giaTri, record) => (
        <span className="gz-voucher-money">
          {record.type === "PERCENT" ? `${giaTri}%` : giaTri.toLocaleString()}
        </span>
      ),
    },
    {
      title: "Giảm tối đa",
      dataIndex: "maxDiscount",
      align: "right",
      width: 150,
      render: (giaTri?: number) => (
        <span className="gz-voucher-money">
          {giaTri ? giaTri.toLocaleString() : "—"}
        </span>
      ),
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minOrder",
      align: "right",
      width: 150,
      render: (giaTri?: number) => (
        <span className="gz-voucher-money">
          {giaTri ? giaTri.toLocaleString() : "0"}
        </span>
      ),
    },
    {
      title: "Kích hoạt",
      dataIndex: "isActive",
      align: "center",
      width: 120,
      render: (isActive: boolean) =>
        isActive ? (
          <span className="gz-voucher-active">
            <CheckOutlined />
          </span>
        ) : (
          <span className="gz-voucher-inactive">
            <CloseOutlined />
          </span>
        ),
    },
    {
      title: "Đã dùng/Tổng",
      align: "center",
      width: 140,
      render: (_, record) => (
        <span className="gz-voucher-used">
          <b>{record.usedCount ?? 0}</b> /{" "}
          {record.totalUses === 0 ? "∞" : record.totalUses}
        </span>
      ),
    },
    {
      title: "Thời gian hiệu lực",
      align: "center",
      width: 220,
      render: (_, record) => {
        const batDau = record.startAt
          ? dayjs(record.startAt).format("DD/MM/YYYY")
          : "—";
        const ketThuc = record.endAt
          ? dayjs(record.endAt).format("DD/MM/YYYY")
          : "—";
  
        return (
          <span className="gz-voucher-date">
            {batDau} → {ketThuc}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      align: "center",
      width: 170,
      fixed: "right",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            className="gz-voucher-edit-btn"
            onClick={() => {
              setDuLieuCapNhat(record);
              setMoModalCapNhat(true);
            }}
          >
            Sửa
          </Button>
  
          <Popconfirm
            title="Xóa voucher này?"
            onConfirm={() => xuLyXoa(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button danger icon={<DeleteOutlined />} className="gz-voucher-delete-btn">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  
  return (
    <div className="gz-voucher-admin-page">
      <Spin spinning={dangTai} tip="Đang tải dữ liệu...">
        <div className="gz-voucher-admin-header">
          <div>
            <h2 className="gz-voucher-admin-title">Quản lý Voucher</h2>
            <p className="gz-voucher-admin-subtitle">
              Quản lý mã giảm giá, thời hạn và lượt sử dụng
            </p>
          </div>
  
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setMoModalTao(true)}
            className="gz-voucher-add-btn"
          >
            Thêm mới
          </Button>
        </div>
  
        <div className="gz-voucher-table-card">
          <Table<IVoucher>
            className="gz-voucher-admin-table"
            columns={cot}
            dataSource={danhSach}
            rowKey="_id"
            scroll={{ x: 1350 }}
            pagination={{
              position: ["bottomCenter"],
              current: meta.current,
              pageSize: meta.pageSize,
              total: meta.total,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} mục`,
              onChange: xuLyThayDoiTrang,
              showSizeChanger: true,
            }}
          />
        </div>
  
        <ModalXemVoucher
          open={moModalXem}
          onClose={() => setMoModalXem(false)}
          data={voucherXem}
        />
  
        <ModalTaoVoucher
          open={moModalTao}
          onClose={() => setMoModalTao(false)}
          onCreated={() => layDuLieu(meta.current, meta.pageSize)}
          headers={headers}
        />
  
        <ModalCapNhatVoucher
          open={moModalCapNhat}
          onClose={() => setMoModalCapNhat(false)}
          data={duLieuCapNhat}
          onUpdated={() => layDuLieu(meta.current, meta.pageSize)}
          headers={headers}
        />
      </Spin>
  
      <style jsx global>{`
        .gz-voucher-admin-page {
          width: 100%;
          color: #ffffff;
        }
  
        .gz-voucher-admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 16px 18px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
  
        .gz-voucher-admin-title {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
          font-weight: 800;
        }
  
        .gz-voucher-admin-subtitle {
          margin: 5px 0 0;
          color: #8b949e;
          font-size: 13px;
        }
  
        .gz-voucher-add-btn {
          border: none !important;
          border-radius: 10px !important;
          font-weight: 800 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 8px 18px rgba(255, 77, 0, 0.18) !important;
        }
  
        .gz-voucher-table-card {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
        }
  
        .gz-voucher-admin-table .ant-table {
          background: #181a1b !important;
          color: #e5e7eb !important;
        }
  
        .gz-voucher-admin-table .ant-table-container {
          background: #181a1b !important;
        }
  
        .gz-voucher-admin-table .ant-table-thead > tr > th {
          background: #111314 !important;
          color: #ffffff !important;
          border-bottom: 1px solid #303435 !important;
          font-weight: 800 !important;
          white-space: nowrap;
        }
  
        .gz-voucher-admin-table .ant-table-tbody > tr > td {
          background: #181a1b !important;
          color: #d1d5db !important;
          border-bottom: 1px solid #2a2d2e !important;
          vertical-align: middle;
        }
  
        .gz-voucher-admin-table .ant-table-tbody > tr:hover > td {
          background: #202324 !important;
        }
  
        .gz-voucher-admin-table .ant-table-cell-row-hover {
          background: #202324 !important;
        }
  
        .gz-voucher-code-btn {
          color: #00ffe0 !important;
          font-weight: 800 !important;
          padding: 0 !important;
        }
  
        .gz-voucher-code-btn:hover {
          color: #ff7a00 !important;
        }
  
        .gz-voucher-type {
          border: none !important;
          border-radius: 999px !important;
          font-weight: 800;
          padding: 3px 10px !important;
        }
  
        .gz-voucher-type.percent {
          background: rgba(24, 144, 255, 0.14) !important;
          color: #40a9ff !important;
        }
  
        .gz-voucher-type.fixed {
          background: rgba(250, 173, 20, 0.14) !important;
          color: #facc15 !important;
        }
  
        .gz-voucher-money {
          color: #ff4d4f;
          font-weight: 800;
        }
  
        .gz-voucher-active {
          color: #00c781;
          font-size: 18px;
          font-weight: 800;
        }
  
        .gz-voucher-inactive {
          color: #ff4d4f;
          font-size: 18px;
          font-weight: 800;
        }
  
        .gz-voucher-used b {
          color: #00ffe0;
        }
  
        .gz-voucher-date {
          color: #d1d5db;
          white-space: nowrap;
        }
  
        .gz-voucher-edit-btn {
          border: none !important;
          border-radius: 999px !important;
          background: rgba(0, 255, 224, 0.12) !important;
          color: #00ffe0 !important;
          font-weight: 700 !important;
        }
  
        .gz-voucher-edit-btn:hover {
          background: rgba(0, 255, 224, 0.22) !important;
          color: #ffffff !important;
        }
  
        .gz-voucher-delete-btn {
          border-radius: 999px !important;
          font-weight: 700 !important;
        }
  
        .gz-voucher-admin-table .ant-table-column-sorter,
        .gz-voucher-admin-table .ant-table-filter-trigger {
          color: #8b949e !important;
        }
  
        .gz-voucher-admin-table .ant-table-filter-trigger:hover {
          color: #00ffe0 !important;
        }
  
        .gz-voucher-admin-table .ant-empty-description {
          color: #8b949e !important;
        }
  
        .gz-voucher-admin-table .ant-pagination {
          padding: 12px 16px;
          margin: 0 !important;
          justify-content: center !important;
        }
  
        .gz-voucher-admin-table .ant-pagination-total-text {
          color: #b8b8b8 !important;
        }
  
        .gz-voucher-admin-table .ant-pagination-item {
          background: #111314 !important;
          border-color: #303435 !important;
        }
  
        .gz-voucher-admin-table .ant-pagination-item a {
          color: #e5e7eb !important;
        }
  
        .gz-voucher-admin-table .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }
  
        .gz-voucher-admin-table .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }
  
        .gz-voucher-admin-table .ant-pagination-prev button,
        .gz-voucher-admin-table .ant-pagination-next button {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
        }
  
        .gz-voucher-admin-table .ant-select-selector {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }
  
        .gz-voucher-filter-dropdown {
          padding: 10px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 10px;
        }
  
        .gz-voucher-filter-dropdown .ant-input {
          width: 188px;
          margin-bottom: 8px;
          display: block;
          background: #111314 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }
  
        .gz-voucher-filter-dropdown .ant-input::placeholder {
          color: #6b7280 !important;
        }
  
        .gz-voucher-filter-dropdown .ant-input:hover,
        .gz-voucher-filter-dropdown .ant-input:focus {
          border-color: #00ffe0 !important;
          box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.08) !important;
        }
  
        .gz-voucher-filter-dropdown .ant-btn-primary {
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          border-color: #ff4d00 !important;
        }
  
        .gz-voucher-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }
  
        .gz-voucher-admin-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }
  
        .ant-popconfirm .ant-popover-inner {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
        }
  
        .ant-popconfirm .ant-popover-title,
        .ant-popconfirm .ant-popover-inner-content {
          color: #ffffff !important;
        }
  
        @media (max-width: 992px) {
          .gz-voucher-admin-header {
            flex-direction: column;
            align-items: stretch;
          }
  
          .gz-voucher-add-btn {
            width: fit-content;
          }
        }
  
        @media (max-width: 768px) {
          .gz-voucher-admin-header {
            padding: 14px;
            border-radius: 14px;
          }
  
          .gz-voucher-admin-title {
            font-size: 22px;
          }
  
          .gz-voucher-admin-subtitle {
            font-size: 12px;
          }
  
          .gz-voucher-add-btn {
            width: 100%;
            height: 40px;
          }
  
          .gz-voucher-table-card {
            border-radius: 14px;
            overflow-x: auto;
          }
  
          .gz-voucher-admin-table .ant-table {
            font-size: 13px;
          }
  
          .gz-voucher-admin-table .ant-table-thead > tr > th,
          .gz-voucher-admin-table .ant-table-tbody > tr > td {
            padding: 10px 8px !important;
          }
  
          .gz-voucher-admin-table .ant-pagination-options {
            display: none !important;
          }
        }
  
        @media (max-width: 420px) {
          .gz-voucher-admin-title {
            font-size: 20px;
          }
  
          .gz-voucher-admin-table .ant-table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default VouchersTable;

/* ===================== Component con ===================== */

const ModalXemVoucher: React.FC<{
  open: boolean;
  onClose: () => void;
  data: IVoucher | null;
}> = ({ open, onClose, data }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      onOk={onClose}
      title={`Chi tiết Voucher: ${data?.code ?? ""}`}
      width={520}
      okText="Đóng"
      cancelText="Hủy"
    >
      {data ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space>
            <b>Loại:</b>{" "}
            <Tag color={data.type === "PERCENT" ? "blue" : "gold"}>
              {data.type}
            </Tag>
          </Space>
          <Space>
            <b>Giá trị:</b>{" "}
            {data.type === "PERCENT"
              ? `${data.amount}%`
              : data.amount.toLocaleString()}
          </Space>
          <Space>
            <b>Giảm tối đa:</b>{" "}
            {data.maxDiscount ? data.maxDiscount.toLocaleString() : "—"}
          </Space>
          <Space>
            <b>Đơn tối thiểu:</b>{" "}
            {data.minOrder ? data.minOrder.toLocaleString() : 0}
          </Space>
          <Space>
            <b>Kích hoạt:</b>{" "}
            {data.isActive ? (
              <CheckOutlined style={{ color: "green" }} />
            ) : (
              <CloseOutlined style={{ color: "red" }} />
            )}
          </Space>
          <Space>
            <b>Đã dùng/Tổng:</b> <b>{data.usedCount ?? 0}</b> /{" "}
            {data.totalUses === 0 ? "∞" : data.totalUses}
          </Space>
          <Space>
            <b>Giới hạn mỗi user:</b> {data.userUsageLimit ?? 0}
          </Space>
          <Space>
            <b>Thời gian hiệu lực:</b>{" "}
            {(data.startAt ? dayjs(data.startAt).format("DD/MM/YYYY") : "—") +
              " → " +
              (data.endAt ? dayjs(data.endAt).format("DD/MM/YYYY") : "—")}
          </Space>
          <Space>
            <b>Cập nhật lúc:</b>{" "}
            {data.updatedAt
              ? dayjs(data.updatedAt).format("DD/MM/YYYY HH:mm")
              : "—"}
          </Space>
        </Space>
      ) : (
        <div>Không có dữ liệu</div>
      )}
    </Modal>
  );
};

const luaChonLoai = [
  { label: "Phần trăm", value: "PERCENT" },
  { label: "Số tiền", value: "AMOUNT" },
];

type GiaTriFormTao = {
  code: string;
  type: TVoucherType;
  amount: number;
  maxDiscount?: number;
  minOrder?: number;
  totalUses?: number;
  userUsageLimit?: number;
  isActive?: boolean;
  startAt?: Dayjs | null;
  endAt?: Dayjs | null;
};

const ModalTaoVoucher: React.FC<{
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  headers: Record<string, string>;
}> = ({ open, onClose, onCreated, headers }) => {
  const { notification } = App.useApp();
  const [form] = Form.useForm<GiaTriFormTao>();
  const [dangGui, setDangGui] = useState(false);
  const loai = Form.useWatch("type", form) as TVoucherType;

  const xuLySubmit = async () => {
    try {
      const values = await form.validateFields();
      const duLieuGui = {
        ...values,
        code: String(values.code || "")
          .trim()
          .toLowerCase(),
        startAt: values.startAt ? values.startAt.toISOString() : undefined,
        endAt: values.endAt ? values.endAt.toISOString() : undefined,
        isActive: values.isActive ?? true,
        totalUses: values.totalUses ?? 0,
        userUsageLimit: values.userUsageLimit ?? 0,
        maxDiscount: values.maxDiscount ?? 0,
        minOrder: values.minOrder ?? 0,
      };

      // Kiểm tra giá trị theo loại
      if (
        duLieuGui.type === "PERCENT" &&
        (duLieuGui.amount <= 0 || duLieuGui.amount > 100)
      ) {
        notification.error({ message: "Phần trăm phải trong khoảng 1..100" });
        return;
      }

      setDangGui(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vouchers`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(duLieuGui),
        }
      );
      const duLieu = await res.json();

      if (duLieu?.data?._id) {
        notification.success({ message: "Tạo voucher thành công" });
        form.resetFields();
        onClose();
        onCreated();
      } else {
        notification.error({
          message: duLieu?.message || "Tạo voucher thất bại",
        });
      }
    } catch (e: any) {
      if (e?.errorFields) return; // Lỗi validate form
      notification.error({ message: e?.message || "Lỗi khi tạo voucher" });
    } finally {
      setDangGui(false);
    }
  };

  useEffect(() => {
    if (!open) form.resetFields();
  }, [open, form]);

  return (
    <Modal
      open={open}
      title="Tạo Voucher Mới"
      onCancel={onClose}
      onOk={xuLySubmit}
      confirmLoading={dangGui}
      okText="Tạo"
      cancelText="Hủy"
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{ type: "PERCENT", isActive: true }}
      >
        <Form.Item
          name="code"
          label="Mã voucher"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
        >
          <Input placeholder="VD: gamerzone, sale50, ..." />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại voucher"
          rules={[{ required: true }]}
        >
          <Select options={luaChonLoai} />
        </Form.Item>
        <Form.Item
          name="amount"
          label={loai === "PERCENT" ? "Phần trăm giảm (%)" : "Số tiền giảm"}
          rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
        >
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá trị"
          />
        </Form.Item>
        {loai === "PERCENT" && (
          <Form.Item name="maxDiscount" label="Giảm tối đa (tùy chọn)">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập số tiền tối đa"
            />
          </Form.Item>
        )}
        <Form.Item name="minOrder" label="Đơn hàng tối thiểu (tùy chọn)">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá trị tối thiểu"
          />
        </Form.Item>
        <Form.Item
          name="totalUses"
          label="Tổng số lần sử dụng (0 = không giới hạn)"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="userUsageLimit"
          label="Giới hạn mỗi user (0 = không giới hạn)"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu" name="startAt">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Ngày kết thúc" name="endAt">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

type GiaTriFormCapNhat = GiaTriFormTao;

const ModalCapNhatVoucher: React.FC<{
  open: boolean;
  onClose: () => void;
  data: IVoucher | null;
  onUpdated: () => void;
  headers: Record<string, string>;
}> = ({ open, onClose, data, onUpdated, headers }) => {
  const { notification } = App.useApp();
  const [form] = Form.useForm<GiaTriFormCapNhat>();
  const [dangGui, setDangGui] = useState(false);
  const loai = Form.useWatch("type", form) as TVoucherType;

  useEffect(() => {
    if (open && data) {
      form.setFieldsValue({
        code: data.code,
        type: data.type,
        amount: data.amount,
        maxDiscount: data.maxDiscount ?? 0,
        minOrder: data.minOrder ?? 0,
        totalUses: data.totalUses ?? 0,
        userUsageLimit: data.userUsageLimit ?? 0,
        isActive: data.isActive,
        startAt: data.startAt ? dayjs(data.startAt) : undefined,
        endAt: data.endAt ? dayjs(data.endAt) : undefined,
      });
    } else {
      form.resetFields();
    }
  }, [open, data, form]);

  const xuLySubmit = async () => {
    if (!data) return;
    try {
      const values = await form.validateFields();
      const duLieuGui = {
        ...values,
        code: String(values.code || "")
          .trim()
          .toLowerCase(),
        startAt: values.startAt ? values.startAt.toISOString() : null,
        endAt: values.endAt ? values.endAt.toISOString() : null,
      };

      if (
        duLieuGui.type === "PERCENT" &&
        (duLieuGui.amount <= 0 || duLieuGui.amount > 100)
      ) {
        notification.error({ message: "Phần trăm phải trong khoảng 1..100" });
        return;
      }

      setDangGui(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/vouchers/${data._id}`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify(duLieuGui),
        }
      );
      const duLieu = await res.json();

      if (duLieu?.data?._id) {
        notification.success({ message: "Cập nhật voucher thành công" });
        onClose();
        onUpdated();
      } else {
        notification.error({
          message: duLieu?.message || "Cập nhật voucher thất bại",
        });
      }
    } catch (e: any) {
      if (e?.errorFields) return;
      notification.error({ message: e?.message || "Lỗi khi cập nhật voucher" });
    } finally {
      setDangGui(false);
    }
  };

  return (
    <Modal
      open={open}
      title={`Cập nhật Voucher: ${data?.code ?? ""}`}
      onCancel={onClose}
      onOk={xuLySubmit}
      confirmLoading={dangGui}
      okText="Cập nhật"
      cancelText="Hủy"
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="code"
          label="Mã voucher"
          rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="type"
          label="Loại voucher"
          rules={[{ required: true }]}
        >
          <Select options={luaChonLoai} />
        </Form.Item>
        <Form.Item
          name="amount"
          label={loai === "PERCENT" ? "Phần trăm giảm (%)" : "Số tiền giảm"}
          rules={[{ required: true, message: "Vui lòng nhập giá trị" }]}
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        {loai === "PERCENT" && (
          <Form.Item name="maxDiscount" label="Giảm tối đa (tùy chọn)">
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>
        )}
        <Form.Item name="minOrder" label="Đơn hàng tối thiểu (tùy chọn)">
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="totalUses"
          label="Tổng số lần sử dụng (0 = không giới hạn)"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item
          name="userUsageLimit"
          label="Giới hạn mỗi user (0 = không giới hạn)"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="Ngày bắt đầu" name="startAt">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item label="Ngày kết thúc" name="endAt">
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
