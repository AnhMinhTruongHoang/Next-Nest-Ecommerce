"use client";

import { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const geoUrl =
  "https://raw.githubusercontent.com/huynhdev/map-data/main/vietnam-provinces.topo.json";

export default function Map() {
  const [hoveredProvince, setHoveredProvince] = useState<string | null>(null);

  return (
    <div className="h-[422px] w-full">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 1800,
          center: [106, 16], // Tâm Việt Nam
        }}
        width={600}
        height={500}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const name = geo.properties?.NAME_1;
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={hoveredProvince === name ? "#3056D3" : "#C8D0D8"}
                  stroke="#fff"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: "none" },
                    hover: { outline: "none" },
                    pressed: { outline: "none" },
                  }}
                  onMouseEnter={() => setHoveredProvince(name)}
                  onMouseLeave={() => setHoveredProvince(null)}
                />
              );
            })
          }
        </Geographies>
      </ComposableMap>

      <div className="mt-3 text-center text-sm text-dark dark:text-white">
        {hoveredProvince ? (
          <span>
            🗺️ <b>{hoveredProvince}</b>
          </span>
        ) : (
          <span>Di chuột vào tỉnh để xem tên</span>
        )}
      </div>
    </div>
  );
}
