"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { useEffect } from "react";

const NProgressWrapper = ({ children }: { children: React.ReactNode }) => {
  
  useEffect(() => {
    console.log("NProgress mounted");
  }, []);

  return (
    <>
      {children}
      <ProgressBar
        height="4px"
        color="#1890ff"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </>
  );
};

export default NProgressWrapper;
