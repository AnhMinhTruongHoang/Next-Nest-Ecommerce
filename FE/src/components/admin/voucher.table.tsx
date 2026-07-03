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
  Card,
  Empty,
  Grid,
  Pagination,
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

type GiaTriFormCapNhat = GiaTriFormTao;

const formatCurrencyVND = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Math.round(Number(value) || 0));

const formatDate = (value?: string | null) =>
  value ? dayjs(value).format("DD/MM/YYYY") : "—";

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

  const screens = Grid.useBreakpoint();
  const isMobile = !screens.md;

  const [voucherXem, setVoucherXem] = useState<IVoucher | null>(null);
  const [moModalXem, setMoModalXem] = useState(false);
  const [moModalTao, setMoModalTao] = useState(false);
  const [moModalCapNhat, setMoModalCapNhat] = useState(false);
  const [duLieuCapNhat, setDuLieuCapNhat] = useState<IVoucher | null>(null);

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

  const headers = useMemo(() => {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (accessToken) h.Authorization = accessToken;
    return h;
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      layDuLieu(meta.current, meta.pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const renderVoucherValue = (record: IVoucher) =>
    record.type === "PERCENT"
      ? `${record.amount}%`
      : formatCurrencyVND(record.amount);

  const renderVoucherStatus = (isActive: boolean) =>
    isActive ? (
      <Tag className="gz-voucher-status active">Active</Tag>
    ) : (
      <Tag className="gz-voucher-status inactive">Inactive</Tag>
    );

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
        <Tag
          className={`gz-voucher-type ${
            loai === "PERCENT" ? "percent" : "fixed"
          }`}
        >
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
          {record.type === "PERCENT" ? `${giaTri}%` : formatCurrencyVND(giaTri)}
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
          {giaTri ? formatCurrencyVND(giaTri) : "—"}
        </span>
      ),
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "minOrder",
      align: "right",
      width: 150,
      render: (giaTri?: number) => (
        <span className="gz-voucher-money">{formatCurrencyVND(giaTri)}</span>
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
      render: (_, record) => (
        <span className="gz-voucher-date">
          {formatDate(record.startAt)} → {formatDate(record.endAt)}
        </span>
      ),
    },
    {
      title: "Thao tác",
      align: "center",
      width: 190,
      fixed: "right",
      render: (_, record) => (
        <Space wrap>
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
            description="Bạn có chắc muốn xoá voucher này không?"
            onConfirm={() => xuLyXoa(record)}
            okText="Có"
            cancelText="Không"
            classNames={{ root: "gz-voucher-popconfirm" }}
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              className="gz-voucher-delete-btn"
            >
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

        {isMobile ? (
          <div className="gz-voucher-mobile-section">
            {danhSach.length > 0 ? (
              <div className="gz-voucher-mobile-list">
                {danhSach.map((voucher) => (
                  <Card key={voucher._id} className="gz-voucher-mobile-card">
                    <div className="gz-voucher-mobile-top">
                      <div className="gz-voucher-mobile-code-wrap">
                        <span className="gz-voucher-mobile-label">
                          Mã voucher
                        </span>
                        <strong className="gz-voucher-mobile-code">
                          {voucher.code}
                        </strong>
                      </div>

                      {renderVoucherStatus(voucher.isActive)}
                    </div>

                    <div className="gz-voucher-mobile-info">
                      <div className="gz-voucher-mobile-row">
                        <span>Loại</span>
                        <b>{voucher.type}</b>
                      </div>

                      <div className="gz-voucher-mobile-row">
                        <span>Giá trị</span>
                        <b className="gz-voucher-mobile-value">
                          {renderVoucherValue(voucher)}
                        </b>
                      </div>

                      <div className="gz-voucher-mobile-row">
                        <span>Giảm tối đa</span>
                        <b>
                          {voucher.maxDiscount
                            ? formatCurrencyVND(voucher.maxDiscount)
                            : "—"}
                        </b>
                      </div>

                      <div className="gz-voucher-mobile-row">
                        <span>Đơn tối thiểu</span>
                        <b>{formatCurrencyVND(voucher.minOrder)}</b>
                      </div>

                      <div className="gz-voucher-mobile-row">
                        <span>Đã dùng/Tổng</span>
                        <b>
                          {voucher.usedCount ?? 0} /{" "}
                          {voucher.totalUses === 0 ? "∞" : voucher.totalUses}
                        </b>
                      </div>

                      <div className="gz-voucher-mobile-row">
                        <span>Mỗi user</span>
                        <b>{voucher.userUsageLimit ?? 0}</b>
                      </div>

                      <div className="gz-voucher-mobile-row">
                        <span>Hiệu lực</span>
                        <b>
                          {formatDate(voucher.startAt)} →{" "}
                          {formatDate(voucher.endAt)}
                        </b>
                      </div>
                    </div>

                    <div className="gz-voucher-mobile-actions">
                      <Button
                        icon={<EyeOutlined />}
                        className="gz-voucher-view-btn"
                        onClick={() => {
                          setVoucherXem(voucher);
                          setMoModalXem(true);
                        }}
                      >
                        Xem
                      </Button>

                      <Button
                        icon={<EditOutlined />}
                        className="gz-voucher-edit-btn"
                        onClick={() => {
                          setDuLieuCapNhat(voucher);
                          setMoModalCapNhat(true);
                        }}
                      >
                        Sửa
                      </Button>

                      <Popconfirm
                        title="Xóa voucher này?"
                        description="Bạn có chắc muốn xoá voucher này không?"
                        onConfirm={() => xuLyXoa(voucher)}
                        okText="Có"
                        cancelText="Không"
                        classNames={{ root: "gz-voucher-popconfirm" }}
                      >
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          className="gz-voucher-delete-btn"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="gz-voucher-mobile-empty">
                <Empty description="Không có voucher" />
              </div>
            )}

            {meta.total > 0 && (
              <Pagination
                className="gz-voucher-mobile-pagination"
                current={meta.current}
                pageSize={meta.pageSize}
                total={meta.total}
                showSizeChanger={false}
                showLessItems
                onChange={(page) => xuLyThayDoiTrang(page, meta.pageSize)}
              />
            )}
          </div>
        ) : (
          <div className="gz-voucher-table-card">
            <Table<IVoucher>
              className="gz-voucher-admin-table"
              columns={cot}
              dataSource={danhSach}
              rowKey="_id"
              scroll={{ x: "max-content" }}
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
        )}

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
          position: relative;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
          padding: 16px 18px;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b;
          border: 1px solid rgba(0, 255, 224, 0.12);
          border-radius: 18px;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          overflow: hidden;
        }

        .gz-voucher-admin-header::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
              circle at top right,
              rgba(0, 255, 224, 0.13),
              transparent 34%
            ),
            radial-gradient(
              circle at bottom left,
              rgba(255, 77, 0, 0.11),
              transparent 36%
            );
        }

        .gz-voucher-admin-header > * {
          position: relative;
          z-index: 1;
        }

        .gz-voucher-admin-title {
          margin: 0;
          color: #ffffff;
          font-size: 26px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: -0.3px;
          text-align: center;
        }

        .gz-voucher-admin-subtitle {
          margin: 6px 0 0;
          color: #a3aab5;
          font-size: 13px;
          line-height: 1.4;
          font-weight: 500;
          text-align: center;
        }

        .gz-voucher-add-btn {
          height: 42px !important;
          border: none !important;
          border-radius: 13px !important;
          color: #ffffff !important;
          font-size: 13px !important;
          font-weight: 900 !important;
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          box-shadow: 0 10px 24px rgba(255, 77, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.18) !important;
        }

        .gz-voucher-add-btn:hover {
          background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
          color: #ffffff !important;
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

        .gz-voucher-status {
          margin: 0 !important;
          border-radius: 999px !important;
          font-weight: 800 !important;
          padding: 4px 10px !important;
        }

        .gz-voucher-status.active {
          background: rgba(0, 199, 129, 0.12) !important;
          color: #00c781 !important;
          border: 1px solid rgba(0, 199, 129, 0.35) !important;
        }

        .gz-voucher-status.inactive {
          background: rgba(255, 77, 79, 0.12) !important;
          color: #ff4d4f !important;
          border: 1px solid rgba(255, 77, 79, 0.35) !important;
        }

        .gz-voucher-view-btn,
        .gz-voucher-edit-btn {
          border-radius: 999px !important;
          font-weight: 800 !important;
          background: rgba(0, 255, 224, 0.08) !important;
          border: 1px solid rgba(0, 255, 224, 0.28) !important;
          color: #00ffe0 !important;
        }

        .gz-voucher-view-btn:hover,
        .gz-voucher-edit-btn:hover {
          background: rgba(0, 255, 224, 0.16) !important;
          color: #ffffff !important;
        }

        .gz-voucher-delete-btn {
          border-radius: 999px !important;
          font-weight: 800 !important;
          background: rgba(255, 77, 79, 0.1) !important;
          border-color: rgba(255, 77, 79, 0.55) !important;
          color: #ff4d4f !important;
        }

        .gz-voucher-delete-btn:hover {
          background: rgba(255, 77, 79, 0.22) !important;
          border-color: #ff4d4f !important;
          color: #ffffff !important;
        }

        .gz-voucher-mobile-section {
          width: 100%;
        }

        .gz-voucher-modal-title {
          width: 100%;
          text-align: center;
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
        }

        .gz-voucher-mobile-list {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        .gz-voucher-mobile-card {
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.01)
            ),
            #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 16px !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          color: #e5e7eb !important;
        }

        .gz-voucher-mobile-card .ant-card-body {
          padding: 14px !important;
        }

        .gz-voucher-mobile-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 12px;
        }

        .gz-voucher-mobile-code-wrap {
          min-width: 0;
          flex: 1;
        }

        .gz-voucher-mobile-label {
          display: block;
          margin-bottom: 4px;
          color: #8b949e;
          font-size: 12px;
          font-weight: 700;
        }

        .gz-voucher-mobile-code {
          display: block;
          color: #00ffe0;
          font-size: 16px;
          font-weight: 900;
          line-height: 1.35;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-voucher-mobile-info {
          display: grid;
          gap: 8px;
          padding: 10px;
          background: #111314;
          border: 1px solid #2a2d2e;
          border-radius: 12px;
        }

        .gz-voucher-mobile-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: #d1d5db;
        }

        .gz-voucher-mobile-row span {
          color: #8b949e;
          font-weight: 700;
        }

        .gz-voucher-mobile-row b {
          min-width: 0;
          color: #ffffff;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-voucher-mobile-value {
          color: #ffb020 !important;
          font-weight: 900 !important;
        }

        .gz-voucher-mobile-actions {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          margin-top: 12px;
        }

        .gz-voucher-mobile-actions .ant-btn {
          width: 100%;
          height: 38px;
          padding-inline: 6px !important;
        }

        .gz-voucher-mobile-empty {
          background: #181a1b;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          padding: 24px;
        }

        .gz-voucher-mobile-empty .ant-empty-description {
          color: #8b949e !important;
        }

        .gz-voucher-mobile-pagination {
          display: flex;
          justify-content: center;
          margin-top: 14px !important;
        }

        .gz-voucher-mobile-pagination .ant-pagination-item {
          background: #111314 !important;
          border-color: #303435 !important;
        }

        .gz-voucher-mobile-pagination .ant-pagination-item a {
          color: #e5e7eb !important;
        }

        .gz-voucher-mobile-pagination .ant-pagination-item-active {
          border-color: #00ffe0 !important;
        }

        .gz-voucher-mobile-pagination .ant-pagination-item-active a {
          color: #00ffe0 !important;
        }

        .gz-voucher-mobile-pagination .ant-pagination-prev button,
        .gz-voucher-mobile-pagination .ant-pagination-next button {
          background: #111314 !important;
          border-color: #303435 !important;
          color: #e5e7eb !important;
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
          background: #202324 !important;
          border-color: #303435 !important;
          color: #ffffff !important;
        }

        .gz-voucher-filter-dropdown .ant-input::placeholder {
          color: #8b949e !important;
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

        .gz-voucher-popconfirm .ant-popover-inner,
        .ant-popconfirm .ant-popover-inner {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 14px !important;
          box-shadow: 0 14px 32px rgba(0, 0, 0, 0.35) !important;
        }

        .gz-voucher-popconfirm .ant-popover-arrow::before {
          background: #181a1b !important;
        }

        .gz-voucher-popconfirm .ant-popconfirm-title,
        .gz-voucher-popconfirm .ant-popconfirm-description,
        .ant-popconfirm .ant-popover-title,
        .ant-popconfirm .ant-popover-inner-content {
          color: #ffffff !important;
        }

        .gz-voucher-admin-page .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-voucher-admin-page .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        @media (max-width: 768px) {
          .gz-voucher-admin-header {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 14px !important;
            padding: 16px !important;
            margin-bottom: 16px !important;
            border-radius: 18px !important;
          }

          .gz-voucher-admin-title {
            font-size: 20px !important;
          }

          .gz-voucher-admin-subtitle {
            font-size: 12px !important;
          }

          .gz-voucher-add-btn {
            width: 100% !important;
          }
        }
      @media (max-width: 420px) {
  .gz-voucher-admin-title {
    font-size: 19px !important;
  }

  .gz-voucher-mobile-row {
    font-size: 12px;
  }

  .gz-voucher-mobile-code {
    font-size: 15px;
  }

  .gz-voucher-mobile-actions {
    grid-template-columns: 1fr;
  }
}

          /* ================= VOUCHER MODAL SYNC STYLE ================= */

          .gz-voucher-modal-root .ant-modal {
            max-width: calc(100vw - 24px) !important;
          }

          .gz-voucher-modal-root .ant-modal-content {
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.045),
                rgba(255, 255, 255, 0.012)
              ),
              #181a1b !important;
            border: 1px solid rgba(0, 255, 224, 0.12) !important;
            border-radius: 20px !important;
            box-shadow: 0 24px 70px rgba(0, 0, 0, 0.55) !important;
            overflow: hidden;
          }

          .gz-voucher-modal-root .ant-modal-header {
            padding: 20px 24px 16px !important;
            margin: 0 !important;
            background: transparent !important;
            border-bottom: 1px solid #2a2d2e !important;
          }

          .gz-voucher-modal-root .ant-modal-body {
            padding: 18px 24px 10px !important;
            max-height: 72vh;
            overflow-y: auto;
          }

          .gz-voucher-modal-root .ant-modal-footer {
            padding: 14px 24px 18px !important;
            margin: 0 !important;
            border-top: 1px solid #2a2d2e !important;
          }

          .gz-voucher-modal-root .ant-modal-close {
            color: #e5e7eb !important;
          }

          .gz-voucher-modal-root .ant-modal-close:hover {
            color: #00ffe0 !important;
            background: rgba(0, 255, 224, 0.08) !important;
          }

          .gz-voucher-modal-root .ant-modal-title {
            width: 100%;
          }

          .gz-voucher-modal-title-wrap {
            width: 100%;
            padding: 0 34px;
            text-align: center;
          }

          .gz-voucher-modal-eyebrow {
            display: block;
            margin: 0 0 6px;
            color: #00ffe0;
            font-size: 10px;
            font-weight: 900;
            line-height: 1.2;
            letter-spacing: 0.9px;
            text-transform: uppercase;
            text-align: center;
          }

          .gz-voucher-modal-title-wrap h3 {
            margin: 0;
            color: #ffffff;
            font-size: 22px;
            font-weight: 900;
            line-height: 1.25;
            text-align: center;
          }

          .gz-voucher-modal-title-wrap p {
            margin: 7px auto 0;
            max-width: 420px;
            color: #a3aab5;
            font-size: 13px;
            font-weight: 500;
            line-height: 1.4;
            text-align: center;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .gz-voucher-modal-form .ant-form-item {
            margin-bottom: 14px !important;
          }

          .gz-voucher-modal-form .ant-form-item:last-child {
            margin-bottom: 0 !important;
          }

          .gz-voucher-modal-form .ant-form-item-label {
            padding-bottom: 6px !important;
          }

          .gz-voucher-modal-form .ant-form-item-label > label {
            color: #e5e7eb !important;
            font-size: 13px !important;
            font-weight: 800 !important;
          }

          .gz-voucher-modal-form .ant-form-item-required::before {
            color: #ff4d4f !important;
          }

          .gz-voucher-modal-form .ant-form-item-explain-error {
            color: #ff7875 !important;
            font-size: 12px !important;
            margin-top: 4px !important;
          }

          .gz-voucher-modal-root .ant-input,
          .gz-voucher-modal-root textarea.ant-input,
          .gz-voucher-modal-root .ant-input-number,
          .gz-voucher-modal-root .ant-select-selector,
          .gz-voucher-modal-root .ant-picker {
            background: linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.055),
                rgba(255, 255, 255, 0.025)
              ),
              #242829 !important;
            border: 1px solid #3a4042 !important;
            color: #f3f4f6 !important;
            border-radius: 12px !important;
            box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035) !important;
          }

          .gz-voucher-modal-root .ant-input:hover,
          .gz-voucher-modal-root .ant-input:focus,
          .gz-voucher-modal-root textarea.ant-input:hover,
          .gz-voucher-modal-root textarea.ant-input:focus,
          .gz-voucher-modal-root .ant-input-number:hover,
          .gz-voucher-modal-root .ant-input-number-focused,
          .gz-voucher-modal-root .ant-select:hover .ant-select-selector,
          .gz-voucher-modal-root .ant-select-focused .ant-select-selector,
          .gz-voucher-modal-root .ant-picker:hover,
          .gz-voucher-modal-root .ant-picker-focused {
            background: #2a2f31 !important;
            border-color: rgba(0, 255, 224, 0.65) !important;
            box-shadow: 0 0 0 2px rgba(0, 255, 224, 0.09),
              inset 0 1px 0 rgba(255, 255, 255, 0.045) !important;
          }

          .gz-voucher-modal-root .ant-input::placeholder,
          .gz-voucher-modal-root textarea.ant-input::placeholder,
          .gz-voucher-modal-root .ant-select-selection-placeholder,
          .gz-voucher-modal-root .ant-picker-input > input::placeholder,
          .gz-voucher-modal-root .ant-input-number-input::placeholder {
            color: #9ca3af !important;
            opacity: 1 !important;
            font-weight: 500 !important;
          }

          .gz-voucher-modal-root .ant-input-number-input,
          .gz-voucher-modal-root .ant-select-selection-item,
          .gz-voucher-modal-root .ant-picker-input > input {
            color: #f9fafb !important;
          }

          .gz-voucher-modal-root .ant-select-arrow,
          .gz-voucher-modal-root .ant-picker-suffix,
          .gz-voucher-modal-root .ant-input-number-handler-up-inner,
          .gz-voucher-modal-root .ant-input-number-handler-down-inner {
            color: #9ca3af !important;
          }

          .gz-voucher-modal-root .ant-input-number-handler-wrap {
            background: #2a2f31 !important;
            border-start-end-radius: 12px !important;
            border-end-end-radius: 12px !important;
          }

          .gz-voucher-modal-root .ant-input-number-handler {
            border-color: #3a4042 !important;
          }

          .gz-voucher-modal-root .ant-switch {
            background: #3a4042 !important;
          }

          .gz-voucher-modal-root .ant-switch.ant-switch-checked {
            background: linear-gradient(135deg, #00d5c0, #00b894) !important;
          }

          .gz-voucher-modal-select-dropdown,
          .gz-voucher-modal-root .ant-picker-dropdown {
            background: #181a1b !important;
            border: 1px solid #2a2d2e !important;
            border-radius: 12px !important;
          }

          .gz-voucher-modal-select-dropdown .ant-select-item {
            color: #e5e7eb !important;
          }

          .gz-voucher-modal-select-dropdown .ant-select-item-option-active,
          .gz-voucher-modal-select-dropdown .ant-select-item-option-selected {
            background: rgba(0, 255, 224, 0.1) !important;
            color: #00ffe0 !important;
          }

          .gz-voucher-modal-root .ant-picker-panel-container {
            background: #181a1b !important;
            border: 1px solid #2a2d2e !important;
            border-radius: 12px !important;
          }

          .gz-voucher-modal-root .ant-picker-header,
          .gz-voucher-modal-root .ant-picker-content th,
          .gz-voucher-modal-root .ant-picker-cell {
            color: #e5e7eb !important;
          }

          .gz-voucher-modal-root .ant-picker-cell-inner {
            color: inherit !important;
          }

          .gz-voucher-modal-root
            .ant-picker-cell-selected
            .ant-picker-cell-inner {
            background: #00b894 !important;
            color: #ffffff !important;
          }

          .gz-voucher-modal-root
            .ant-picker-cell-today
            .ant-picker-cell-inner::before {
            border-color: #00ffe0 !important;
          }

          .gz-voucher-modal-root .ant-picker-header button {
            color: #e5e7eb !important;
          }

          .gz-voucher-modal-ok-btn {
            height: 40px !important;
            border: none !important;
            border-radius: 12px !important;
            color: #ffffff !important;
            font-weight: 900 !important;
            background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
            box-shadow: 0 10px 24px rgba(255, 77, 0, 0.24) !important;
          }

          .gz-voucher-modal-ok-btn:hover {
            background: linear-gradient(135deg, #ff6a00, #ff9a00) !important;
            color: #ffffff !important;
          }

          .gz-voucher-modal-cancel-btn {
            height: 40px !important;
            border-radius: 12px !important;
            background: #111314 !important;
            border-color: #303435 !important;
            color: #e5e7eb !important;
            font-weight: 800 !important;
          }

          .gz-voucher-modal-cancel-btn:hover {
            border-color: #00ffe0 !important;
            color: #00ffe0 !important;
          }

          /* View voucher modal content */
          .gz-voucher-modal-root .ant-space {
            color: #e5e7eb !important;
          }

          .gz-voucher-modal-root .ant-space b {
            color: #ffffff !important;
          }

          .gz-voucher-modal-root .ant-tag {
            border-radius: 999px !important;
            font-weight: 800 !important;
          }

          @media (max-width: 768px) {
            .gz-voucher-modal-root .ant-modal {
              top: 12px !important;
              max-width: calc(100vw - 20px) !important;
            }

            .gz-voucher-modal-root .ant-modal-header {
              padding: 18px 16px 14px !important;
            }

            .gz-voucher-modal-root .ant-modal-body {
              padding: 14px 16px 8px !important;
              max-height: 72vh;
            }

            .gz-voucher-modal-root .ant-modal-footer {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 10px;
              padding: 12px 16px 16px !important;
            }

            .gz-voucher-modal-root .ant-modal-footer .ant-btn {
              width: 100%;
              margin-inline-start: 0 !important;
            }

            .gz-voucher-modal-title-wrap {
              padding: 0 30px;
            }

            .gz-voucher-modal-title-wrap h3 {
              font-size: 20px;
            }

            .gz-voucher-modal-title-wrap p {
              max-width: 260px;
              font-size: 12px;
            }
          }

          @media (max-width: 420px) {
            .gz-voucher-modal-title-wrap {
              padding: 0 26px;
            }

            .gz-voucher-modal-eyebrow {
              font-size: 10px;
            }

            .gz-voucher-modal-title-wrap h3 {
              font-size: 18px;
            }

            .gz-voucher-modal-title-wrap p {
              max-width: 210px;
              font-size: 12px;
            }

            .gz-voucher-modal-root .ant-modal-footer {
              grid-template-columns: 1fr;
            }
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
      title={
        <div className="gz-voucher-modal-title-wrap">
          <span className="gz-voucher-modal-eyebrow">Voucher Management</span>
          <h3>Chi tiết Voucher</h3>
          <p>{data?.code || "Thông tin mã giảm giá"}</p>
        </div>
      }
      width={520}
      centered
      rootClassName="gz-voucher-modal-root"
      footer={[
        <Button
          key="close"
          onClick={onClose}
          className="gz-voucher-modal-ok-btn"
        >
          Đóng
        </Button>,
      ]}
    >
      {data ? (
        <Space direction="vertical" style={{ width: "100%" }}>
          <Space>
            <b>Loại:</b>
            <Tag color={data.type === "PERCENT" ? "blue" : "gold"}>
              {data.type}
            </Tag>
          </Space>

          <Space>
            <b>Giá trị:</b>
            {data.type === "PERCENT"
              ? `${data.amount}%`
              : formatCurrencyVND(data.amount)}
          </Space>

          <Space>
            <b>Giảm tối đa:</b>
            {data.maxDiscount ? formatCurrencyVND(data.maxDiscount) : "—"}
          </Space>

          <Space>
            <b>Đơn tối thiểu:</b>
            {formatCurrencyVND(data.minOrder)}
          </Space>

          <Space>
            <b>Kích hoạt:</b>
            {data.isActive ? (
              <CheckOutlined style={{ color: "#00c781" }} />
            ) : (
              <CloseOutlined style={{ color: "#ff4d4f" }} />
            )}
          </Space>

          <Space>
            <b>Đã dùng/Tổng:</b>
            <span>
              <b>{data.usedCount ?? 0}</b> /{" "}
              {data.totalUses === 0 ? "∞" : data.totalUses}
            </span>
          </Space>

          <Space>
            <b>Giới hạn mỗi user:</b>
            {data.userUsageLimit ?? 0}
          </Space>

          <Space>
            <b>Thời gian hiệu lực:</b>
            {formatDate(data.startAt)} → {formatDate(data.endAt)}
          </Space>

          <Space>
            <b>Cập nhật lúc:</b>
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
      if (e?.errorFields) return;
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
      title={
        <div className="gz-voucher-modal-title-wrap">
          <span className="gz-voucher-modal-eyebrow">Voucher Management</span>
          <h3>Tạo Voucher</h3>
          <p>Tạo mã giảm giá, điều kiện sử dụng và thời gian hiệu lực</p>
        </div>
      }
      onCancel={onClose}
      onOk={xuLySubmit}
      confirmLoading={dangGui}
      okText="Tạo"
      cancelText="Hủy"
      destroyOnHidden
      centered
      width={620}
      rootClassName="gz-voucher-modal-root"
      okButtonProps={{ className: "gz-voucher-modal-ok-btn" }}
      cancelButtonProps={{ className: "gz-voucher-modal-cancel-btn" }}
    >
      <Form
        form={form}
        layout="vertical"
        preserve={false}
        className="gz-voucher-modal-form"
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
          rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
        >
          <Select
            options={luaChonLoai}
            placeholder="Chọn loại voucher"
            classNames={{
              popup: {
                root: "gz-voucher-modal-select-dropdown",
              },
            }}
          />
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
          <Form.Item name="maxDiscount" label="Giảm tối đa">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập số tiền tối đa"
            />
          </Form.Item>
        )}

        <Form.Item name="minOrder" label="Đơn hàng tối thiểu">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá trị tối thiểu"
          />
        </Form.Item>

        <Form.Item
          name="totalUses"
          label="Tổng số lần sử dụng"
          tooltip="Nhập 0 nếu không giới hạn"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="userUsageLimit"
          label="Giới hạn mỗi user"
          tooltip="Nhập 0 nếu không giới hạn"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
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
      destroyOnHidden
      forceRender
      centered
      title={
        <div className="gz-voucher-modal-title-wrap">
          <span className="gz-voucher-modal-eyebrow">Voucher Management</span>
          <h3>Cập nhật Voucher</h3>
          <p>{data?.code || "Chỉnh sửa mã giảm giá"}</p>
        </div>
      }
      onCancel={onClose}
      onOk={xuLySubmit}
      confirmLoading={dangGui}
      okText="Cập nhật"
      cancelText="Hủy"
      width={620}
      rootClassName="gz-voucher-modal-root"
      okButtonProps={{ className: "gz-voucher-modal-ok-btn" }}
      cancelButtonProps={{ className: "gz-voucher-modal-cancel-btn" }}
    >
      <Form form={form} layout="vertical" className="gz-voucher-modal-form">
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
          rules={[{ required: true, message: "Vui lòng chọn loại voucher" }]}
        >
          <Select options={luaChonLoai} placeholder="Chọn loại voucher" />
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
          <Form.Item name="maxDiscount" label="Giảm tối đa">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập số tiền tối đa"
            />
          </Form.Item>
        )}

        <Form.Item name="minOrder" label="Đơn hàng tối thiểu">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá trị tối thiểu"
          />
        </Form.Item>

        <Form.Item
          name="totalUses"
          label="Tổng số lần sử dụng"
          tooltip="Nhập 0 nếu không giới hạn"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="userUsageLimit"
          label="Giới hạn mỗi user"
          tooltip="Nhập 0 nếu không giới hạn"
        >
          <InputNumber min={0} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="isActive" label="Kích hoạt" valuePropName="checked">
          <Switch checkedChildren="ON" unCheckedChildren="OFF" />
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
