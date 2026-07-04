"use client";

import {
  ShoppingCartOutlined,
  TeamOutlined,
  AppstoreOutlined,
  DollarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Card, Col, Row, Statistic, Spin, Grid } from "antd";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";

const { useBreakpoint } = Grid;

type DashboardStats = {
  countUser: number;
  countOrder: number;
  countProduct: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  canceledOrders: number;
  lowStockProducts: number;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value || 0);

const getList = <T,>(res: any): T[] => {
  if (Array.isArray(res?.data?.result)) return res.data.result;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.result)) return res.result;
  if (Array.isArray(res)) return res;
  return [];
};

const getTotal = (res: any, listLength: number) => {
  return Number(res?.data?.meta?.total ?? res?.meta?.total ?? listLength ?? 0);
};

// helper: convert hex to rgba
const hexToRgba = (hex: string, alpha = 1) => {
  try {
    let h = hex.replace("#", "");
    if (h.length === 3) {
      h = h
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const bigint = parseInt(h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return `rgba(0,0,0,${alpha})`;
  }
};

const OVCard = () => {
  const [dataDashboard, setDataDashboard] = useState<DashboardStats>({
    countOrder: 0,
    countUser: 0,
    countProduct: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    canceledOrders: 0,
    lowStockProducts: 0,
  });

  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  useEffect(() => {
    const controller = new AbortController();

    const fetchJson = async (url: string) => {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("access_token") || ""
          : "";

      const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          ...(pureToken ? { Authorization: `Bearer ${pureToken}` } : {}),
        },
      });

      return res.json();
    };

    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const base = process.env.NEXT_PUBLIC_BACKEND_URL;

        const [usersRes, ordersRes, productsRes] = await Promise.all([
          fetchJson(`${base}/users?current=1&pageSize=9999`),
          fetchJson(`${base}/orders?current=1&pageSize=9999`),
          fetchJson(`${base}/products?current=1&pageSize=9999`),
        ]);

        const users = getList<IUser>(usersRes);
        const orders = getList<IOrder>(ordersRes);
        const products = getList<IProduct>(productsRes);

        const completedOrders = orders.filter((order) =>
          ["COMPLETED", "PAID", "SHIPPED"].includes(
            String(order.status || "").toUpperCase()
          )
        );

        const totalRevenue = completedOrders.reduce((sum, order) => {
          const finalTotal = Number(order.finalTotal ?? 0);
          const totalPrice = Number(order.totalPrice ?? 0);
          return sum + (finalTotal > 0 ? finalTotal : totalPrice);
        }, 0);

        setDataDashboard({
          countUser: getTotal(usersRes, users.length),
          countOrder: getTotal(ordersRes, orders.length),
          countProduct: getTotal(productsRes, products.length),
          totalRevenue,
          pendingOrders: orders.filter(
            (order) => String(order.status || "").toUpperCase() === "PENDING"
          ).length,
          completedOrders: orders.filter(
            (order) => String(order.status || "").toUpperCase() === "COMPLETED"
          ).length,
          canceledOrders: orders.filter(
            (order) => String(order.status || "").toUpperCase() === "CANCELED"
          ).length,
          lowStockProducts: products.filter(
            (product) => Number(product.stock || 0) <= 5
          ).length,
        });
      } catch (err) {
        if ((err as any)?.name !== "AbortError") {
          console.error("Error fetching dashboard:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    return () => controller.abort();
  }, []);

  const formatter = (value: string | number) => (
    <CountUp end={Number(value)} separator="," />
  );

  const valueStyle = useMemo(
    () => ({
      fontSize: isMobile ? 21 : 26,
      lineHeight: 1.1,
      fontWeight: 900,
    }),
    [isMobile]
  );

  const cards = [
    {
      title: "Tổng Users",
      value: dataDashboard.countUser,
      color: "#00ffe0",
      icon: <TeamOutlined />,
    },
    {
      title: "Tổng Đơn hàng",
      value: dataDashboard.countOrder,
      color: "#ff7a00",
      icon: <ShoppingCartOutlined />,
    },
    {
      title: "Tổng Sản phẩm",
      value: dataDashboard.countProduct,
      color: "#ff4d4f",
      icon: <AppstoreOutlined />,
    },
    {
      title: "Doanh thu",
      value: dataDashboard.totalRevenue,
      color: "#00c781",
      icon: <DollarOutlined />,
      currency: true,
    },
    {
      title: "Đơn chờ xử lý",
      value: dataDashboard.pendingOrders,
      color: "#facc15",
      icon: <ClockCircleOutlined />,
    },
    {
      title: "Đơn hoàn tất",
      value: dataDashboard.completedOrders,
      color: "#00ffe0",
      icon: <CheckCircleOutlined />,
    },
    {
      title: "Đơn đã hủy",
      value: dataDashboard.canceledOrders,
      color: "#ff4d4f",
      icon: <CloseCircleOutlined />,
    },
    {
      title: "Sắp hết hàng",
      value: dataDashboard.lowStockProducts,
      color: "#ff85c0",
      icon: <WarningOutlined />,
    },
  ];

  return (
    <div className="gz-dashboard-stats">
      <Spin spinning={loading} size={isMobile ? "small" : "default"}>
        <Row gutter={[16, 16]}>
          {cards.map((item) => (
            <Col key={item.title} xs={24} sm={12} lg={6}>
              <Card
                variant="borderless"
                size={isMobile ? "small" : "default"}
                className="gz-stat-card"
              >
                <div
                  className="gz-stat-card-inner"
                  style={{
                    // set css variable for accent color so CSS can use it in hover/shadow
                    // also compute a subtle shadow inline for better cross-browser look
                    boxShadow: `0 10px 28px ${hexToRgba(item.color, 0.06)}`,
                  }}
                >
                  <div
                    className="gz-stat-badge"
                    style={{
                      background: item.color,
                      boxShadow: `0 6px 18px ${hexToRgba(item.color, 0.12)}`,
                    }}
                    aria-hidden
                  />
                  <div className="gz-stat-icon-wrapper" aria-hidden>
                    <span className="gz-stat-icon-inner">{item.icon}</span>
                  </div>

                  <Statistic
                    title={<span>{item.title}</span>}
                    value={item.value}
                    formatter={
                      item.currency
                        ? (value) => formatCurrency(Number(value))
                        : formatter
                    }
                    valueStyle={{
                      ...valueStyle,
                      color: item.color,
                    }}
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      <style jsx global>{`
        .gz-dashboard-stats {
          width: 100%;
        }

        .gz-stat-card {
          height: 100%;
          border-radius: 16px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid #2a2d2e !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22) !important;
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease;
          overflow: visible;
        }

        .gz-stat-card:hover {
          transform: translateY(-4px);
          border-color: var(--accent, #00ffe0) !important;
        }

        .gz-stat-card .ant-card-body {
          height: 100%;
          padding: 18px !important;
        }

        .gz-stat-card-inner {
          min-height: 92px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-align: center;
          position: relative;
          padding: 18px;
          box-sizing: border-box;
          background: transparent;
        }

        /* small colored badge (top-left) */
        .gz-stat-badge {
          position: absolute;
          top: 12px;
          left: 12px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transform: translateZ(0);
        }

        /* icon wrapper (optional) */
        .gz-stat-icon-wrapper {
          position: absolute;
          top: 8px;
          right: 12px;
          width: 36px;
          height: 36px;
          display: grid;
          place-items: center;
          border-radius: 10px;
        }

        .gz-stat-icon-inner :global(svg) {
          color: rgba(255, 255, 255, 0.9);
          font-size: 18px;
        }

        .gz-stat-icon {
          display: none !important;
        }

        .gz-stat-card .ant-statistic {
          width: 100%;
          text-align: center !important;
        }

        .gz-stat-card .ant-statistic-title {
          margin-bottom: 8px !important;
          color: #b8c0cc !important;
          font-size: 13px !important;
          font-weight: 800 !important;
          line-height: 1.35 !important;
          text-align: center !important;
        }

        .gz-stat-card .ant-statistic-content {
          width: 100%;
          color: #ffffff !important;
          line-height: 1.2 !important;
          text-align: center !important;
        }

        .gz-stat-card .ant-statistic-content-value {
          color: #ffffff !important;
          font-size: 26px !important;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          text-align: center !important;
        }

        .gz-stat-card .ant-statistic-content-prefix,
        .gz-stat-card .ant-statistic-content-suffix {
          color: var(--accent, #00ffe0) !important;
          font-weight: 900 !important;
        }

        .gz-dashboard-stats .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-dashboard-stats .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        /* Hover accent: apply subtle glow using inline badge color */
        .gz-stat-card:hover .gz-stat-card-inner {
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.32);
        }

        @media (max-width: 768px) {
          .gz-stat-card {
            border-radius: 14px !important;
          }

          .gz-stat-card .ant-card-body {
            padding: 14px !important;
          }

          .gz-stat-card-inner {
            min-height: 82px;
            gap: 7px;
            padding: 14px;
          }

          .gz-stat-card .ant-statistic-title {
            font-size: 12px !important;
          }

          .gz-stat-card .ant-statistic-content-value {
            font-size: 22px !important;
          }

          .gz-stat-icon-wrapper {
            top: 10px;
            right: 10px;
            width: 32px;
            height: 32px;
          }

          .gz-stat-badge {
            top: 10px;
            left: 10px;
            width: 11px;
            height: 11px;
          }
        }

        @media (max-width: 420px) {
          .gz-stat-card-inner {
            min-height: 78px;
            padding: 12px;
          }

          .gz-stat-card .ant-statistic-content-value {
            font-size: 21px !important;
          }

          .gz-stat-icon-wrapper {
            display: none;
          }

          .gz-stat-card-inner {
            min-height: 92px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 8px;
            text-align: center;
            position: relative;
            padding: 18px;
            box-sizing: border-box;
            background: transparent;
          }
        }
      `}</style>
    </div>
  );
};

export default OVCard;
