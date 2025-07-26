"use client"; // if you are planning to use it in a component that is not marked as client

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation"; // usePathname is a hook now

const ActiveLink = ({
  children,
  ...rest
}: { children: React.ReactNode } & LinkProps) => {
  const { href } = rest;
  const pathName = usePathname();

  const isActive = pathName.startsWith(href as string);
  return (
    // you get a global isActive class name, it is better than
    // nothing, but it means you do not have scoping ability in
    // certain cases
    <Link {...rest} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
};

export default ActiveLink;
