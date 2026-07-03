"use client";

import { useIsMobile } from "@/utils/use-mobile";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { compactFormat, currencyVND } from "../overview/format";

type PropsType = {
  data: {
    received: { x: unknown; y: number }[];
    due: { x: unknown; y: number }[];
  };
};

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export function PaymentsOverviewChart({ data }: PropsType) {
  const isMobile = useIsMobile();

  const options: ApexOptions = {
    legend: {
      show: !isMobile,
      position: "top",
      horizontalAlign: "right",
      fontSize: isMobile ? "10px" : "12px",
      labels: {
        colors: "#b8b8b8",
      },
      markers: {
        size: 6,
      },
    },

    colors: ["#52C41A", "red"],

    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
      foreColor: "#8b949e",
      background: "transparent",
    },

    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        opacityFrom: 0.45,
        opacityTo: 0.04,
      },
    },

    stroke: {
      curve: "smooth",
      width: isMobile ? 2 : 3,
    },

    grid: {
      strokeDashArray: 4,
      borderColor: "#3a3f41",
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
      padding: {
        left: isMobile ? 4 : 8,
        right: isMobile ? 4 : 8,
      },
    },

    dataLabels: { enabled: false },

    tooltip: {
      theme: "dark",
      marker: { show: true },
      style: { fontSize: isMobile ? "11px" : "13px" },
      y: {
        formatter: (value) => currencyVND(Number(value) || 0),
      },
    },

    xaxis: {
      labels: {
        style: {
          colors: "#6f777b",
          fontSize: isMobile ? "10px" : "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },

    yaxis: {
      labels: {
        formatter: (value) => compactFormat(Number(value) || 0),
        style: {
          colors: "#6f777b",
          fontSize: isMobile ? "10px" : "12px",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    responsive: [
      {
        breakpoint: 768,
        options: {
          chart: { height: 220 },
          stroke: { width: 2 },
          legend: { show: false },
          grid: { padding: { left: 0, right: 0 } },
        },
      },
      {
        breakpoint: 1280,
        options: {
          chart: { height: 280 },
        },
      },
    ],
  };

  return (
    <div className="gz-payment-chart-wrap">
      <Chart
        options={options}
        series={[
          { name: "Đã nhận", data: data.received },
          { name: "Còn nợ", data: data.due },
        ]}
        type="area"
        height={isMobile ? 220 : 310}
      />

      <style jsx global>{`
        .gz-payment-chart-wrap {
          width: 100%;
          border-radius: 14px;
          background: transparent;
          padding: 6px 0;
        }

        .gz-payment-chart-wrap .apexcharts-tooltip {
          background: #181a1b !important;
          border: 1px solid #2a2d2e !important;
          color: #ffffff !important;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.35) !important;
        }

        .gz-payment-chart-wrap .apexcharts-tooltip-title {
          background: #111314 !important;
          border-bottom: 1px solid #2a2d2e !important;
          color: #ffffff !important;
        }

        .gz-payment-chart-wrap .apexcharts-xaxistooltip {
          background: #181a1b !important;
          border-color: #2a2d2e !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
