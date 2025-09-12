"use client";

import React from "react";
import { Layout, Input, Avatar, Badge, Dropdown, Menu, Row, Col } from "antd";
import {
  SearchOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardFilled,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";

const { Header } = Layout;

export default function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userMenu = {
    items: [
      {
        key: "profile",
        label: (
          <NextLink href={`/profile/${session?.user?._id}`}>Profile</NextLink>
        ),
        icon: <UserOutlined />,
      },
      ...(session?.user?.role !== "USER"
        ? [
            {
              key: "dashboard",
              label: <NextLink href={`/dashboard`}>Dashboard</NextLink>,
              icon: <DashboardFilled />,
            },
          ]
        : []),
      {
        key: "logout",
        label: (
          <span onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
            Logout
          </span>
        ),
        icon: <LogoutOutlined />,
      },
    ],
  };

  const navItems = [
    { key: "new", label: "NEW" },
    { key: "men", label: "MEN" },
    { key: "women", label: "WOMEN" },
    { key: "sports", label: "SPORTS" },
    { key: "sale", label: "SALE", style: { color: "red" } },
    { key: "c&s", label: "C&S" },
  ];

  const megaMenu = (
    <div
      style={{
        background: "#1e1e1e",
        color: "#fff",
        padding: "32px 48px",
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 32,
        minWidth: 900,
      }}
    >
      <div>
        <h4 style={{ color: "#fff" }}>All Products →</h4>
        <a style={{ color: "#1890ff", display: "block", marginTop: 8 }}>
          New Arrivals
        </a>
        <a style={{ display: "block", marginTop: 8 }}>Best Sellers</a>
        <a style={{ display: "block", marginTop: 8 }}>ECC Collection</a>
        <a style={{ display: "block", marginTop: 8 }}>Excool Collection</a>
        <a style={{ display: "block", marginTop: 8 }}>Copper Denim</a>
        <a style={{ display: "block", marginTop: 8 }}>Promax</a>
      </div>
      <div>
        <h4 style={{ color: "#fff" }}>Men Tops →</h4>
        <a>Tanktops</a>
        <a>T-Shirts</a>
        <a>Sports Shirts</a>
        <a>Polo</a>
        <a>Shirts</a>
        <a>Jackets</a>
      </div>
      <div>
        <h4 style={{ color: "#fff" }}>Men Bottoms →</h4>
        <a>Shorts</a>
        <a>Joggers</a>
        <a>Sports Pants</a>
        <a>Jeans</a>
        <a>Chinos</a>
        <a>Swimwear</a>
      </div>
      <div>
        <h4 style={{ color: "#fff" }}>Underwear →</h4>
        <a>Briefs</a>
        <a>Boxers</a>
        <a>Long Leg</a>
        <a>Homewear</a>
      </div>
      <div>
        <h4 style={{ color: "#fff" }}>Accessories →</h4>
        <a>Hats</a>
        <a>Socks</a>
        <a>Bags</a>
        <a>Belts</a>
      </div>
    </div>
  );

  return (
    <Header
      style={{
        background: "#121212",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: 0,
        position: "sticky",
        top: 0,
        zIndex: 1000,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 64,
        }}
      >
        {/* Left: Logo */}
        <div
          onClick={() => router.push("/")}
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: 20,
            cursor: "pointer",
            marginRight: 32,
          }}
        >
          CoolStore
        </div>

        {/* Center: Nav menu */}
        <div style={{ display: "flex", gap: 24, marginLeft: "12px" }}>
          {navItems.map((item) => (
            <Dropdown key={item.key} popupRender={() => megaMenu}>
              <div
                style={{
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                  ...item.style,
                }}
              >
                {item.label}
              </div>
            </Dropdown>
          ))}
        </div>

        {/* Center: Search */}
        <div style={{ flex: 1, padding: "0 32px" }}>
          <Input
            placeholder="Search for products..."
            prefix={<SearchOutlined />}
            allowClear
            size="middle"
            style={{ borderRadius: 20 }}
            onPressEnter={(e: any) => {
              const value = e?.target?.value;
              if (value) router.push(`/search?q=${value}`);
            }}
          />
        </div>

        {/* Right: Account + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {status === "loading" ? null : session ? (
            <>
              <Dropdown
                key={session?.user?._id}
                menu={userMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar
                  style={{ backgroundColor: "#87d068", cursor: "pointer" }}
                  size={35}
                >
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </Dropdown>
            </>
          ) : (
            <NextLink
              href="/auth/signin"
              style={{ color: "#fff", fontWeight: 500 }}
            >
              Login
            </NextLink>
          )}

          <Badge count={2} offset={[-2, 2]}>
            <ShoppingCartOutlined style={{ fontSize: 22, color: "#fff" }} />
          </Badge>
        </div>
      </div>
    </Header>
  );
}
