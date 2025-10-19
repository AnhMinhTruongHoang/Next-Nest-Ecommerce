"use client";

import axios from "axios";
import { getSession } from "next-auth/react";
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
export const fetchAccountAPI = async (token: string): Promise<IUser | null> => {
  const urlBackend = "http://localhost:8000/api/v1/auth/account";

  try {
    const res = await axios.get<IBackendRes<IFetchAccount>>(urlBackend, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.data?.user ?? null;
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

  // Khởi tạo app

  useEffect(() => {
    const initApp = async () => {
      const savedCarts = localStorage.getItem("carts");
      if (savedCarts) setCarts(JSON.parse(savedCarts));

      const session = await getSession();
      if (session?.access_token) {
        const data = await fetchAccountAPI(session.access_token);
        if (data) {
          setUser(data);
          setIsAuthenticated(true);
          setAccessToken(session.access_token);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setAccessToken(null);
      }

      setIsAppLoading(false);
    };

    initApp();
  }, []);

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
