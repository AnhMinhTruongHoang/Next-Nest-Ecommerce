"use client";

import { RegionLabels } from "../DashBoard/map/label";
import { WeeksProfit } from "../DashBoard/Profit/Profit.week";
import { PaymentsOverview } from "../DashBoard/payments-overview/payment.overView";
export default function AdminCard() {
  return (
    <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
      {/* Tổng quan thanh toán */}
      <PaymentsOverview
        className="col-span-12 xl:col-span-7"
        timeFrame="monthly"
      />

      {/* Lợi nhuận theo tuần */}
      <WeeksProfit
        className="col-span-12 xl:col-span-5"
        timeFrame="this week"
      />

      {/* Bản đồ khu vực */}
      <RegionLabels />
    </div>
  );
}
