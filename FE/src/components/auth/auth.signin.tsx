"use client";
import {
  LockOutlined,
  GithubOutlined,
  GoogleOutlined,
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Input, Typography } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import ModelReactive from "./model.reactive";

const { Title } = Typography;

const AuthSignIn = () => {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Modal state 👇
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleSubmit = async () => {
    if (!username) {
      setModalContent("Username is required.");
      setIsModalOpen(true);
      return;
    }
    if (!password) {
      setModalContent("Password is required.");
      setIsModalOpen(true);
      return;
    }

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (!res?.error) {
      router.push("/");
    } else {
      setModalContent(res.error); // 👈 show error from backend
      setIsModalOpen(true);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
        padding: "48px 16px",
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto", position: "relative" }}>
        <Link href="/" style={{ position: "absolute", top: 0, left: 0 }}>
          <Button icon={<ArrowLeftOutlined />} type="link">
            Back
          </Button>
        </Link>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <Avatar
            size={64}
            style={{ backgroundColor: "#ff4d4f", marginBottom: 12 }}
          >
            <LockOutlined />
          </Avatar>
          <Title level={3}>Sign In</Title>
        </div>

        <Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: 16 }}
        />
        <Input.Password
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onPressEnter={handleSubmit}
          iconRender={(visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
          }
          style={{ marginBottom: 24 }}
        />

        <Button
          type="primary"
          block
          onClick={handleSubmit}
          style={{ marginBottom: 16 }}
        >
          Sign In
        </Button>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Typography.Text>
            Don't have an account?{" "}
            <Link href="/auth/signup">
              <Button type="link" style={{ padding: 0 }}>
                Sign Up
              </Button>
            </Link>
          </Typography.Text>
        </div>

        <Divider>Or sign in with</Divider>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 16,
            marginTop: 24,
          }}
        >
          <Avatar
            style={{ backgroundColor: "#000", cursor: "pointer" }}
            icon={<GithubOutlined />}
            onClick={() => signIn("github")}
          />
          <Avatar
            style={{ backgroundColor: "#db4437", cursor: "pointer" }}
            icon={<GoogleOutlined />}
            onClick={() => signIn("google")}
          />
        </div>
      </div>

      {/* ✅ Modal Error Message */}
      <ModelReactive
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        title="Sign In Error"
        content={<p>{modalContent}</p>}
        type="error"
      />
    </div>
  );
};

export default AuthSignIn;
