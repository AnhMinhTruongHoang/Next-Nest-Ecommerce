"use client";

import React, { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Avatar,
  Badge,
  Dropdown,
  Popover,
  Empty,
  Button,
} from "antd";
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
import "../../styles/product.scss";
import { getImageUrl } from "@/utils/getImageUrl";

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

  const handleLogout = () => {
    // Xóa access_token để lần sau phải login lại
    localStorage.removeItem("access_token");

    // Nếu có giỏ guest thì xóa (user thì giữ lại carts_user để login lại còn)
    localStorage.removeItem("carts_guest");

    signOut({ callbackUrl: "/" });
  };

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
          <span style={{ cursor: "pointer" }} onClick={() => handleLogout()}>
            Logout
          </span>
        ),
        icon: <LogoutOutlined />,
      },
    ],
  };

  const ContentPopover = () => {
    return (
      <div
        style={{
          width: 260,
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "#00FFE0",
            fontSize: 13,
            fontWeight: 600,
            padding: "6px 8px",
            textAlign: "center",
          }}
        >
          Sản phẩm mới thêm
        </div>

        {/* Product list */}
        <div
          style={{
            maxHeight: 220,
            overflowY: "auto",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          {carts && carts.length > 0 ? (
            carts.map((product, index) => (
              <div
                key={`product-${index}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onClick={() =>
                  router.push(`/product-detail/${product.detail._id}`)
                } // ✅ chuyển tới chi tiết sản phẩm
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fafafa")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#fff")
                }
              >
                <img
                  src={getImageUrl(product?.detail?.thumbnail)}
                  alt={product?.detail?.name}
                  style={{
                    width: 60,
                    height: 55,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #eee",
                  }}
                />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div
                    style={{
                      fontSize: 13,
                      color: "#333",
                      lineHeight: "1.2",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 160,
                    }}
                  >
                    {product?.detail?.name}
                  </div>
                  <div
                    style={{
                      color: "#d0021b",
                      fontWeight: 500,
                      fontSize: 13,
                      marginTop: 2,
                    }}
                  >
                    {new Intl.NumberFormat("vi-VN", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(product?.detail?.price ?? 0)}{" "}
                    đ
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div
              style={{
                textAlign: "center",
                color: "#999",
                fontSize: 13,
                padding: "16px 0",
              }}
            >
              Không có sản phẩm trong giỏ hàng
            </div>
          )}
        </div>

        {/* Footer */}
        {carts && carts.length > 0 && (
          <div
            style={{
              padding: "8px 0",
              display: "flex",
              justifyContent: "center",
              background: "#fff",
            }}
          >
            <button
              onClick={() => router.push("/order")}
              style={{
                background: "#ff4d4f",
                color: "#fff",
                border: "none",
                padding: "6px 12px",
                borderRadius: 4,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#ff3333")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#ff4d4f")
              }
            >
              Xem giỏ hàng
            </button>
          </div>
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
        <div
          style={{
            display: "flex",
            alignItems: "center", // căn giữa dọc
            justifyContent: "center", // căn giữa ngang (nếu muốn)
            gap: 24,
          }}
        >
          {status === "loading" ? null : session ? (
            <Dropdown
              menu={userMenu}
              placement="bottom"
              arrow
              trigger={["click"]}
              overlayStyle={{ textAlign: "center" }} // căn giữa menu
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
            content={<ContentPopover />}
            trigger="hover"
            placement="bottomRight"
            classNames={{ root: "popover-carts" }}
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
