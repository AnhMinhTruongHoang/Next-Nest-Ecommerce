"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Dropdown, Button } from "antd";
import type { MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";

type PropsType<TItem extends string> = {
  defaultValue?: TItem;
  items?: TItem[];
  sectionKey: string;
  minimal?: boolean;
};

const PARAM_KEY = "selected_time_frame";

export function PeriodPicker<TItem extends string>({
  defaultValue,
  sectionKey,
  items,
  minimal,
}: PropsType<TItem>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleClick = (value: string) => {
    const queryString = createQueryString({
      sectionKey,
      value,
      selectedTimeFrame: searchParams.get(PARAM_KEY),
    });

    router.push(pathname + queryString, { scroll: false });
  };

  const menuItems: MenuProps["items"] = (items || ["monthly", "yearly"]).map(
    (item) => ({
      key: item,
      label: (
        <span className="capitalize" onClick={() => handleClick(item)}>
          {item}
        </span>
      ),
    })
  );

  return (
    <Dropdown menu={{ items: menuItems }} trigger={["click"]}>
      <Button type={minimal ? "text" : "default"} className="capitalize">
        {defaultValue || "Time Period"} <DownOutlined />
      </Button>
    </Dropdown>
  );
}

const createQueryString = (props: {
  sectionKey: string;
  value: string;
  selectedTimeFrame: string | null;
}) => {
  const paramsValue = `${props.sectionKey}:${props.value}`;

  if (!props.selectedTimeFrame) {
    return `?${PARAM_KEY}=${paramsValue}`;
  }

  const newSearchParams = props.selectedTimeFrame
    .split(",")
    .filter((value) => !value.includes(props.sectionKey))
    .join(",");

  if (!newSearchParams) {
    return `?${PARAM_KEY}=${paramsValue}`;
  }

  return `?${PARAM_KEY}=${newSearchParams},${paramsValue}`;
};
