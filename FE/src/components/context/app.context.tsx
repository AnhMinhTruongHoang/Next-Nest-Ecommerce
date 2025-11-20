"use client";

import axios from "axios";
import { getSession } from "next-auth/react";
import { createContext, useContext, useEffect, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

/** ===== Context Types ===== */
interface IAppContext {
  isAuthenticated: boolean;
  setIsAuthenticated: (v: boolean) => void;
  user: IUser | null;
  setUser: (v: IUser | null) => void;
  isAppLoading: boolean;
  setIsAppLoading: (v: boolean) => void;
  carts: ICart[];
  setCarts: (v: ICart[]) => void;
  isCartModalOpen: boolean;
  openCartModal: () => void;
  closeCartModal: () => void;
  accessToken: string | null;
  setAccessToken: (v: string | null) => void;
}

const CurrentAppContext = createContext<IAppContext | null>(null);
type TProps = { children: React.ReactNode };

/** Chuẩn hóa chuỗi Bearer */
const asBearer = (token?: string | null) => {
  if (!token) return null;
  return token.startsWith("Bearer ") ? token : `Bearer ${token}`;
};

/** ===== API helpers ===== */

/** Lấy thông tin tài khoản từ JWT; trả về null nếu 401/403 */
export const fetchAccountAPI = async (token: string): Promise<IUser | null> => {
  try {
    const res = await axios.get<IBackendRes<IFetchAccount>>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/account`,
      { headers: { Authorization: asBearer(token)! } }
    );
    return res.data?.data?.user ?? null;
  } catch (err: any) {
    const status = err?.response?.status;
    if (status === 401 || status === 403) {
      // token không hợp lệ/hết hạn
      return null;
    }
    // lỗi khác (network, 5xx) — log gọn, không ném error để tránh console stack đỏ
    console.warn("fetchAccountAPI error:", status || err?.message);
    return null;
  }
};

/** Đồng bộ user từ OAuth để backend cấp JWT */
export const syncOAuthUserAPI = async (
  email: string,
  name: string,
  provider: string
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/sync`,
      {
        email,
        name,
        provider,
      }
    );
    // Kỳ vọng backend trả: { data: { user, access_token } }
    return res.data?.data ?? null;
  } catch (err: any) {
    console.warn(
      "syncOAuthUserAPI error:",
      err?.response?.status || err?.message
    );
    return null;
  }
};

/** ===== Provider ===== */
export const AppProvider = ({ children }: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [carts, setCarts] = useState<ICart[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // restore carts
        const savedCarts = localStorage.getItem("carts");
        if (savedCarts) setCarts(JSON.parse(savedCarts));
      } catch (_) {}

      try {
        const session = await getSession();

        // Thu thập các "ứng viên" token
        const candidates: (string | null | undefined)[] = [
          localStorage.getItem("access_token"),
          // nếu dùng Credentials provider và bạn add access_token vào session
          (session as any)?.access_token,
        ].filter(Boolean);

        // 1) Thử từng token có sẵn
        for (const raw of candidates) {
          const token = raw as string;
          const me = await fetchAccountAPI(token);
          if (me) {
            setUser(me);
            setIsAuthenticated(true);
            setAccessToken(token);
            // nếu lấy từ session thì lưu về localStorage để lần sau dùng
            if (!localStorage.getItem("access_token")) {
              localStorage.setItem("access_token", token);
            }
            setIsAppLoading(false);
            return;
          }
        }

        // 2) Nếu đang login social (có email) mà chưa có JWT → sync để lấy JWT mới
        if (!accessToken && session?.user?.email) {
          const synced = await syncOAuthUserAPI(
            session.user.email,
            session.user.name || "Unknown",
            (session as any)?.user?.provider || "OAUTH"
          );
          const newJwt: string | undefined = synced?.access_token;
          const me: IUser | undefined = synced?.user;

          if (newJwt && me) {
            localStorage.setItem("access_token", newJwt);
            setAccessToken(newJwt);
            setUser(me);
            setIsAuthenticated(true);
            setIsAppLoading(false);
            return;
          }
        }

        // 3) Không token hợp lệ
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      } catch (err) {
        console.warn("initApp error:", (err as any)?.message);
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsAppLoading(false);
      }
    };

    initApp();
  }, []);

  return (
    <>
      {isAppLoading ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            display: "grid",
            placeItems: "center",
            background: "transparent",
          }}
        >
          <PacmanLoader size={30} color="#36d6b4" />
        </div>
      ) : (
        <CurrentAppContext.Provider
          value={{
            isAuthenticated,
            user,
            accessToken,
            setIsAuthenticated,
            setAccessToken,
            setUser,
            isAppLoading,
            setIsAppLoading,
            carts,
            setCarts,
            isCartModalOpen,
            openCartModal,
            closeCartModal,
          }}
        >
          {children}
        </CurrentAppContext.Provider>
      )}
    </>
  );
};

export const useCurrentApp = () => {
  const context = useContext(CurrentAppContext);
  if (!context) {
    throw new Error("useCurrentApp must be used within <AppProvider>");
  }
  return context;
};
