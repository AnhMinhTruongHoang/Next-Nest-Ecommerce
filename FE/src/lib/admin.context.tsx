"use client";

import { createContext, useContext, useState } from "react";

interface IAdminContext {
  collapseMenu: boolean;
  setCollapseMenu: (v: boolean) => void;

  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const AdminContext = createContext<IAdminContext | null>(null);

export const AdminContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [collapseMenu, setCollapseMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <AdminContext.Provider
      value={{
        collapseMenu,
        setCollapseMenu,
        mobileMenuOpen,
        setMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdminContext must be used inside AdminContextProvider");
  }

  return context;
};
