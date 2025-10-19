"use client";

import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { JSX, SVGProps } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type PropsType = {
  label: string;
  data: {
    value: number | string;
    growthRate: number;
  };
  Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element;
};

export function OverviewCard({ label, data, Icon }: PropsType) {
  const isDecreasing = data.growthRate < 0;

  return (
    <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
      {/* Icon ở đầu thẻ */}
      <Icon />

      <div className="mt-6 flex items-end justify-between">
        <dl>
          <dt className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
            {data.value}
          </dt>

          <dd className="text-sm font-medium text-dark-6">{label}</dd>
        </dl>

        <dl
          className={cn(
            "text-sm font-medium",
            isDecreasing ? "text-red" : "text-green"
          )}
        >
          <dt className="flex items-center gap-1.5">
            {Math.abs(data.growthRate)}%
            {isDecreasing ? (
              <ArrowDownOutlined aria-hidden />
            ) : (
              <ArrowUpOutlined aria-hidden />
            )}
          </dt>

          <dd className="sr-only">
            {label} {isDecreasing ? "Decreased" : "Increased"} by{" "}
            {data.growthRate}%
          </dd>
        </dl>
      </div>
    </div>
  );
}
