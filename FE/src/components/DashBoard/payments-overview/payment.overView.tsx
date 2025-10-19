"use client";

import { useEffect, useState } from "react";
import { getPaymentsOverviewData } from "./overview.data";
import { cn } from "../overview/cards";
import { standardFormat } from "../overview/format";
import { PeriodPicker } from "../Profit/period-picker";
import { PaymentsOverviewChart } from "./chart";

type DataPoint = { x: string | number; y: number };

type PaymentsOverviewData = {
  received: DataPoint[];
  due: DataPoint[];
};

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function PaymentsOverview({
  timeFrame = "monthly",
  className,
}: PropsType) {
  const [data, setData] = useState<PaymentsOverviewData | null>(null);

  useEffect(() => {
    getPaymentsOverviewData(timeFrame).then((res) => setData(res));
  }, [timeFrame]);

  if (!data) {
    return (
      <div className="rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-dark animate-pulse">
        <p className="text-gray-400 dark:text-gray-500">Loading...</p>
      </div>
    );
  }

  const receivedTotal = data.received.reduce((acc, { y }) => acc + y, 0);
  const dueTotal = data.due.reduce((acc, { y }) => acc + y, 0);

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-8 shadow-md ring-1 ring-gray-100 transition-all duration-300 hover:shadow-lg dark:bg-gray-dark dark:ring-gray-800",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Payments Overview
        </h2>

        <PeriodPicker defaultValue={timeFrame} sectionKey="payments_overview" />
      </div>

      {/* Chart */}
      <div className="mt-6 min-h-[240px]">
        <PaymentsOverviewChart data={data} />
      </div>

      {/* Totals */}
      <dl className="mt-6 grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 sm:grid-cols-2 sm:divide-y-0 sm:divide-x">
        <div className="flex flex-col items-center justify-center gap-1 py-3">
          <dt className="text-2xl font-semibold text-green-600 dark:text-green-400">
            ${standardFormat(receivedTotal)}
          </dt>
          <dd className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Received Amount
          </dd>
        </div>

        <div className="flex flex-col items-center justify-center gap-1 py-3">
          <dt className="text-2xl font-semibold text-red-500 dark:text-red-400">
            ${standardFormat(dueTotal)}
          </dt>
          <dd className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Due Amount
          </dd>
        </div>
      </dl>
    </div>
  );
}
