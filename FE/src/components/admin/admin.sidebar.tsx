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
import React, { useContext } from "react";
import { AdminContext } from "@/lib/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";

type MenuItem = Required<MenuProps>["items"][number];
const AdminSideBar = () => {
  const { Sider } = Layout;
  const { collapseMenu } = useContext(AdminContext)!;

  const items: MenuItem[] = [
    {
      key: "grp",

      type: "group",
      children: [
        {
          key: "home",
          icon: <HomeOutlined />,
          label: <Link href="/">HomePage</Link>,
        },
        {
          key: "dashboard",
          label: <Link href={"/dashboard"}>Dashboard</Link>,
          icon: <AppstoreOutlined />,
        },
        {
          key: "users",
          label: <Link href={"/dashboard/users"}>Manage Users</Link>,
          icon: <TeamOutlined />,
        },
        {
          key: "products",
          label: <Link href={"/dashboard/products"}>Manage Products</Link>,
          icon: <ProductFilled />,
        },
        {
          key: "orders",
          label: <Link href={"/dashboard/orders"}>Manage Orders</Link>,
          icon: <OrderedListOutlined />,
        },
        {
          key: "sub1",
          label: "Feedback",
          icon: <MailOutlined />,
          children: [
            {
              key: "g1",
              label: "Comments",
              type: "group",
              children: [
                {
                  key: "1",
                  label: (
                    <Link href={"/dashboard/comments"}>Manage Reviews</Link>
                  ),
                },
              ],
            },
            {
              key: "g2",
              label: "Rating",
              type: "group",
              children: [{ key: "2", label: "Manage Rating" }],
            },
          ],
        },
        {
          key: "sub2",
          label: "Navigation Two",
          icon: <AppstoreOutlined />,
          children: [
            { key: "5", label: "Option 5" },
            { key: "6", label: "Option 6" },
            {
              key: "sub3",
              label: "Submenu",
              children: [
                { key: "7", label: "Option 7" },
                { key: "8", label: "Option 8" },
              ],
            },
          ],
        },
        {
          type: "divider",
        },
        {
          key: "sub4",
          label: "Navigation Three",
          icon: <SettingOutlined />,
          children: [
            { key: "9", label: "Option 9" },
            { key: "10", label: "Option 10" },
            { key: "11", label: "Option 11" },
            { key: "12", label: "Option 12" },
          ],
        },
      ],
    },
  ];

  return (
    <Sider collapsed={collapseMenu}>
      <Menu
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        items={items}
        style={{ height: "100vh" }}
      />
    </Sider>
  );
};

export default AdminSideBar;
