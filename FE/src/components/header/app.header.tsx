"use client";

import React, { useEffect, useState } from "react";
import { Layout, Input, Avatar, Badge, Dropdown, Popover, Empty } from "antd";
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
import { useCurrentApp } from "../context/app.context";

const { Header } = Layout;

export default function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openManageAccount, setOpenManageAccount] = useState<boolean>(false);
  const {
    carts,
    isAuthenticated,
    user,
    setUser,
    setIsAuthenticated,
    setCarts,
  } = useCurrentApp();

  const userMenu = {
    items: [
      {
        key: "profile",
        label: (
          <NextLink href={`/profile/${session?.user?._id}`}>Profile</NextLink>
        ),
        icon: <UserOutlined />,
      },
      {
        label: <NextLink href="/history">Lịch sử mua hàng</NextLink>,
        key: "history",
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
          <span
            style={{ cursor: "pointer" }}
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            Logout
          </span>
        ),
        icon: <LogoutOutlined />,
      },
    ],
  };

  const ContentPopover = () => {
    return (
      <div className="pop-cart-body">
        <div className="pop-cart-content">
          {carts?.map((product, index) => {
            return (
              <div className="product" key={`product-${index}`}>
                <img
                  src={`${process.env.VITE_BACKEND_URL}/images/thumbnails/${product?.detail?.thumbnail}`}
                  alt="No Image"
                />
                <div>{product?.detail?.name}</div>
                <div className="price">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(product?.detail?.price ?? 0)}
                </div>
              </div>
            );
          })}
        </div>
        {carts.length > 0 ? (
          <div className="pop-cart-footer">
            <button onClick={() => router.push("/order")}>Xem giỏ hàng</button>
          </div>
        ) : (
          <Empty description="Không có sản phẩm trong giỏ hàng" />
        )}
      </div>
    );
  };

  const navItems = [
    { key: "mouse", label: "Chuột Gaming" },
    { key: "keyboard", label: "Bàn phím" },
    { key: "headset", label: "Tai nghe" },
    { key: "chairs", label: "Ghế gaming" },
    { key: "monitor", label: "Màn hình" },
    { key: "accessories", label: "Phụ kiện" },
  ];

  const megaMenu = (
    <div
      style={{
        width: "100vw",
        background: "#111",
        color: "#fff",
        padding: "32px 48px",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 32,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        borderRadius: "0 0 12px 12px",
        zIndex: 1200,
      }}
    >
      <div>
        <h4 style={{ color: "#9b59b6" }}>Chuột</h4>
        <a>Logitech</a>
        <a>Razer</a>
        <a>SteelSeries</a>
        <a>HyperX</a>
      </div>
      <div>
        <h4 style={{ color: "#9b59b6" }}>Bàn phím</h4>
        <a>Akko</a>
        <a>Keychron</a>
        <a>Ducky</a>
        <a>Leopold</a>
      </div>
      <div>
        <h4 style={{ color: "#9b59b6" }}>Tai nghe</h4>
        <a>HyperX</a>
        <a>Razer</a>
        <a>Corsair</a>
        <a>Asus</a>
      </div>
      <div>
        <h4 style={{ color: "#9b59b6" }}>Ghế / Phụ kiện</h4>
        <a>Ghế E-Dra</a>
        <a>Ghế SecretLab</a>
        <a>Miếng kê tay</a>
        <a>Mousepad RGB</a>
      </div>
    </div>
  );

  return (
    <Header
      style={{
        background: "#0d0d0d",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        padding: 0,
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 72,
        }}
      >
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          style={{
            color: "#00ffe0",
            fontWeight: 700,
            fontSize: 24,
            cursor: "pointer",
            marginRight: 32,
            fontFamily: "Orbitron, sans-serif",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          GamerZone
        </div>

        {/* Nav */}
        <div style={{ display: "flex", gap: 24 }}>
          {navItems.map((item) => (
            <Dropdown
              key={item.key}
              popupRender={() => megaMenu}
              placement="bottom"
              trigger={["hover"]}
            >
              <div
                style={{
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                  transition: "color 0.2s",
                }}
              >
                {item.label}
              </div>
            </Dropdown>
          ))}
        </div>

        {/* Search */}
        <div style={{ flex: 1, padding: "0 32px" }}>
          <Input
            placeholder="Tìm sản phẩm gaming..."
            prefix={<SearchOutlined />}
            allowClear
            size="middle"
            style={{ borderRadius: 20, background: "#1e1e1e", color: "#fff" }}
            onPressEnter={(e: any) => {
              const value = e?.target?.value;
              if (value) router.push(`/search?q=${value}`);
            }}
          />
        </div>

        {/* Account + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          {status === "loading" ? null : session ? (
            <Dropdown
              menu={userMenu}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Avatar
                style={{
                  backgroundColor: "#9b59b6",
                  cursor: "pointer",
                  border: "2px solid #00ffe0",
                }}
                size={35}
              >
                {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
              </Avatar>
            </Dropdown>
          ) : (
            <NextLink
              href="/auth/signin"
              style={{ color: "#fff", fontWeight: 500, cursor: "pointer" }}
            >
              Login
            </NextLink>
          )}

          <Popover
            className="popover-carts"
            placement="topRight"
            rootClassName="popover-carts"
            title={"Giỏ hàng"}
            content={ContentPopover}
            arrow={true}
          >
            <Badge count={carts?.length ?? 0} offset={[-2, 2]}>
              <ShoppingCartOutlined
                style={{ fontSize: 22, color: "#00ffe0", cursor: "pointer" }}
              />
            </Badge>
          </Popover>
        </div>
      </div>
    </Header>
  );
}
