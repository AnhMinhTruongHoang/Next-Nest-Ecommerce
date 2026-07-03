"use client";

import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import {
  AppstoreOutlined,
  HomeOutlined,
  MailOutlined,
  OrderedListOutlined,
  ProductFilled,
  TeamOutlined,
} from "@ant-design/icons";
import React, { useMemo } from "react";
import { Grid } from "antd";
import { useAdminContext } from "@/lib/admin.context";
import type { MenuProps } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TicketCheckIcon } from "lucide-react";

type MenuItem = Required<MenuProps>["items"][number];

const { Sider } = Layout;
const { useBreakpoint } = Grid;

const AdminSideBar = () => {
  const { collapseMenu, mobileMenuOpen, closeMobileMenu } = useAdminContext();
  const pathname = usePathname();
  const screens = useBreakpoint();
  const isMobile = !screens.md;

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
          icon: <TicketCheckIcon size={17} />,
          label: <Link href="/dashboard/vouchers">Quản lý voucher</Link>,
        },
        {
          type: "divider",
        },
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
    <>
      {isMobile && mobileMenuOpen && (
        <div className="gz-admin-sidebar-overlay" onClick={closeMobileMenu} />
      )}

      <Sider
        collapsed={!isMobile && collapseMenu}
        className={`gz-admin-sidebar ${
          isMobile && mobileMenuOpen ? "is-mobile-open" : ""
        }`}
        width={isMobile ? 260 : 220}
        collapsedWidth={isMobile ? 0 : 72}
        style={{ background: "#181A1B" }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={["feedback"]}
          items={items}
          className="gz-admin-sidebar-menu"
          onClick={() => {
            if (isMobile) closeMobileMenu();
          }}
        />
      </Sider>

      <style jsx global>{`
        .gz-admin-sidebar {
          background: #181a1b !important;
          border-right: 1px solid #2a2d2e !important;
          min-height: 100vh;
          overflow: hidden;
          flex-shrink: 0;
        }

        .gz-admin-sidebar .ant-layout-sider-children {
          background: #181a1b !important;
          height: 100vh;
          overflow-y: auto;
          overflow-x: hidden;
        }

        .gz-admin-sidebar-menu {
          height: 100vh;
          background: #181a1b !important;
          color: #b8b8b8 !important;
          border-inline-end: none !important;
          padding: 10px 0;
        }

        .gz-admin-sidebar-menu.ant-menu {
          background: #181a1b !important;
        }

        .gz-admin-sidebar-menu .ant-menu-item,
        .gz-admin-sidebar-menu .ant-menu-submenu-title {
          height: 42px !important;
          line-height: 42px !important;
          color: #b8b8b8 !important;
          border-radius: 12px !important;
          margin: 5px 8px !important;
          width: calc(100% - 16px) !important;
          transition: all 0.25s ease;
        }

        .gz-admin-sidebar-menu .ant-menu-item-icon,
        .gz-admin-sidebar-menu .anticon {
          color: #8b949e !important;
          transition: color 0.25s ease;
        }

        .gz-admin-sidebar-menu .ant-menu-title-content {
          color: inherit !important;
        }

        .gz-admin-sidebar-menu .ant-menu-item:hover,
        .gz-admin-sidebar-menu .ant-menu-submenu-title:hover {
          background: rgba(0, 255, 224, 0.08) !important;
          color: #00ffe0 !important;
        }

        .gz-admin-sidebar-menu .ant-menu-item:hover .anticon,
        .gz-admin-sidebar-menu .ant-menu-submenu-title:hover .anticon,
        .gz-admin-sidebar-menu .ant-menu-item:hover .ant-menu-item-icon {
          color: #00ffe0 !important;
        }

        .gz-admin-sidebar-menu .ant-menu-item-selected {
          background: linear-gradient(135deg, #ff4d00, #ff7a00) !important;
          color: #ffffff !important;
          font-weight: 800 !important;
          box-shadow: 0 8px 18px rgba(255, 77, 0, 0.18);
        }

        .gz-admin-sidebar-menu .ant-menu-item-selected .anticon,
        .gz-admin-sidebar-menu .ant-menu-item-selected .ant-menu-item-icon,
        .gz-admin-sidebar-menu .ant-menu-item-selected .ant-menu-title-content {
          color: #ffffff !important;
        }

        .gz-admin-sidebar-menu .ant-menu-sub {
          background: #111314 !important;
        }

        .gz-admin-sidebar-menu .ant-menu-submenu-arrow {
          color: #8b949e !important;
        }

        .gz-admin-sidebar-menu
          .ant-menu-submenu-open
          > .ant-menu-submenu-title {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.03) !important;
        }

        .gz-admin-sidebar-menu
          .ant-menu-submenu-open
          > .ant-menu-submenu-title
          .anticon {
          color: #00ffe0 !important;
        }

        .gz-admin-sidebar .ant-layout-sider-children::-webkit-scrollbar {
          width: 6px;
        }

        .gz-admin-sidebar .ant-layout-sider-children::-webkit-scrollbar-track {
          background: #181a1b;
        }

        .gz-admin-sidebar .ant-layout-sider-children::-webkit-scrollbar-thumb {
          background: #303435;
          border-radius: 999px;
        }

        .gz-admin-sidebar
          .ant-layout-sider-children::-webkit-scrollbar-thumb:hover {
          background: #00ffe0;
        }

        .gz-admin-sidebar-overlay {
          position: fixed;
          inset: 0;
          z-index: 98;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(2px);
        }

        @media (max-width: 767px) {
          .gz-admin-sidebar {
            position: fixed !important;
            left: 0;
            top: 0;
            bottom: 0;
            z-index: 99;
            width: 260px !important;
            max-width: 82vw !important;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            box-shadow: 16px 0 40px rgba(0, 0, 0, 0.35);
          }

          .gz-admin-sidebar.is-mobile-open {
            transform: translateX(0);
          }

          .gz-admin-sidebar .ant-layout-sider-children,
          .gz-admin-sidebar-menu {
            height: 100vh;
          }
        }
      `}</style>
    </>
  );
};

export default AdminSideBar;
