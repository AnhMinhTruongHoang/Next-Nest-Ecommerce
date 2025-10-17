"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

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

type TProps = {
  children: React.ReactNode;
};

// API Fetch Account
export const fetchAccountAPI = async (): Promise<IUser | null> => {
  const urlBackend = "http://localhost:8000/api/v1/auth/account";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (!token) return null;

  try {
    const res = await axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data?.data?.user) {
      return res.data.data.user;
    }
    return null;
  } catch (error) {
    console.error("Fetch account failed:", error);
    return null;
  }
};

export const AppProvider = ({ children }: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [carts, setCarts] = useState<ICart[]>([]);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const openCartModal = () => setIsCartModalOpen(true);
  const closeCartModal = () => setIsCartModalOpen(false);

  // 🧩 Khởi tạo app
  useEffect(() => {
    const initApp = async () => {
      // Load carts (guest hoặc user)
      const savedCarts = localStorage.getItem("carts");
      if (savedCarts) setCarts(JSON.parse(savedCarts));

      // Lấy token
      const token = localStorage.getItem("access_token");
      let data = null;

      if (token) {
        data = await fetchAccountAPI();
      }

      if (data) {
        setUser(data);
        setIsAuthenticated(true);
        setAccessToken(token);

        // 🧠 Merge carts guest (nếu có)
        const guestCarts = localStorage.getItem("carts");
        if (guestCarts) {
          const parsed = JSON.parse(guestCarts);
          if (parsed.length > 0) {
            // Giả sử bạn chưa lưu carts user trong DB,
            // chỉ merge tạm trong localStorage
            setCarts(parsed);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsAppLoading(false);
    };

    initApp();
  }, []);

  // 🧷 Lưu carts vào localStorage mỗi khi thay đổi
  useEffect(() => {
    if (!isAppLoading) {
      localStorage.setItem("carts", JSON.stringify(carts));
    }
  }, [carts, isAppLoading]);

  return (
    <>
      {isAppLoading ? (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
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
