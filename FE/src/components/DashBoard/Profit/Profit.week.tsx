"use client";

import { useEffect, useState } from "react";
import { cn } from "../overview/cards";
import { WeeksProfitChart } from "./chart.week";
import { getWeeksProfitData } from "../payments-overview/overview.data";
import { PeriodPicker } from "./period-picker";

type DataPoint = { x: string; y: number };

type WeeksProfitData = {
  sales: DataPoint[];
  revenue: DataPoint[];
};

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function WeeksProfit({ className, timeFrame = "this week" }: PropsType) {
  const [data, setData] = useState<WeeksProfitData | null>(null);

  useEffect(() => {
    getWeeksProfitData(timeFrame).then((res) => setData(res));
  }, [timeFrame]);

  if (!data) {
    return (
      <div className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-[10px] bg-white px-7.5 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Profit {timeFrame}
        </h2>

        <PeriodPicker
          items={["this week", "last week"]}
          defaultValue={timeFrame}
          sectionKey="weeks_profit"
        />
      </div>

      <WeeksProfitChart data={data} />
    </div>
  );
}
