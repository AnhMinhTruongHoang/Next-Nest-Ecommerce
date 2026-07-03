"use client";

import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Grid, Layout, MenuProps, Space } from "antd";
import { signOut } from "next-auth/react";
import { useAdminContext } from "@/lib/admin.context";

const { Header } = Layout;
const { useBreakpoint } = Grid;

const AdminHeader = (props: any) => {
  const { session } = props;
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const { collapseMenu, setCollapseMenu, mobileMenuOpen, toggleMobileMenu } =
    useAdminContext();

  const items: MenuProps["items"] = [
    {
      key: "logout",
      danger: true,
      label: (
        <span
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
        >
          đăng xuất
        </span>
      ),
    },
  ];

  const handleToggleMenu = () => {
    if (isMobile) {
      toggleMobileMenu();
      return;
    }

    setCollapseMenu(!collapseMenu);
  };

  const menuIcon = isMobile ? (
    mobileMenuOpen ? (
      <MenuFoldOutlined />
    ) : (
      <MenuUnfoldOutlined />
    )
  ) : collapseMenu ? (
    <MenuUnfoldOutlined />
  ) : (
    <MenuFoldOutlined />
  );

  return (
    <>
      <Header className="gz-admin-header">
        <Button
          type="text"
          icon={menuIcon}
          onClick={handleToggleMenu}
          className="gz-admin-collapse-btn"
        />

        <Dropdown menu={{ items }} placement="bottomRight">
          <a
            onClick={(e) => e.preventDefault()}
            className="gz-admin-user-trigger"
          >
            <Space>
              <Avatar className="gz-admin-avatar" size={36}>
                {session?.user?.name?.charAt(0)?.toUpperCase() || "A"}
              </Avatar>
            </Space>
          </a>
        </Dropdown>
      </Header>

      <style jsx global>{`
        .gz-admin-header {
          height: 64px !important;
          padding: 0 18px 0 0 !important;
          display: flex !important;
          align-items: center !important;
          justify-content: space-between !important;
          background: #181a1b !important;
          border-bottom: 1px solid #2a2d2e !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
          position: sticky;
          top: 0;
          z-index: 80;
        }

        .gz-admin-collapse-btn {
          width: 64px !important;
          height: 64px !important;
          border-radius: 0 !important;
          color: #e5e7eb !important;
          font-size: 16px !important;
        }

        .gz-admin-collapse-btn:hover {
          color: #00ffe0 !important;
          background: rgba(0, 255, 224, 0.08) !important;
        }

        .gz-admin-collapse-btn .anticon {
          color: inherit !important;
        }

        .gz-admin-user-trigger {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          line-height: 1;
          padding: 6px;
          border-radius: 999px;
          transition: background 0.2s ease;
        }

        .gz-admin-user-trigger:hover {
          background: rgba(0, 255, 224, 0.08);
        }

        .gz-admin-avatar {
          background: linear-gradient(135deg, #00d5c0, #00b894) !important;
          color: #ffffff !important;
          font-weight: 800 !important;
          cursor: pointer;
          border: 1px solid rgba(0, 255, 224, 0.35);
          box-shadow: 0 0 0 3px rgba(0, 255, 224, 0.08);
        }

        .ant-dropdown .ant-dropdown-menu {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 12px !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3) !important;
        }

        .ant-dropdown .ant-dropdown-menu-item {
          color: #e5e7eb !important;
        }

        .ant-dropdown .ant-dropdown-menu-item:hover {
          background: rgba(0, 255, 224, 0.08) !important;
          color: #00ffe0 !important;
        }

        @media (max-width: 768px) {
          .gz-admin-header {
            height: 58px !important;
            padding-right: 12px !important;
          }

          .gz-admin-collapse-btn {
            width: 58px !important;
            height: 58px !important;
          }

          .gz-admin-avatar {
            width: 34px !important;
            height: 34px !important;
            line-height: 34px !important;
          }
        }
      `}</style>
    </>
  );
};

export default AdminHeader;
