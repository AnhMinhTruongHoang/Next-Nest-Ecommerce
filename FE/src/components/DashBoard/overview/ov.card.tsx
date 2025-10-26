"use client";

import { Card, Col, Row, Statistic, Spin } from "antd";
import { useEffect, useState } from "react";
import CountUp from "react-countup";

const API_BASE = "http://localhost:8000/api/v1";

const OVCard = () => {
  const [dataDashboard, setDataDashboard] = useState({
    countOrder: 0,
    countUser: 0,
    countBook: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [usersRes, ordersRes, booksRes] = await Promise.all([
          fetch(`${API_BASE}/users?current=1&pageSize=9999`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE}/orders?current=1&pageSize=9999`).then((r) =>
            r.json()
          ),
          fetch(`${API_BASE}/products?current=1&pageSize=9999`).then((r) =>
            r.json()
          ),
        ]);

        setDataDashboard({
          countUser: usersRes?.data?.result?.length || 0,
          countOrder: ordersRes?.data?.result?.length || 0,
          countBook: booksRes?.data?.result?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatter = (value: string | number) => (
    <CountUp end={Number(value)} separator="," />
  );

  return (
    <Spin spinning={loading}>
      <Row gutter={[40, 40]}>
        <Col span={8}>
          <Card
            variant="borderless"
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Statistic
              title="Tổng Users"
              value={dataDashboard.countUser}
              formatter={formatter}
            />
          </Card>
        </Col>

        <Col span={8}>
          <Card
            variant="borderless"
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Statistic
              title="Tổng Đơn hàng"
              value={dataDashboard.countOrder}
              formatter={formatter}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            variant="borderless"
            style={{
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Statistic
              title="Tổng Sản phẩm"
              value={dataDashboard.countBook}
              formatter={formatter}
            />
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default OVCard;
