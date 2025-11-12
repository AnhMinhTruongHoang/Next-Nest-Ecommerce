"use client";
import { Button } from "antd";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
  zaloOAID: string;
  phone: string;
};

export default function ContactFloat({ zaloOAID, phone }: Props) {
  const [open, setOpen] = useState(true);

  const zaloHref = useMemo(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(
      typeof navigator !== "undefined" ? navigator.userAgent : ""
    );
    return isMobile
      ? `zalo://chat?oaid=${zaloOAID}`
      : `https://zalo.me/${zaloOAID}`;
  }, [zaloOAID]);

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} aria-label="Mở liên hệ">
        💬
      </Button>
    );
  }

  return (
    <div style={wrapStyle}>
      <a
        href={zaloHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat qua Zalo"
        style={{ ...btnStyle, background: "#0068FF" }}
        title="Nhắn Zalo"
      >
        <Image
          src="/images/logos/Zalo.jpg"
          alt="Zalo"
          width={28}
          height={28}
          style={{ display: "block" }}
        />
      </a>

      <a
        href={`tel:${phone}`}
        aria-label={`Gọi ${phone}`}
        style={{ ...btnStyle, background: "#2D4AE8" }}
        title={`Gọi ${phone}`}
      >
        📞
      </a>

      <button
        onClick={() => setOpen(false)}
        aria-label="Đóng"
        style={closeStyle}
        title="Đóng"
      >
        X
      </button>
    </div>
  );
}

// Styles
const wrapStyle: React.CSSProperties = {
  position: "fixed",
  right: 12,
  bottom: 16,
  display: "flex",
  flexDirection: "column",
  gap: 10,
  zIndex: 1000,
};

const btnStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 999,
  boxShadow: "0 6px 16px rgba(0,0,0,.18)",
  display: "grid",
  placeItems: "center",
  color: "#fff",
};

const closeStyle: React.CSSProperties = {
  width: 42,
  height: 42,
  borderRadius: 999,
  background: "rgba(0,0,0,.06)",
  backdropFilter: "blur(6px)",
  border: "1px solid rgba(0,0,0,.08)",
};

// Nếu cần safe-area cho iPhone:
(wrapStyle as any).paddingBottom = "env(safe-area-inset-bottom)";
