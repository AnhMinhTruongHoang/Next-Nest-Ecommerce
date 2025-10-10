"use client";

import axios from "axios";
import { IFetchAccount, IUser } from "next-auth";
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
}

const CurrentAppContext = createContext<IAppContext | null>(null);

type TProps = {
  children: React.ReactNode;
};

// API Fetch Account
export const fetchAccountAPI = async (): Promise<IUser | null> => {
  const urlBackend = "/api/v1/auth/account";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  if (!token) return null;

  try {
    const res = await axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Kiểm tra data hợp lệ
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
  const [carts, setCarts] = useState<ICart[]>([]);

  useEffect(() => {
    const initApp = async () => {
      const data = await fetchAccountAPI();

      if (data) {
        setUser(data);
        setIsAuthenticated(true);

        const storedCarts = localStorage.getItem("carts");
        if (storedCarts) {
          setCarts(JSON.parse(storedCarts));
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }

      setIsAppLoading(false);
    };

    initApp();
  }, []);

  // Đồng bộ carts vào localStorage khi thay đổi
  useEffect(() => {
    if (carts.length > 0) {
      localStorage.setItem("carts", JSON.stringify(carts));
    }
  }, [carts]);

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
            setIsAuthenticated,
            setUser,
            isAppLoading,
            setIsAppLoading,
            carts,
            setCarts,
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
