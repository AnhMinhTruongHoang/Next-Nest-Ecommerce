"use client";

import { getTopSellingProductsData } from "@/utils/api";
import { getImageUrl } from "@/utils/getImageUrl";
import { Card, Empty, Segmented, Spin, Tooltip } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const monthLabelMap: Record<string, string> = {
  Th1: "Tháng 1",
  Th2: "Tháng 2",
  Th3: "Tháng 3",
  Th4: "Tháng 4",
  Th5: "Tháng 5",
  Th6: "Tháng 6",
  Th7: "Tháng 7",
  Th8: "Tháng 8",
  Th9: "Tháng 9",
  Th10: "Tháng 10",
  Th11: "Tháng 11",
  Th12: "Tháng 12",
};

const formatNumber = (value?: number) =>
  new Intl.NumberFormat("en-US").format(Number(value) || 0);

const formatCurrency = (value?: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export function TopSellingProductsOverview() {
  const [range, setRange] = useState<TopSellingRange>("year");
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<TopSellingChartItem[]>([]);
  const [rankingData, setRankingData] = useState<TopSellingProductItem[]>([]);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleGoProductDetail = (productId: string) => {
    router.push(`/product-detail/${productId}`);
  };
  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await getTopSellingProductsData({
          range,
          limit: 7,
          signal: controller.signal,
        });

        setChartData(result.chart);
        setRankingData(result.ranking);
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setError(err?.message || "Cannot load top selling products");
        setChartData([]);
        setRankingData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [range]);

  const finalChartData = useMemo(() => {
    const source = chartData.length
      ? chartData
      : Array.from({ length: 12 }, (_, index) => ({
          label: `Th${index + 1}`,
          sold: 0,
        }));

    return source.map((item) => ({
      ...item,
      label: monthLabelMap[item.label] || item.label,
      sold: Number(item.sold) || 0,
    }));
  }, [chartData]);

  const maxSold = useMemo(() => {
    return Math.max(...finalChartData.map((item) => item.sold), 1);
  }, [finalChartData]);

  const totalSold = useMemo(() => {
    return finalChartData.reduce((sum, item) => sum + item.sold, 0);
  }, [finalChartData]);

  return (
    <>
      <Card
        className="gz-top-selling-card"
        variant="borderless"
        title={
          <div className="gz-top-selling-title-wrap">
            <span className="gz-top-selling-eyebrow">Phân tích sản phẩm</span>
            <h3>Sản phẩm bán chạy nhất</h3>
            <p>
              Theo dõi số lượng sản phẩm đã bán và những sản phẩm hoạt động tốt
              nhất.
            </p>
          </div>
        }
        extra={
          <Segmented
            value={range}
            onChange={(value) => setRange(value as TopSellingRange)}
            options={[
              { label: "Tháng này", value: "month" },
              { label: "Năm nay", value: "year" },
              { label: "Tất cả", value: "all" },
            ]}
            className="gz-top-selling-range"
          />
        }
      >
        <Spin spinning={loading}>
          <div className="gz-top-selling-content">
            <div className="gz-top-selling-chart-panel">
              <div className="gz-top-selling-panel-head">
                <div>
                  <h4>Số lượng đã bán</h4>
                  <p>{formatNumber(totalSold)} sản phẩm đã được bán</p>
                </div>

                {error && <span className="gz-top-selling-error">{error}</span>}
              </div>

              <div className="gz-top-selling-chart">
                <div className="gz-top-selling-chart-grid" />

                <div className="gz-top-selling-bars">
                  {finalChartData.map((item) => {
                    const height =
                      item.sold > 0
                        ? Math.max(10, Math.round((item.sold / maxSold) * 230))
                        : 4;

                    return (
                      <Tooltip
                        key={item.label}
                        title={`${item.label}: ${formatNumber(item.sold)} sold`}
                      >
                        <div className="gz-top-selling-bar-col">
                          <div className="gz-top-selling-bar-box">
                            <div
                              className="gz-top-selling-bar"
                              style={{ height }}
                            />
                          </div>

                          <span>{item.label}</span>
                        </div>
                      </Tooltip>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="gz-top-selling-ranking-panel">
              <div className="gz-top-selling-panel-head">
                <div>
                  <h4>Bảng xếp hạng doanh số sản phẩm</h4>
                  <p>Các sản phẩm bán chạy nhất theo số lượng</p>
                </div>
              </div>

              {rankingData.length > 0 ? (
                <div className="gz-top-selling-ranking-list">
                  {rankingData.map((item, index) => (
                    <div
                      className="gz-top-selling-ranking-item"
                      key={item._id}
                      role="button"
                      tabIndex={0}
                      title={`Xem chi tiết ${item.name}`}
                      onClick={() => handleGoProductDetail(item._id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleGoProductDetail(item._id);
                        }
                      }}
                    >
                      <div className="gz-top-selling-ranking-left">
                        <div
                          className={`gz-top-selling-rank ${
                            index < 3 ? "top" : ""
                          }`}
                        >
                          {index + 1}
                        </div>

                        {item.thumbnail ? (
                          <>
                            <img
                              className="gz-top-selling-thumb"
                              src={getImageUrl(item.thumbnail)}
                              alt={item.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";

                                const fallback = e.currentTarget
                                  .nextElementSibling as HTMLElement | null;

                                if (fallback) fallback.style.display = "grid";
                              }}
                            />

                            <div
                              className="gz-top-selling-thumb-placeholder"
                              style={{ display: "none" }}
                            >
                              {item.name?.charAt(0)?.toUpperCase() || "P"}
                            </div>
                          </>
                        ) : (
                          <div className="gz-top-selling-thumb-placeholder">
                            {item.name?.charAt(0)?.toUpperCase() || "P"}
                          </div>
                        )}

                        <div className="gz-top-selling-product-info">
                          <strong title={item.name}>{item.name}</strong>
                          <span>
                            {item.brand || "No brand"} ·{" "}
                            {formatCurrency(item.revenue)}
                          </span>
                        </div>
                      </div>

                      <div className="gz-top-selling-ranking-value">
                        <b>{formatNumber(item.sold)}</b>
                        <span>sold</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gz-top-selling-empty">
                  <Empty description="No selling product data" />
                </div>
              )}
            </div>
          </div>
        </Spin>
      </Card>
      <style jsx global>{`
        .gz-top-selling-card {
          color: #ffffff !important;
          background: linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.012)
            ),
            #181a1b !important;
          border: 1px solid #2a2d2e !important;
          border-radius: 18px !important;
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.32),
            inset 0 1px 0 rgba(255, 255, 255, 0.04) !important;
          overflow: hidden;
        }

        .gz-top-selling-card,
        .gz-top-selling-card * {
          color-scheme: dark;
        }

        .gz-top-selling-card .ant-card-head {
          min-height: 76px !important;
          padding: 0 18px !important;
          background: transparent !important;
          border-bottom: 1px solid #2a2d2e !important;
        }

        .gz-top-selling-card .ant-card-head-wrapper {
          width: 100%;
          align-items: center !important;
        }

        .gz-top-selling-card .ant-card-head-title {
          padding: 14px 0 !important;
          color: #ffffff !important;
          overflow: visible !important;
        }

        .gz-top-selling-card .ant-card-extra {
          padding: 14px 0 !important;
          color: #ffffff !important;
        }

        .gz-top-selling-card .ant-card-body {
          padding: 18px !important;
        }

        .gz-top-selling-title-wrap {
          min-width: 0;
          text-align: left;
        }

        .gz-top-selling-eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #00ffe0 !important;
          font-size: 10px;
          font-weight: 900;
          line-height: 1.2;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        .gz-top-selling-title-wrap h3 {
          margin: 0;
          color: #ffffff !important;
          font-size: 22px;
          font-weight: 900;
          line-height: 1.25;
        }

        .gz-top-selling-title-wrap p {
          margin: 7px 0 0;
          max-width: 560px;
          color: #b8c0cc !important;
          font-size: 13px;
          font-weight: 600;
          line-height: 1.45;
        }

        .gz-top-selling-range {
          background: #0d0f10 !important;
          border: 1px solid #303435 !important;
          border-radius: 14px !important;
          padding: 4px !important;
        }

        .gz-top-selling-range .ant-segmented-group {
          gap: 4px;
        }

        .gz-top-selling-range .ant-segmented-item {
          border-radius: 10px !important;
        }

        .gz-top-selling-range .ant-segmented-item-label {
          min-height: 30px !important;
          line-height: 30px !important;
          padding: 0 12px !important;
          color: #e5e7eb !important;
          font-size: 13px !important;
          font-weight: 900 !important;
        }

        .gz-top-selling-range .ant-segmented-item-selected {
          background: rgba(0, 255, 224, 0.16) !important;
          box-shadow: 0 0 0 1px rgba(0, 255, 224, 0.18) !important;
        }

        .gz-top-selling-range
          .ant-segmented-item-selected
          .ant-segmented-item-label {
          color: #00ffe0 !important;
        }

        .gz-top-selling-content {
          display: grid;
          grid-template-columns: minmax(0, 1.65fr) minmax(320px, 0.85fr);
          gap: 18px;
        }

        .gz-top-selling-chart-panel,
        .gz-top-selling-ranking-panel {
          min-width: 0;
          padding: 16px;
          background: #101314 !important;
          border: 1px solid #343a40 !important;
          border-radius: 16px;
        }

        .gz-top-selling-panel-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 16px;
        }

        .gz-top-selling-panel-head h4 {
          margin: 0;
          color: #ffffff !important;
          font-size: 16px;
          font-weight: 900;
          line-height: 1.25;
        }

        .gz-top-selling-panel-head p {
          margin: 6px 0 0;
          color: #b8c0cc !important;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.4;
        }

        .gz-top-selling-ranking-panel .gz-top-selling-panel-head {
          justify-content: center !important;
          text-align: center !important;
        }

        .gz-top-selling-ranking-panel .gz-top-selling-panel-head > div {
          width: 100%;
          text-align: center !important;
        }

        .gz-top-selling-ranking-panel .gz-top-selling-panel-head h4,
        .gz-top-selling-ranking-panel .gz-top-selling-panel-head p {
          text-align: center !important;
        }

        .gz-top-selling-chart-panel .gz-top-selling-panel-head {
          justify-content: center !important;
          text-align: center !important;
        }

        .gz-top-selling-chart-panel .gz-top-selling-panel-head > div {
          width: 100%;
          text-align: center !important;
        }

        .gz-top-selling-chart-panel .gz-top-selling-panel-head h4,
        .gz-top-selling-chart-panel .gz-top-selling-panel-head p {
          text-align: center !important;
        }

        .gz-top-selling-error {
          color: #ff7875 !important;
          font-size: 12px;
          font-weight: 800;
          text-align: right;
        }

        .gz-top-selling-chart {
          position: relative;
          height: 300px;
          overflow-x: auto;
          overflow-y: hidden;
          padding: 10px 4px 0;
          scrollbar-width: thin;
        }

        .gz-top-selling-chart::-webkit-scrollbar {
          height: 6px;
        }

        .gz-top-selling-chart::-webkit-scrollbar-track {
          background: #151819;
          border-radius: 999px;
        }

        .gz-top-selling-chart::-webkit-scrollbar-thumb {
          background: #343a40;
          border-radius: 999px;
        }

        .gz-top-selling-chart-grid {
          position: absolute;
          inset: 10px 4px 38px;
          pointer-events: none;
          background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.07) 1px,
            transparent 1px
          );
          background-size: 100% 58px;
          opacity: 0.8;
        }

        .gz-top-selling-bars {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(12, minmax(48px, 1fr));
          align-items: end;
          gap: 14px;
          height: 100%;
          min-width: 620px;
        }

        .gz-top-selling-bar-col {
          height: 100%;
          display: grid;
          grid-template-rows: 1fr 28px;
          align-items: end;
          gap: 8px;
          cursor: pointer;
        }

        .gz-top-selling-bar-box {
          height: 240px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .gz-top-selling-bar {
          width: 100%;
          max-width: 46px;
          border-radius: 8px 8px 2px 2px;
          background: linear-gradient(180deg, #2f9bff, #1677ff);
          box-shadow: 0 10px 24px rgba(22, 119, 255, 0.25);
          transition: 0.2s ease;
        }

        .gz-top-selling-bar-col:hover .gz-top-selling-bar {
          background: linear-gradient(180deg, #00ffe0, #00b894);
          box-shadow: 0 10px 24px rgba(0, 255, 224, 0.22);
        }

        .gz-top-selling-bar-col span {
          color: #b8c0cc !important;
          font-size: 12px;
          font-weight: 900;
          text-align: center;
        }

        .gz-top-selling-ranking-list {
          display: grid;
          gap: 10px;
        }

        .gz-top-selling-ranking-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.04) !important;
          border: 1px solid #343a40 !important;
          border-radius: 14px;
          transition: 0.2s ease;
        }

        .gz-top-selling-ranking-item:hover {
          background: rgba(0, 255, 224, 0.07) !important;
          border-color: rgba(0, 255, 224, 0.35) !important;
        }

        .gz-top-selling-ranking-left {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .gz-top-selling-rank {
          width: 28px;
          height: 28px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 999px;
          background: #000000 !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          color: #ffffff !important;
          font-size: 12px;
          font-weight: 900;
        }

        .gz-top-selling-rank.top {
          background: #000000 !important;
          color: #ffffff !important;
          box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08);
        }

        .gz-top-selling-thumb {
          display: block;
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          border-radius: 10px;
          object-fit: cover;
          background: #242829;
          border: 1px solid #303435;
        }

        .gz-top-selling-thumb-placeholder {
          width: 38px;
          height: 38px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: linear-gradient(135deg, #202627, #121516);
          border: 1px solid #303435;
          color: #00ffe0 !important;
          font-size: 15px;
          font-weight: 900;
        }

        .gz-top-selling-product-info {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .gz-top-selling-product-info strong {
          max-width: 220px;
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 900;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-top-selling-product-info span {
          max-width: 220px;
          color: #aeb6c2 !important;
          font-size: 12px;
          font-weight: 700;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .gz-top-selling-ranking-value {
          flex-shrink: 0;
          display: grid;
          justify-items: end;
          gap: 2px;
        }

        .gz-top-selling-ranking-value b {
          color: #00ffe0 !important;
          font-size: 15px;
          font-weight: 900;
        }

        .gz-top-selling-ranking-value span {
          color: #b8c0cc !important;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .gz-top-selling-empty {
          padding: 32px 12px;
          border: 1px dashed #303435;
          border-radius: 14px;
        }

        .gz-top-selling-empty .ant-empty-description {
          color: #aeb6c2 !important;
        }

        .gz-top-selling-card .ant-spin-text {
          color: #00ffe0 !important;
        }

        .gz-top-selling-card .ant-spin-dot-item {
          background-color: #00ffe0 !important;
        }

        @media (max-width: 1100px) {
          .gz-top-selling-content {
            grid-template-columns: 1fr;
          }

          .gz-top-selling-product-info strong,
          .gz-top-selling-product-info span {
            max-width: 100%;
          }
        }

        @media (max-width: 768px) {
          .gz-top-selling-card {
            border-radius: 18px !important;
          }

          .gz-top-selling-card .ant-card-head {
            display: block !important;
            min-height: auto !important;
            padding: 16px 14px 14px !important;
          }

          .gz-top-selling-card .ant-card-head-wrapper {
            display: block !important;
          }

          .gz-top-selling-card .ant-card-head-title {
            width: 100% !important;
            padding: 0 !important;
            overflow: visible !important;
            white-space: normal !important;
          }

          .gz-top-selling-card .ant-card-extra {
            width: 100% !important;
            padding: 0 !important;
            margin-top: 14px !important;
          }

          .gz-top-selling-card .ant-card-body {
            padding: 14px !important;
          }

          .gz-top-selling-title-wrap {
            width: 100%;
            text-align: center !important;
          }

          .gz-top-selling-eyebrow {
            margin-bottom: 6px !important;
            font-size: 10px !important;
            white-space: nowrap;
          }

          .gz-top-selling-title-wrap h3 {
            margin: 0 auto !important;
            max-width: 280px;
            font-size: 20px !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .gz-top-selling-title-wrap p {
            margin: 7px auto 0 !important;
            max-width: 260px;
            font-size: 12px !important;
            line-height: 1.45 !important;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .gz-top-selling-range {
            width: 100% !important;
            height: 40px !important;
            padding: 4px !important;
          }

          .gz-top-selling-range .ant-segmented-group {
            width: 100% !important;
            height: 100% !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr 0.7fr;
            gap: 4px;
          }

          .gz-top-selling-range .ant-segmented-item {
            height: 32px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
          }

          .gz-top-selling-range .ant-segmented-item-label {
            min-height: 32px !important;
            line-height: 32px !important;
            padding: 0 6px !important;
            font-size: 12px !important;
          }

          .gz-top-selling-content {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }

          .gz-top-selling-chart-panel,
          .gz-top-selling-ranking-panel {
            padding: 14px !important;
            border-radius: 16px !important;
          }

          .gz-top-selling-panel-head {
            margin-bottom: 14px !important;
          }

          .gz-top-selling-panel-head h4 {
            font-size: 15px !important;
          }

          .gz-top-selling-chart {
            height: 250px !important;
            padding: 8px 0 0 !important;
          }

          .gz-top-selling-chart-grid {
            inset: 8px 0 36px !important;
            background-size: 100% 54px !important;
          }

          .gz-top-selling-bars {
            min-width: 520px !important;
            grid-template-columns: repeat(12, minmax(34px, 1fr)) !important;
            gap: 10px !important;
          }

          .gz-top-selling-bar-box {
            height: 200px !important;
          }

          .gz-top-selling-bar {
            max-width: 34px !important;
            border-radius: 7px 7px 2px 2px !important;
          }

          .gz-top-selling-bar-col span {
            font-size: 11px !important;
          }

          .gz-top-selling-ranking-item {
            padding: 10px !important;
          }
        }

        @media (max-width: 420px) {
          .gz-top-selling-card .ant-card-head {
            padding: 14px 12px 12px !important;
          }

          .gz-top-selling-card .ant-card-body {
            padding: 12px !important;
          }

          .gz-top-selling-title-wrap h3 {
            max-width: 230px;
            font-size: 18px !important;
          }

          .gz-top-selling-title-wrap p {
            max-width: 230px;
            font-size: 12px !important;
          }

          .gz-top-selling-range {
            height: 38px !important;
          }

          .gz-top-selling-range .ant-segmented-item {
            height: 30px !important;
          }

          .gz-top-selling-range .ant-segmented-item-label {
            min-height: 30px !important;
            line-height: 30px !important;
            font-size: 11px !important;
          }

          .gz-top-selling-chart-panel,
          .gz-top-selling-ranking-panel {
            padding: 12px !important;
            border-radius: 15px !important;
          }

          .gz-top-selling-chart {
            height: 240px !important;
          }

          .gz-top-selling-bars {
            min-width: 500px !important;
            gap: 9px !important;
          }

          .gz-top-selling-bar-box {
            height: 190px !important;
          }

          .gz-top-selling-ranking-item {
            align-items: flex-start;
            gap: 10px;
          }

          .gz-top-selling-thumb,
          .gz-top-selling-thumb-placeholder {
            display: none !important;
          }

          .gz-top-selling-product-info strong {
            max-width: 160px;
            font-size: 13px;
          }

          .gz-top-selling-product-info span {
            max-width: 160px;
            font-size: 11px;
          }

          .gz-top-selling-ranking-value b {
            font-size: 13px;
          }
          .gz-top-selling-ranking-item {
            cursor: pointer;
          }

          .gz-top-selling-ranking-item:focus-visible {
            outline: 2px solid rgba(0, 255, 224, 0.75);
            outline-offset: 3px;
          }

          .gz-top-selling-ranking-item:active {
            transform: scale(0.985);
          }
        }
      `}</style>
    </>
  );
}
