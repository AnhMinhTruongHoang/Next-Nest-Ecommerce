"use client";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Skeleton } from "antd";
import { useContext } from "react";
import { DownOutlined, SmileOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { AdminContext } from "@/lib/admin.context";
import { signOut } from "next-auth/react";

const AdminHeader = (props: any) => {
  const { session } = props;

  const { Header } = Layout;
  const { collapseMenu, setCollapseMenu } = useContext(AdminContext)!;

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <span> Settings</span>,
    },

    {
      key: "4",
      danger: true,
      label: (
        <span
          onClick={async () => {
            await signOut({ callbackUrl: "/" });
          }}
        >
          Sign Out
        </span>
      ),
    },
  ];

  return (
    <>
      <Header
        style={{
          padding: 0,
          display: "flex",
          background: "#f5f5f5",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Button
          type="text"
          icon={collapseMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => {
            setCollapseMenu(!collapseMenu), console.log("SESSION", session);
          }}
          style={{
            fontSize: "16px",
            width: 64,
            height: 64,
          }}
        />
        <Dropdown menu={{ items }}>
          <a
            onClick={(e) => e.preventDefault()}
            style={{
              color: "unset",
              lineHeight: "0 !important",
              marginRight: 20,
            }}
          >
            <Space>
              {!session ? (
                <Skeleton.Input style={{ width: 120 }} active size="small" />
              ) : (
                session.user?.email || session.user?.username || "@Social"
              )}

              <DownOutlined />
            </Space>
          </a>
        </Dropdown>
      </Header>
    </>
  );
};

export default AdminHeader;
