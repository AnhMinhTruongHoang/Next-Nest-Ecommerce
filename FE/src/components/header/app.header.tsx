"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  Spin,
  Grid,
  List,
  Menu,
  theme,
} from "antd";
import {
  Mouse,
  Keyboard,
  Headphones,
  Monitor,
  PlugZap,
  User as UserIcon,
  Table as TableIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NextLink from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCurrentApp } from "../context/app.context";
import "../../styles/product.scss";
import { getImageUrl } from "@/utils/getImageUrl";
import UserInfoModal from "../admin/user.infor";
import OrderHistoryModal from "../admin/user.orders";
import razerLogo from "../../../public/images/logos/razer2.png";
import edraLogo from "../../../public/images/logos/edra.png";
import logitechLogo from "../../../public/images/logos/logitec.png";
import havitLogo from "../../../public/images/logos/havit.png";
import React, { KeyboardEvent } from "react";
import Image, { StaticImageData } from "next/image";
import {
  DashboardFilled,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { useBreakpoint } = Grid;
const { useToken } = theme;

type BrandLogoProps = {
  src: StaticImageData | string;
  alt: string;
  title?: string;
  width?: number;
  height?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
};

const BrandLogo: React.FC<BrandLogoProps> = ({
  src,
  alt,
  title,
  width = 200,
  height = 60,
  onClick,
}) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
    }
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      aria-label={title || alt}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
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
        cursor: onClick ? "pointer" : "default",
        margin: "0 auto",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,.35)";
        e.currentTarget.style.background = "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
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
};

const KEY_TO_CATEGORY_NAME: Record<string, string> = {
  mouse: "Mouse",
  keyboard: "Keyboard",
  monitor: "Monitor",
  chairs: "Chairs",
  accessories: "Accessories",
  headset: "Headset",
};

type SuggestItem = {
  _id: string;
  name: string;
  thumbnail: string;
  price: number;
};

export default function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { carts } = useCurrentApp();
  const [openManageAccount, setOpenManageAccount] = useState(false);
  const [openOrderHistory, setOpenOrderHistory] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SuggestItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [catMapByName, setCatMapByName] = useState<Record<string, string>>({});
  const backendURL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const screens = useBreakpoint();
  const isMobileUI = !screens.md; // < 768px
  const { token } = useToken();

  useEffect(() => {
    const cached = localStorage.getItem("catMapByName");
    if (cached) {
      try {
        const { at, map } = JSON.parse(cached);
        if (Date.now() - at < 24 * 60 * 60 * 1000) {
          setCatMapByName(map);
          return;
        }
      } catch {}
    }

    (async () => {
      try {
        const res = await fetch(`${backendURL}/api/v1/categories`);
        const json = await res.json();
        const arr: Array<{ _id: string; name: string }> = json?.data ?? [];
        const map: Record<string, string> = {};
        for (const c of arr) map[c.name.toLowerCase()] = c._id;
        setCatMapByName(map);
        localStorage.setItem(
          "catMapByName",
          JSON.stringify({ at: Date.now(), map })
        );
      } catch (e) {
        console.error("Load categories failed", e);
      }
    })();
  }, [backendURL]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("carts_guest");
    signOut({ callbackUrl: "/" });
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

  // --- Nav meta
  const navItems = useMemo(
    () => [
      { key: "mouse", label: "Chuột", icon: <Mouse size={18} /> },
      { key: "keyboard", label: "Bàn phím", icon: <Keyboard size={18} /> },
      { key: "headset", label: "Tai nghe", icon: <Headphones size={18} /> },
      { key: "chairs", label: "Ghế", icon: <TableIcon size={18} /> },
      { key: "monitor", label: "Màn hình", icon: <Monitor size={18} /> },
      { key: "accessories", label: "Phụ kiện", icon: <PlugZap size={18} /> },
    ],
    []
  );

  /// Brand filter
  const goBrand = (name: string) => {
    router.push(`/productsList?brand=${encodeURIComponent(name)}&sort=-sold`);
  };

  const goCategory = (key: string) => {
    const catName = KEY_TO_CATEGORY_NAME[key];
    if (!catName) {
      router.push("/productsList");
      return;
    }
    const id = catMapByName[catName.toLowerCase()];
    const sp = new URLSearchParams();
    if (id) sp.set("category", id);
    else sp.set("categoryName", catName);
    sp.set("sort", "-sold");
    router.push(`/productsList?${sp.toString()}`);
  };

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
        <BrandLogo
          src={razerLogo}
          alt="Razer"
          title="Razer"
          onClick={() => goBrand("Razer")}
        />
      </div>
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>Logitech</h4>
        <BrandLogo
          src={logitechLogo}
          alt="Logitech"
          title="Logitech"
          onClick={() => goBrand("Logitech")}
        />
      </div>
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>Havit</h4>
        <BrandLogo
          src={havitLogo}
          alt="Havit"
          title="Havit"
          onClick={() => goBrand("Havit")}
        />
      </div>
      <div>
        <h4 style={{ color: "#9b59b6", marginBottom: 10 }}>E-Dra</h4>
        <BrandLogo
          src={edraLogo}
          alt="E-Dra"
          title="E-Dra"
          onClick={() => goBrand("E-Dra")}
        />
      </div>
    </div>
  );

  // --- Search suggestions with tiny debounce
  const debounceRef = useRef<number | null>(null);

  const fetchSuggestions = async (keyword: string) => {
    const q = keyword.trim();
    if (!q) {
      setSuggestions([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${backendURL}/api/v1/products/suggest?q=${encodeURIComponent(q)}`
      );
      const json = await res.json();
      const items: SuggestItem[] = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
        ? json.data
        : [];
      setSuggestions(items.slice(0, 8));
    } catch {
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = window.setTimeout(() => {
      fetchSuggestions(query);
    }, 200);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const handleSelect = (value: SuggestItem | string) => {
    setOpenDropdown(false);
    if (typeof value !== "string" && value?._id) {
      router.push(`/product-detail/${value._id}`);
    } else {
      const v = typeof value === "string" ? value : query;
      if (v) router.push(`/search?q=${encodeURIComponent(v)}`);
    }
  };

  // ===== User Menu (desktop dropdown content) =====
  const UserMenuContent: React.FC = () => {
    const items = [
      {
        key: "profile",
        label: <span onClick={() => setOpenManageAccount(true)}>Profile</span>,
        icon: <UserIcon size={16} />,
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
        label: <span onClick={handleLogout}>Logout</span>,
        icon: <LogoutOutlined />,
      },
    ];

    return (
      <div
        style={{
          width: 220,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 12px 32px rgba(0,0,0,.16)",
          padding: 8,
          border: "1px solid #f0f0f0",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 10px 6px",
            borderBottom: "1px dashed #eee",
            marginBottom: 6,
          }}
        >
          <Avatar
            size={36}
            style={{ background: "#9b59b6", border: "2px solid #00ffe0" }}
          >
            {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>
          <div style={{ lineHeight: 1.2 }}>
            <div style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>
              {session?.user?.name || "User"}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>
              {session?.user?.email}
            </div>
          </div>
        </div>

        <Menu
          selectable={false}
          items={items.map((it) => ({
            ...it,
            style: {
              borderRadius: 8,
              margin: "2px 0",
              padding: "6px 10px",
            },
          }))}
          onClick={() => setOpenUserMenu(false)}
        />
      </div>
    );
  };

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
              trigger={[isMobileUI ? "click" : "hover"]}
            >
              <Tooltip title={item.label} placement="bottom">
                <div className="nav-item" onClick={() => goCategory(item.key)}>
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
          <Dropdown
            open={openDropdown && (loading || suggestions.length > 0)}
            placement="bottom"
            popupRender={() => (
              <div
                style={{
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  width: 420,
                  maxHeight: 320,
                  overflowY: "auto",
                  padding: 6,
                }}
              >
                {loading ? (
                  <div style={{ textAlign: "center", padding: 16 }}>
                    <Spin size="small" />
                  </div>
                ) : suggestions.length > 0 ? (
                  suggestions.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => handleSelect(p)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 8px",
                        cursor: "pointer",
                        borderRadius: 6,
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "#fafafa")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <img
                        src={getImageUrl(p.thumbnail)}
                        alt={p.name}
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "cover",
                          borderRadius: 4,
                          border: "1px solid #eee",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontWeight: 500,
                            color: "#333",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {p.name}
                        </div>
                        <div
                          style={{
                            color: "#d0021b",
                            fontWeight: 600,
                            fontSize: 13,
                          }}
                        >
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(p.price)}
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
                      padding: "10px 0",
                    }}
                  >
                    Không có gợi ý nào
                  </div>
                )}
              </div>
            )}
          >
            <Input
              placeholder="Tìm sản phẩm gaming..."
              prefix={<SearchOutlined />}
              allowClear
              size="middle"
              style={{
                borderRadius: 20,
                color: "black",
              }}
              value={query}
              onFocus={() => setOpenDropdown(true)}
              onBlur={() => setTimeout(() => setOpenDropdown(false), 200)}
              onChange={(e) => setQuery(e.target.value)}
              onPressEnter={(e: any) => {
                const value = e?.target?.value;
                if (value) handleSelect(value);
              }}
            />
          </Dropdown>
        </div>

        {/* Account + Cart */}
        <div className="acct">
          {status === "loading" ? null : session ? (
            <>
              {/* Desktop: Dropdown đẹp */}
              {!isMobileUI ? (
                <Dropdown
                  open={openUserMenu}
                  onOpenChange={setOpenUserMenu}
                  popupRender={() => <UserMenuContent />}
                  placement="bottomRight"
                  arrow
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
                // Mobile responsive
                <Avatar
                  style={{
                    backgroundColor: "#9b59b6",
                    cursor: "pointer",
                    border: "2px solid #00ffe0",
                  }}
                  size={35}
                  onClick={() => setOpenUserMenu(true)}
                >
                  {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              )}

              {/* Drawer mobile */}
              <Drawer
                title="Tài khoản"
                open={isMobileUI && openUserMenu}
                onClose={() => setOpenUserMenu(false)}
                placement="bottom"
                height="auto"
                styles={{
                  header: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
                  content: {
                    borderTopLeftRadius: 12,
                    borderTopRightRadius: 12,
                  },
                  body: { paddingTop: 0, paddingBottom: 12 },
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "8px 4px 12px",
                  }}
                >
                  <Avatar
                    size={40}
                    style={{
                      background: "#9b59b6",
                      border: "2px solid #00ffe0",
                    }}
                  >
                    {session?.user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </Avatar>
                  <div style={{ lineHeight: 1.2 }}>
                    <div style={{ fontWeight: 600 }}>
                      {session?.user?.name || "User"}
                    </div>
                    <div style={{ color: "#888", fontSize: 12 }}>
                      {session?.user?.email}
                    </div>
                  </div>
                </div>

                <List
                  itemLayout="horizontal"
                  dataSource={[
                    {
                      key: "profile",
                      text: "Profile",
                      onClick: () => setOpenManageAccount(true),
                      icon: <UserIcon size={18} />,
                    },
                    ...(session?.user?.role === "ADMIN"
                      ? [
                          {
                            key: "dashboard",
                            text: "Dashboard",
                            onClick: () => router.push("/dashboard"),
                            icon: <DashboardFilled />,
                          },
                        ]
                      : [
                          {
                            key: "orders",
                            text: "Lịch sử mua hàng",
                            onClick: () => setOpenOrderHistory(true),
                            icon: <ShoppingCartOutlined />,
                          },
                        ]),
                    {
                      key: "logout",
                      text: "Logout",
                      onClick: handleLogout,
                      icon: <LogoutOutlined />,
                    },
                  ]}
                  renderItem={(item: any) => (
                    <List.Item
                      style={{ padding: "10px 6px" }}
                      onClick={() => {
                        item.onClick();
                        setOpenUserMenu(false);
                      }}
                    >
                      <List.Item.Meta
                        avatar={
                          <span
                            style={{
                              width: 28,
                              display: "inline-flex",
                              justifyContent: "center",
                            }}
                          >
                            {item.icon}
                          </span>
                        }
                        title={
                          <span style={{ fontSize: 16 }}>{item.text}</span>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Drawer>
            </>
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
            trigger={isMobileUI ? "click" : "hover"}
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

      {/* Mobile Drawer Menu (categories) */}
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
            onClick={() => {
              setMobileMenuOpen(false);
              goCategory(item.key);
            }}
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
