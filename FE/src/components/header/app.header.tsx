"use client";

import React, { useState } from "react";
import { Layout, Menu, Input, Avatar, Badge, Dropdown, Button } from "antd";
import {
  MenuOutlined,
  SearchOutlined,
  BellOutlined,
  MoreOutlined,
  UserOutlined,
  LogoutOutlined,
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

  if (status === "loading") return null;

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
      {
        key: "logout",
        label: <span onClick={() => signOut()}>Logout</span>,
        icon: <LogoutOutlined />,
      },
    ],
  };

  return (
    <Header
      style={{
        background: "linear-gradient(to right, #ff6e40, #ff3d00)",
        padding: 0,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <Button type="text" icon={<MenuOutlined />} style={{ color: "#fff" }} />

        <div
          onClick={handleRedirectHome}
          style={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "18px",
            cursor: "pointer",
            marginLeft: 16,
            marginRight: 16,
            display: "none",
          }}
          className="logo-sm"
        >
          SoundCloud
        </div>

        <Input
          placeholder="Search…"
          prefix={<SearchOutlined />}
          style={{ maxWidth: 300, margin: "0 16px", flex: 1 }}
          onPressEnter={(e: any) => {
            const value = e?.target?.value;
            if (value) router.push(`/search?q=${value}`);
          }}
        />

        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          {session ? (
            <>
              <ActiveLink href={"/"}>FNC 1</ActiveLink>
              <ActiveLink href={"/"}>FNC 2</ActiveLink>
              <ActiveLink href={"/"}>FNC 3</ActiveLink>

              <Badge count={3} offset={[-2, 2]}>
                <BellOutlined style={{ fontSize: 18, color: "#fff" }} />
              </Badge>

              <Dropdown
                menu={userMenu}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Avatar
                  style={{ cursor: "pointer" }}
                  size={35}
                  src={
                    session?.user?.type
                      ? fetchDefaultImages(session.user.type)
                      : "/images/noimage.png"
                  }
                />
              </Dropdown>
            </>
          ) : (
            <ActiveLink href={"/auth/signin"}>Login</ActiveLink>
          )}
        </div>

        <div className="mobile-menu-toggle" style={{ marginLeft: 16 }}>
          <Button
            type="text"
            icon={<MoreOutlined />}
            style={{ color: "#fff" }}
            onClick={() => setMobileVisible(!mobileVisible)}
          />
        </div>
      </div>
    </Header>
  );
}
