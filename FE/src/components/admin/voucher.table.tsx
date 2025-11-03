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

const API_BASE = "http://localhost:8000/api/v1";

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
        `${API_BASE}/vouchers?current=${trangHienTai}&pageSize=${kichThuocTrang}`,
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
      const res = await fetch(`${API_BASE}/vouchers/${voucher._id}`, {
        method: "DELETE",
        headers,
      });
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
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
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
        <div style={{ padding: 8 }}>
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
            style={{ width: 188, marginBottom: 8, display: "block" }}
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
        <SearchOutlined style={{ color: daLoc ? "#1677ff" : undefined }} />
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      align: "center",
      render: (loai: TVoucherType) => (
        <Tag color={loai === "PERCENT" ? "blue" : "gold"}>{loai}</Tag>
      ),
    },
    {
      title: "Giá trị",
      dataIndex: "amount",
      align: "right",
      render: (giaTri, record) =>
        record.type === "PERCENT" ? `${giaTri}%` : giaTri.toLocaleString(),
    },
    {
      title: "Giảm tối đa",
      dataIndex: "maxDiscount",
      align: "right",
      render: (giaTri?: number) => (giaTri ? giaTri.toLocaleString() : "—"),
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minOrder",
      align: "right",
      render: (giaTri?: number) => (giaTri ? giaTri.toLocaleString() : "0"),
    },
    {
      title: "Kích hoạt",
      dataIndex: "isActive",
      align: "center",
      render: (isActive: boolean) =>
        isActive ? (
          <CheckOutlined style={{ color: "green" }} />
        ) : (
          <CloseOutlined style={{ color: "red" }} />
        ),
    },
    {
      title: "Đã dùng/Tổng",
      align: "center",
      render: (_, record) => (
        <span>
          <b>{record.usedCount ?? 0}</b> /{" "}
          {record.totalUses === 0 ? "∞" : record.totalUses}
        </span>
      ),
    },
    {
      title: "Thời gian hiệu lực",
      align: "center",
      render: (_, record) => {
        const batDau = record.startAt
          ? dayjs(record.startAt).format("DD/MM/YYYY")
          : "—";
        const ketThuc = record.endAt
          ? dayjs(record.endAt).format("DD/MM/YYYY")
          : "—";
        return (
          <span>
            {batDau} → {ketThuc}
          </span>
        );
      },
    },
    {
      title: "Thao tác",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
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
            <Button danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Spin spinning={dangTai}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2>Quản lý Voucher</h2>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => setMoModalTao(true)}
        >
          Thêm mới
        </Button>
      </div>

      <Table
        columns={cot}
        dataSource={danhSach}
        rowKey={"_id"}
        pagination={{
          current: meta.current,
          pageSize: meta.pageSize,
          total: meta.total,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} mục`,
          onChange: xuLyThayDoiTrang,
          showSizeChanger: true,
        }}
      />

      {/* Modal xem chi tiết */}
      <ModalXemVoucher
        open={moModalXem}
        onClose={() => setMoModalXem(false)}
        data={voucherXem}
      />

      {/* Modal tạo mới */}
      <ModalTaoVoucher
        open={moModalTao}
        onClose={() => setMoModalTao(false)}
        onCreated={() => layDuLieu(meta.current, meta.pageSize)}
        headers={headers}
      />

      {/* Modal cập nhật */}
      <ModalCapNhatVoucher
        open={moModalCapNhat}
        onClose={() => setMoModalCapNhat(false)}
        data={duLieuCapNhat}
        onUpdated={() => layDuLieu(meta.current, meta.pageSize)}
        headers={headers}
      />
    </Spin>
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
      const res = await fetch(`${API_BASE}/vouchers`, {
        method: "POST",
        headers,
        body: JSON.stringify(duLieuGui),
      });
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
      const res = await fetch(`${API_BASE}/vouchers/${data._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(duLieuGui),
      });
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
