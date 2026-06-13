"use client";

import { Card, Col, Row, Statistic, Spin, Grid } from "antd";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";

const { useBreakpoint } = Grid;

const OVCard = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countOrder: 0,
    countUser: 0,
    countBook: 0,
  });
  const [loading, setLoading] = useState(true);

  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  useEffect(() => {
    const controller = new AbortController();

    const fetchDashboardData = async () => {
      try {
        const [usersRes, ordersRes, booksRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?current=1&pageSize=9999`,
            {
              signal: controller.signal,
            }
          ).then((r) => r.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/orders?current=1&pageSize=9999`,
            {
              signal: controller.signal,
            }
          ).then((r) => r.json()),
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/products?current=1&pageSize=9999`,
            {
              signal: controller.signal,
            }
          ).then((r) => r.json()),
        ]);

        setDataDashboard({
          countUser: usersRes?.data?.result?.length ?? 0,
          countOrder: ordersRes?.data?.result?.length ?? 0,
          countBook: booksRes?.data?.result?.length ?? 0,
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

  // Tối ưu typography theo breakpoint
  const valueStyle = useMemo(
    () => ({ fontSize: isMobile ? 22 : 28, lineHeight: 1.1 }),
    [isMobile]
  );
  const titleNode = (text: string) => (
    <span style={{ fontSize: isMobile ? 12 : 14 }}>{text}</span>
  );

  return (
    <div className="gz-dashboard-stats">
      <Spin spinning={loading} size={isMobile ? "small" : "default"}>
        <Row
          gutter={[
            { xs: 12, sm: 16, md: 24, lg: 32 },
            { xs: 12, sm: 16, md: 24, lg: 32 },
          ]}
          wrap
        >
          <Col xs={24} sm={12} md={8}>
            <Card
              variant="borderless"
              size={isMobile ? "small" : "default"}
              className="gz-stat-card"
            >
              <Statistic
                title={titleNode("Tổng Users")}
                value={dataDashboard.countUser}
                formatter={formatter}
                valueStyle={{
                  ...valueStyle,
                  color: "#00ffe0",
                  fontWeight: 900,
                }}
              />
            </Card>
          </Col>
  
          <Col xs={24} sm={12} md={8}>
            <Card
              variant="borderless"
              size={isMobile ? "small" : "default"}
              className="gz-stat-card"
            >
              <Statistic
                title={titleNode("Tổng Đơn hàng")}
                value={dataDashboard.countOrder}
                formatter={formatter}
                valueStyle={{
                  ...valueStyle,
                  color: "#ff7a00",
                  fontWeight: 900,
                }}
              />
            </Card>
          </Col>
  
          <Col xs={24} sm={12} md={8}>
            <Card
              variant="borderless"
              size={isMobile ? "small" : "default"}
              className="gz-stat-card"
            >
              <Statistic
                title={titleNode("Tổng Sản phẩm")}
                value={dataDashboard.countBook}
                formatter={formatter}
                valueStyle={{
                  ...valueStyle,
                  color: "#ff4d4f",
                  fontWeight: 900,
                }}
              />
            </Card>
          </Col>
        </Row>
      </Spin>
  
      <style jsx global>{`
        .gz-dashboard-stats {
          width: 100%;
        }
  
        .gz-stat-card {
          height: 100%;
          min-height: 120px;
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
          min-height: 120px;
          padding: 20px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
        }
  
        .gz-stat-card .ant-statistic {
          width: 100%;
        }
  
        .gz-stat-card .ant-statistic-title {
          color: #b8b8b8 !important;
          font-weight: 700 !important;
          font-size: 14px !important;
          margin-bottom: 8px !important;
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
            min-height: 96px;
            border-radius: 14px !important;
          }
  
          .gz-stat-card .ant-card-body {
            min-height: 96px;
            padding: 14px !important;
          }
  
          .gz-stat-card .ant-statistic-title {
            font-size: 13px !important;
          }
  
          .gz-stat-card .ant-statistic-content-value {
            font-size: 22px !important;
          }
        }
  
        @media (max-width: 420px) {
          .gz-stat-card .ant-card-body {
            padding: 12px !important;
          }
  
          .gz-stat-card .ant-statistic-content-value {
            font-size: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default OVCard;
