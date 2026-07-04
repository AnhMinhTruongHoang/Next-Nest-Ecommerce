"use client";

import { useEffect, useState } from "react";
import { getPaymentsOverviewData } from "./overview.data";
import { PaymentsOverviewChart } from "./chart.payment";
import { currencyVND, standardFormat } from "../overview/format";

type DataPoint = { x: string | number; y: number };
type PaymentsOverviewData = { received: DataPoint[]; due: DataPoint[] };

type PropsType = {
  timeFrame?: string;
  className?: string;
};

export function PaymentsOverview({ timeFrame = "monthly" }: PropsType) {
  const [data, setData] = useState<PaymentsOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    setError(null);
    setData(null);

    getPaymentsOverviewData({ timeFrame, signal: ac.signal })
      .then((res) => setData(res))
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setError(err?.message || String(err));
        }
      });

    return () => ac.abort();
  }, [timeFrame]);

  if (error) {
    return (
      <div className="gz-payment-overview-card">
        <p style={{ color: "#ff7875", fontWeight: 800 }}>
          Lỗi tải dữ liệu: {error}
        </p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="gz-payment-overview-card">
        <p style={{ color: "#00ffe0", textTransform: "uppercase" }}>
          ĐANG TẢI…
        </p>
      </div>
    );
  }

  const receivedTotal = data.received.reduce((s, i) => s + (i.y || 0), 0);
  const dueTotal = data.due.reduce((s, i) => s + (i.y || 0), 0);

  return (
    <>
      <div className="gz-payment-overview-card">
        {/* HEADER */}
        <div className="gz-payment-overview-header">
          <h2>TỔNG QUAN THANH TOÁN</h2>
        </div>

        {/* CHART */}
        <div className="gz-payment-chart-wrap">
          <PaymentsOverviewChart data={data} />
        </div>

        {/* TOTALS */}
        <dl className="gz-payment-summary">
          <div className="gz-payment-summary-item received">
            <dt>
              {standardFormat(receivedTotal)}
              <span>₫</span>
            </dt>
            <dd>Đã nhận</dd>
          </div>

          <div className="gz-payment-summary-item due">
            <dt>
              {standardFormat(dueTotal)}
              <span>₫</span>
            </dt>
            <dd>Còn nợ</dd>
          </div>
        </dl>
      </div>

      <style jsx global>{`
        .gz-payment-overview-card {
          width: 100%;
          padding: 24px;
          border-radius: 16px;
          background: #181a1b;
          border: 1px solid #2a2d2e;
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.22);
          color: #ffffff;
        }

        .gz-payment-overview-header {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 12px;
          border-bottom: 1px solid #303435;
          padding-bottom: 12px;
        }

        .gz-payment-overview-header h2 {
          margin: 0;
          color: #ffffff;
          font-size: 20px;
          font-weight: 900;
          line-height: 1.25;
          text-align: center;
          text-transform: uppercase;
        }

        .gz-payment-chart-wrap {
          margin-top: 20px;
          min-height: 240px;
          overflow: hidden;
        }

        .gz-payment-summary {
          margin: 24px 0 0 !important;
          padding: 14px !important;
          display: grid !important;
          grid-template-columns: 1fr 1fr !important;
          gap: 12px !important;
          border-top: 1px solid #303435 !important;
          list-style: none !important;
        }

        .gz-payment-summary-item {
          min-width: 0;
          padding: 16px 12px !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          gap: 8px !important;
          border-radius: 16px !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.012)
            ),
            #111314 !important;
          border: 1px solid #303435 !important;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        .gz-payment-summary-item.received {
          border-color: rgba(0, 199, 129, 0.28) !important;
          background: radial-gradient(
              circle at top,
              rgba(0, 199, 129, 0.12),
              transparent 58%
            ),
            #111314 !important;
        }

        .gz-payment-summary-item.due {
          border-color: rgba(255, 77, 79, 0.28) !important;
          background: radial-gradient(
              circle at top,
              rgba(255, 77, 79, 0.11),
              transparent 58%
            ),
            #111314 !important;
        }

        .gz-payment-summary-item dt {
          margin: 0 !important;
          max-width: 100%;
          display: flex !important;
          align-items: baseline !important;
          justify-content: center !important;
          gap: 5px !important;
          font-size: 22px !important;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          text-align: center !important;
          word-break: break-word !important;
        }

        .gz-payment-summary-item dt span {
          font-size: 16px !important;
          font-weight: 900 !important;
        }

        .gz-payment-summary-item.received dt,
        .gz-payment-summary-item.received dt span {
          color: #00c781 !important;
        }

        .gz-payment-summary-item.due dt,
        .gz-payment-summary-item.due dt span {
          color: #ff4d4f !important;
        }

        .gz-payment-summary-item dd {
          margin: 0 !important;
          color: #cbd5e1 !important;
          font-size: 12px !important;
          font-weight: 900 !important;
          line-height: 1.2 !important;
          text-align: center !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
        }

        @media (max-width: 768px) {
          .gz-payment-overview-card {
            padding: 16px;
            border-radius: 15px;
          }

          .gz-payment-overview-header h2 {
            font-size: 18px;
          }

          .gz-payment-chart-wrap {
            margin-top: 16px;
            min-height: 220px;
          }

          .gz-payment-summary {
            margin-top: 18px !important;
            padding: 12px !important;
            gap: 10px !important;
          }

          .gz-payment-summary-item {
            padding: 14px 10px !important;
            border-radius: 15px !important;
          }

          .gz-payment-summary-item dt {
            font-size: 20px !important;
            flex-wrap: wrap !important;
          }

          .gz-payment-summary-item dt span {
            font-size: 15px !important;
          }

          .gz-payment-summary-item dd {
            font-size: 11px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-payment-overview-card {
            padding: 14px;
          }

          .gz-payment-summary {
            grid-template-columns: 1fr !important;
            padding: 10px !important;
            gap: 10px !important;
          }

          .gz-payment-summary-item {
            min-height: 86px !important;
            padding: 14px 12px !important;
          }

          .gz-payment-summary-item dt {
            font-size: 21px !important;
          }

          .gz-payment-summary-item dt span {
            font-size: 15px !important;
          }
        }
      `}</style>
    </>
  );
}
