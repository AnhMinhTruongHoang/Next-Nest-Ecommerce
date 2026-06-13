"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const geoUrl = "/vietnam-provinces.json";

export default function Map() {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  return (
    <div className="gz-vn-map-wrap">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200,
          center: [106, 16],
        }}
        className="gz-vn-map"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.NAME_1 || "Không xác định";
              const isHovered = hoveredProvince === name;
              const isSelected = selectedProvince === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isSelected
                      ? "#ff7a00"
                      : isHovered
                      ? "#00ffe0"
                      : "#2f3a3d"
                  }
                  stroke="#111314"
                  strokeWidth={0.6}
                  data-tooltip-id="province-tooltip"
                  data-tooltip-content={name}
                  onMouseEnter={() => setHoveredProvince(name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={() => setSelectedProvince(name)}
                  style={{
                    default: {
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    },
                    hover: {
                      outline: "none",
                    },
                    pressed: {
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip id="province-tooltip" className="gz-vn-map-tooltip" />

      <div className="gz-vn-map-label">
        {selectedProvince ? (
          <span>
            🗺️ <b>{selectedProvince}</b>
          </span>
        ) : (
          <span>Nhấn vào tỉnh để xem tên</span>
        )}
      </div>

      <style jsx global>{`
        .gz-vn-map-wrap {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          border: 1px solid #2a2d2e;
          border-radius: 16px;
          padding: 10px;
          background: radial-gradient(circle at top, #1f2527 0%, #111314 70%);
          box-shadow: inset 0 0 30px rgba(0, 255, 224, 0.04);
        }

        .gz-vn-map {
          width: 100%;
          height: auto;
        }

        .gz-vn-map path {
          transition: fill 0.2s ease, filter 0.2s ease;
        }

        .gz-vn-map path:hover {
          filter: drop-shadow(0 0 6px rgba(0, 255, 224, 0.45));
        }

        .gz-vn-map-label {
          margin-top: 10px;
          text-align: center;
          color: #b8b8b8;
          font-size: 14px;
        }

        .gz-vn-map-label b {
          color: #00ffe0;
          font-weight: 800;
        }

        .gz-vn-map-tooltip {
          background: #181a1b !important;
          color: #ffffff !important;
          border: 1px solid #00ffe0 !important;
          border-radius: 8px !important;
          font-weight: 700 !important;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.35) !important;
        }

        @media (min-width: 640px) {
          .gz-vn-map-wrap {
            aspect-ratio: 3 / 3;
          }
        }

        @media (min-width: 768px) {
          .gz-vn-map-wrap {
            aspect-ratio: 3 / 2;
          }
        }

        @media (max-width: 420px) {
          .gz-vn-map-wrap {
            padding: 8px;
            border-radius: 14px;
          }

          .gz-vn-map-label {
            font-size: 13px;
          }
        }
      `}</style>
    </div>
  );
}