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
    <div className="relative w-full max-w-[800px] mx-auto overflow-hidden aspect-[3/4] sm:aspect-[3/3] md:aspect-[3/2] border border-gray-300 rounded-md p-2">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1200,
          center: [106, 16],
        }}
        className="w-full h-auto"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.NAME_1;
              const isHovered = hoveredProvince === name;
              const isSelected = selectedProvince === name;

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={
                    isSelected
                      ? "#1E40AF" // xanh đậm khi click
                      : isHovered
                      ? "#3056D3" // xanh khi hover
                      : "#C8D0D8" // màu mặc định
                  }
                  stroke="#fff"
                  strokeWidth={0.5}
                  data-tooltip-id="province-tooltip"
                  data-tooltip-content={name}
                  onMouseEnter={() => setHoveredProvince(name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                  onClick={() => setSelectedProvince(name)} // click để chọn
                  style={{
                    default: { outline: "none", cursor: "pointer" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <Tooltip id="province-tooltip" />

      <div className="mt-2 text-center text-sm text-gray-700 dark:text-white">
        {selectedProvince ? (
          <span>
            🗺️ <b>{selectedProvince}</b>
          </span>
        ) : (
          <span>Nhấn vào tỉnh để xem tên</span>
        )}
      </div>
    </div>
  );
}
