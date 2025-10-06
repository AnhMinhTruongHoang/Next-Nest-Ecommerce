"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

/* ========= TYPES ========= */
export interface IUser {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
}

export interface IFetchAccount {
  user: IUser;
}

export interface ICart {
  _id: string;
  quantity: number;
  detail: any;
}

export interface IBackendRes<T> {
  data: T;
  statusCode?: number;
  message?: string;
}

/* ========= CONTEXT ========= */
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

/* ========= API ========= */
const fetchAccountAPI = async () => {
  const url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/account`;
  return axios.get<IBackendRes<IFetchAccount>>(url, {
    withCredentials: true, // nếu bạn dùng cookie cho JWT
  });
};

/* ========= PROVIDER ========= */
type TProps = {
  children: React.ReactNode;
};

export const AppProvider = ({ children }: TProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [carts, setCarts] = useState<ICart[]>([]);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const res = await fetchAccountAPI();
        const cartsStorage = localStorage.getItem("carts");

        if (res.data?.data?.user) {
          setUser(res.data.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }

        if (cartsStorage) {
          setCarts(JSON.parse(cartsStorage));
        }
      } catch (error) {
        console.error("Fetch account failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsAppLoading(false);
      }
    };

    fetchAccount();
  }, []);

  if (isAppLoading) {
    return (
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <ClipLoader size={35} color="#36d6b4" />
      </div>
    );
  }

  return (
    <CurrentAppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser,
        isAppLoading,
        setIsAppLoading,
        carts,
        setCarts,
      }}
    >
      {children}
    </CurrentAppContext.Provider>
  );
};

/* ========= CUSTOM HOOK ========= */
export const useCurrentApp = () => {
  const context = useContext(CurrentAppContext);
  if (!context) {
    throw new Error("useCurrentApp must be used within <AppProvider>");
  }
  return context;
};
