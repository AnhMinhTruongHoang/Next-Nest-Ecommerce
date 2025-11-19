"use client";

import { Card, Col, Row, Statistic, Spin, Grid } from "antd";
import { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";

const API_BASE = "http://localhost:8000/api/v1";
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
          fetch(`${API_BASE}/users?current=1&pageSize=9999`, {
            signal: controller.signal,
          }).then((r) => r.json()),
          fetch(`${API_BASE}/orders?current=1&pageSize=9999`, {
            signal: controller.signal,
          }).then((r) => r.json()),
          fetch(`${API_BASE}/products?current=1&pageSize=9999`, {
            signal: controller.signal,
          }).then((r) => r.json()),
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
            style={{
              padding: isMobile ? 12 : 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: isMobile ? 96 : 120,
              textAlign: "center",
              height: "100%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              borderRadius: 12,
            }}
          >
            <Statistic
              title={titleNode("Tổng Users")}
              value={dataDashboard.countUser}
              formatter={formatter}
              valueStyle={valueStyle}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            variant="borderless"
            size={isMobile ? "small" : "default"}
            style={{
              padding: isMobile ? 12 : 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: isMobile ? 96 : 120,
              textAlign: "center",
              height: "100%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              borderRadius: 12,
            }}
          >
            <Statistic
              title={titleNode("Tổng Đơn hàng")}
              value={dataDashboard.countOrder}
              formatter={formatter}
              valueStyle={valueStyle}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            variant="borderless"
            size={isMobile ? "small" : "default"}
            style={{
              padding: isMobile ? 12 : 20,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: isMobile ? 96 : 120,
              textAlign: "center",
              height: "100%",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              borderRadius: 12,
            }}
          >
            <Statistic
              title={titleNode("Tổng Sản phẩm")}
              value={dataDashboard.countBook}
              formatter={formatter}
              valueStyle={valueStyle}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default OVCard;
