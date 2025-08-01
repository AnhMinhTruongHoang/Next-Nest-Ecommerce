"use client";

import React, { useState } from "react";
import { Layout, Input, Avatar, Badge, Dropdown, Button, Skeleton } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  DashboardFilled,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/api";
import ActiveLink from "./active.link";

const { Header } = Layout;

export default function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mobileVisible, setMobileVisible] = useState(false);

  const handleRedirectHome = () => {
    router.push("/");
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
          <span onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
            Logout
          </span>
        ),
        icon: <LogoutOutlined />,
      },
    ],
  };

  return (
    <Header
      style={{
        background: "#121212",
        padding: 0,
        borderBottom: "1px solid rgba(255,255,255,0.1)",
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
        {/* Left: Logo + Toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            style={{ color: "#fff" }}
          />

          <div
            onClick={handleRedirectHome}
            style={{
              color: "#fff",
              fontWeight: 700,
              fontSize: 20,
              cursor: "pointer",
            }}
          >
            SoundCloud
          </div>
        </div>

        <div style={{ flex: 1, padding: "0 24px" }}>
          <Input
            placeholder="Search music, artists..."
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

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {status === "loading" ? (
            <Skeleton.Avatar active size={35} shape="circle" />
          ) : session ? (
            <>
              <ActiveLink href={"/"}>FNC 1</ActiveLink>
              <ActiveLink href={"/"}>FNC 2</ActiveLink>
              <ActiveLink href={"/"}>FNC 3</ActiveLink>

              <Badge count={3} offset={[-2, 2]}>
                <BellOutlined style={{ fontSize: 18, color: "#fff" }} />
              </Badge>

              <Dropdown
                key={session?.user?._id}
                menu={userMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                    cursor: "pointer",
                  }}
                  size={35}
                >
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </Dropdown>
            </>
          ) : (
            <ActiveLink href={"/auth/signin"}>Login</ActiveLink>
          )}
        </div>
      </div>
    </Header>
  );
}
