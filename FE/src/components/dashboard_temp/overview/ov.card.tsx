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
                <div className="gz-stat-card-inner">
                  <div
                    className="gz-stat-icon"
                    style={{
                      color: item.color,
                      backgroundColor: `${item.color}18`,
                    }}
                  >
                    {item.icon}
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
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22) !important;
          transition: transform 0.25s ease, border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .gz-stat-card:hover {
          transform: translateY(-4px);
          border-color: #00ffe0 !important;
          box-shadow: 0 12px 28px rgba(0, 255, 224, 0.12) !important;
        }

        .gz-stat-card .ant-card-body {
          padding: 18px !important;
        }

        .gz-stat-card-inner {
          display: flex;
          align-items: center;
          gap: 14px;
          min-height: 82px;
        }

        .gz-stat-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .gz-stat-card .ant-statistic-title {
          color: #b8b8b8 !important;
          font-weight: 700 !important;
          font-size: 13px !important;
          margin-bottom: 7px !important;
        }

        .gz-stat-card .ant-statistic-content {
          line-height: 1.2 !important;
        }

        .gz-dashboard-stats .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-dashboard-stats .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        @media (max-width: 768px) {
          .gz-stat-card {
            border-radius: 14px !important;
          }

          .gz-stat-card .ant-card-body {
            padding: 14px !important;
          }

          .gz-stat-card-inner {
            min-height: 72px;
            gap: 12px;
          }

          .gz-stat-icon {
            width: 40px;
            height: 40px;
            min-width: 40px;
            font-size: 19px;
            border-radius: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default OVCard;
