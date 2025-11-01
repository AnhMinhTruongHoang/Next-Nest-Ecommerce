"use client";

import { useEffect, useState } from "react";
import {
  Layout,
  Input,
  Avatar,
  Badge,
  Dropdown,
  Popover,
  Button,
  Drawer,
  Tooltip,
} from "antd";
import {
  Mouse,
  Keyboard,
  Headphones,
  Monitor,
  PlugZap,
  User as UserIcon,
  Table,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCurrentApp } from "../context/app.context";
import "../../styles/product.scss";
import { getImageUrl } from "@/utils/getImageUrl";
import UserInfoModal from "../admin/user.infor";
import OrderHistoryModal from "../admin/user.orders";
import Image from "next/image";
import razerLogo from "../../../public/images/logos/razer2.png";
import edraLogo from "../../../public/images/logos/edra.png";
import logitechLogo from "../../../public/images/logos/logitec.png";
import havitLogo from "../../../public/images/logos/havit.png";
import {
  DashboardFilled,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

const BrandLogo: React.FC<{
  src: any;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
}> = ({ src, alt, title, width = 200, height = 60 }) => (
  <div
    style={{
      width,
      height,
      justifyContent: "center",
      position: "relative",
      display: "flex",
      alignItems: "center",
      borderRadius: 10,
      padding: 8,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.12)",
      transition: "all .25s ease",
      cursor: "pointer",
      margin: "0 auto",
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
      (e.currentTarget as HTMLDivElement).style.boxShadow =
        "0 8px 20px rgba(0,0,0,.35)";
      (e.currentTarget as HTMLDivElement).style.background =
        "rgba(255,255,255,0.12)";
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLDivElement).style.transform = "none";
      (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      (e.currentTarget as HTMLDivElement).style.background =
        "rgba(255,255,255,0.06)";
    }}
  >
    <Image
      src={src}
      alt={alt}
      title={title || alt}
      fill
      sizes="(max-width: 768px) 140px, 200px"
      placeholder="blur"
      style={{ objectFit: "contain" }}
      draggable={false}
    />
  </div>
);

export default function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [openManageAccount, setOpenManageAccount] = useState(false);
  const [openOrderHistory, setOpenOrderHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { carts } = useCurrentApp();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 992); // ~ md/lg
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("carts_guest");
    signOut({ callbackUrl: "/" });
  };

  const userMenu = {
    items: [
      {
        key: "profile",
        label: "Profile",
        icon: <UserIcon size={16} />,
        onClick: () => setOpenManageAccount(true),
      },
      ...(session?.user?.role === "ADMIN"
        ? [
            {
              key: "dashboard",
              label: <NextLink href={`/dashboard`}>Dashboard</NextLink>,
              icon: <DashboardFilled />,
            },
          ]
        : [
            {
              key: "orders",
              label: (
                <span onClick={() => setOpenOrderHistory(true)}>
                  Lịch sử mua hàng
                </span>
              ),
              icon: <ShoppingCartOutlined />,
            },
          ]),
      {
        key: "logout",
        label: (
          <span style={{ cursor: "pointer" }} onClick={handleLogout}>
            Logout
          </span>
        ),
        icon: <LogoutOutlined />,
      },
    ],
  };

  const ContentPopover = () => (
    <div
      style={{
        width: 260,
        background: "#fff",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        overflow: "hidden",
      }}
    >
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
              }
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
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
                  {new Intl.NumberFormat("vi-VN").format(
                    product?.detail?.price ?? 0
                  )}{" "}
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
          >
            Xem giỏ hàng
          </button>
        </div>
      )}
    </div>
  );

  const navItems = [
    { key: "mouse", label: "Chuột", icon: <Mouse size={18} /> },
    { key: "keyboard", label: "Bàn phím", icon: <Keyboard size={18} /> },
    { key: "headset", label: "Tai nghe", icon: <Headphones size={18} /> },
    { key: "chairs", label: "Ghế", icon: <Table size={18} /> },
    { key: "monitor", label: "Màn hình", icon: <Monitor size={18} /> },
    { key: "accessories", label: "Phụ kiện", icon: <PlugZap size={18} /> },
  ];

  const megaMenu = (
    <div
      style={{
        width: "100vw",
        background: "#111",
        color: "#fff",
        padding: "28px 40px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        justifyItems: "center",
        alignItems: "center",
        gap: 32,
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        borderRadius: "0 0 12px 12px",
      }}
    >
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>Razer</h4>
        <BrandLogo src={razerLogo} alt="Razer" />
      </div>
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>Logitech</h4>
        <BrandLogo src={logitechLogo} alt="Logitech" />
      </div>
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>Havit</h4>
        <BrandLogo src={havitLogo} alt="Havit" />
      </div>
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>E-Dra</h4>
        <BrandLogo src={edraLogo} alt="E-Dra" />
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
      {/* Responsive CSS */}
      <style jsx global>{`
        .wrap {
          max-width: 1480px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          height: 64px;
        }
        .brand {
          color: #00ffe0;
          font-weight: 700;
          font-size: 22px;
          cursor: pointer;
          margin-right: 16px;
          font-family: Orbitron, sans-serif;
          letter-spacing: 1px;
          white-space: nowrap;
        }
        .nav-wrap {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        .nav-item {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          font-weight: 500;
          cursor: pointer;
          padding: 6px 8px;
          border-radius: 8px;
          transition: color 0.2s ease, background 0.2s ease;
        }
        .nav-item:hover {
          color: #00ffe0;
          background: rgba(255, 255, 255, 0.06);
        }
        .nav-label {
          display: inline-block;
        }
        .search-wrap {
          flex: 1;
          padding: 0 16px;
          max-width: 520px;
          display: flex;
          align-items: center;
        }
        .acct {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        /* Tablet */
        @media (max-width: 1280px) {
          .nav-wrap {
            gap: 12px;
          }
          .nav-label {
            display: none;
          }
        }
        /* Mobile */
        @media (max-width: 991px) {
          .wrap {
            height: 56px;
            padding: 0 12px;
          }
          .brand {
            font-size: 18px;
            margin-right: 8px;
          }
          .nav-wrap {
            display: none;
          }
          .menu-btn {
            display: inline-flex !important;
          }
          .search-wrap {
            padding: 0 8px;
            max-width: none;
          }
        }
      `}</style>

      <div className="wrap">
        {/* Logo */}
        <div className="brand" onClick={() => router.push("/")}>
          GamerZone
        </div>

        {/* Desktop Nav */}
        <div className="nav-wrap">
          {navItems.map((item) => (
            <Dropdown
              key={item.key}
              popupRender={() => megaMenu}
              placement="bottom"
              trigger={[isMobile ? "click" : "hover"]}
            >
              <Tooltip title={item.label} placement="bottom">
                <div className="nav-item">
                  {item.icon}
                  <span className="nav-label">{item.label}</span>
                </div>
              </Tooltip>
            </Dropdown>
          ))}
        </div>

        {/* Mobile menu button */}
        <Button
          icon={<MenuOutlined />}
          className="menu-btn"
          style={{
            display: "none",
            background: "#1e1e1e",
            color: "#00ffe0",
            border: "none",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setMobileMenuOpen(true)}
        />

        {/* Search */}
        <div className="search-wrap">
          <Input
            placeholder="Tìm sản phẩm gaming..."
            prefix={<SearchOutlined />}
            allowClear
            size="middle"
            style={{
              borderRadius: 20,
              background: "#1e1e1e",
              color: "#fff",
            }}
            onPressEnter={(e: any) => {
              const value = e?.target?.value;
              if (value) router.push(`/search?q=${value}`);
            }}
          />
        </div>

        {/* Account + Cart */}
        <div className="acct">
          {status === "loading" ? null : session ? (
            <Dropdown
              menu={userMenu}
              placement="bottom"
              arrow
              trigger={[isMobile ? "click" : "click"]} // click cả 2 để mở chắc chắn
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
            trigger={isMobile ? "click" : "hover"}
            placement="bottomRight"
          >
            <Badge count={carts?.length ?? 0} offset={[-2, 2]}>
              <ShoppingCartOutlined
                style={{ fontSize: 22, color: "#00ffe0", cursor: "pointer" }}
              />
            </Badge>
          </Popover>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <Drawer
        title="Danh mục sản phẩm"
        placement="left"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        styles={{ body: { background: "#0d0d0d", color: "#fff" } }}
      >
        {navItems.map((item) => (
          <div
            key={item.key}
            style={{
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.1)",
              color: "#fff",
              cursor: "pointer",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
            onClick={() => setMobileMenuOpen(false)}
          >
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </Drawer>

      {/* Modals */}
      <UserInfoModal
        openManageAccount={openManageAccount}
        setOpenManageAccount={setOpenManageAccount}
      />
      <OrderHistoryModal
        openOrderHistory={openOrderHistory}
        setOpenOrderHistory={setOpenOrderHistory}
        userId={session?.user?._id}
      />
    </Header>
  );
}
