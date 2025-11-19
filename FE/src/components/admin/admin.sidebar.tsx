"use client";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  HomeOutlined,
  MailOutlined,
  OrderedListOutlined,
  ProductFilled,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useContext, useMemo } from "react";
import { AdminContext } from "@/lib/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TicketCheckIcon } from "lucide-react";

type MenuItem = Required<MenuProps>["items"][number];

const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(AdminContext)!;
  const pathname = usePathname();

  const selectedKey = useMemo(() => {
    if (pathname?.startsWith("/dashboard/users")) return "users";
    if (pathname?.startsWith("/dashboard/products")) return "products";
    if (pathname?.startsWith("/dashboard/orders")) return "orders";
    if (pathname?.startsWith("/dashboard/comments")) return "comments";
    if (pathname?.startsWith("/dashboard/vouchers")) return "vouchers";
    if (pathname === "/dashboard") return "dashboard";
    return "home";
  }, [pathname]);

  const items: MenuItem[] = [
    {
      key: "grp",
      type: "group",
      children: [
        {
          key: "home",
          icon: <HomeOutlined />,
          label: <Link href="/">Trang chủ</Link>,
        },
        {
          key: "dashboard",
          icon: <AppstoreOutlined />,
          label: <Link href="/dashboard">Bảng điều khiển</Link>,
        },
        {
          key: "users",
          icon: <TeamOutlined />,
          label: <Link href="/dashboard/users">Quản lý người dùng</Link>,
        },
        {
          key: "products",
          icon: <ProductFilled />,
          label: <Link href="/dashboard/products">Quản lý sản phẩm</Link>,
        },
        {
          key: "orders",
          icon: <OrderedListOutlined />,
          label: <Link href="/dashboard/orders">Quản lý đơn hàng</Link>,
        },

        {
          key: "vouchers",
          icon: <TicketCheckIcon />,
          label: <Link href="/dashboard/vouchers">Quản lý voucher</Link>,
        },

        {
          type: "divider",
        },
        // Nhóm Feedback
        {
          key: "feedback",
          label: "Phản hồi",
          icon: <MailOutlined />,
          children: [
            {
              key: "comments",
              label: <Link href="/dashboard/comments">Quản lý đánh giá</Link>,
            },
          ],
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={["feedback", "nav2", "nav3"]}
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
