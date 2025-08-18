"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";

const ActiveLink = ({
  children,
  ...rest
}: { children: React.ReactNode } & LinkProps) => {
  const { href } = rest;
  const pathName = usePathname();

  const isActive = pathName.startsWith(href as string);
  return (
    <Link {...rest} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
};

export default ActiveLink;
