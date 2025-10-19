"use client";

import { useEffect, useState } from "react";
import { Table, Spin } from "antd";
import Image from "next/image";
import { compactFormat, standardFormat } from "../overview/format";
import { getTopChannels } from "./fetch.top.channel";

type Props = {
  className?: string;
};

export function TopChannels({ className }: Props) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTopChannels();
        setData(res);
      } catch (err) {
        console.error("Failed to fetch top channels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Source",
      dataIndex: "name",
      key: "source",
      render: (_: any, record: any) => (
        <div className="flex items-center gap-3">
          <Image
            src={record.logo}
            className="size-8 rounded-full object-cover"
            width={40}
            height={40}
            alt={record.name + " Logo"}
          />
          <span>{record.name}</span>
        </div>
      ),
    },
    {
      title: "Visitors",
      dataIndex: "visitors",
      key: "visitors",
      align: "center" as const,
      render: (val: number) => compactFormat(val),
    },
    {
      title: "Revenues",
      dataIndex: "revenues",
      key: "revenues",
      align: "right" as const,
      render: (val: number) => (
        <span className="text-green-light-1">${standardFormat(val)}</span>
      ),
    },
    {
      title: "Sales",
      dataIndex: "sales",
      key: "sales",
      align: "center" as const,
    },
    {
      title: "Conversion",
      dataIndex: "conversion",
      key: "conversion",
      align: "center" as const,
      render: (val: number) => `${val}%`,
    },
  ];

  return (
    <div
      className={`rounded-[10px] bg-white p-6 shadow-md dark:bg-gray-dark ${className}`}
    >
      <h2 className="mb-4 text-lg font-bold text-dark dark:text-white">
        Top Channels
      </h2>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <Table
          dataSource={data.map((item, i) => ({ ...item, key: i }))}
          columns={columns}
          pagination={false}
          rowClassName="text-base font-medium text-dark dark:text-white text-center"
        />
      )}
    </div>
  );
}
