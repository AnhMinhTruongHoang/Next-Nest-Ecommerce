export async function getDevicesUsedData(
  timeFrame?: "monthly" | "yearly" | (string & {})
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const data = [
    {
      name: "Máy tính để bàn",
      percentage: 0.65,
      amount: 1625,
    },
    {
      name: "Máy tính bảng",
      percentage: 0.1,
      amount: 250,
    },
    {
      name: "Điện thoại",
      percentage: 0.2,
      amount: 500,
    },
    {
      name: "Không xác định",
      percentage: 0.05,
      amount: 125,
    },
  ];

  if (timeFrame === "yearly") {
    data[0].amount = 19500;
    data[1].amount = 3000;
    data[2].amount = 6000;
    data[3].amount = 1500;
  }

  return data;
}

// Giả lập API lấy dữ liệu tổng quan thanh toán
export async function getPaymentsOverviewData(
  timeFrame?: "monthly" | "yearly" | (string & {})
) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "yearly") {
    return {
      received: [
        { x: 2020, y: 450 },
        { x: 2021, y: 620 },
        { x: 2022, y: 780 },
        { x: 2023, y: 920 },
        { x: 2024, y: 1080 },
      ],
      due: [
        { x: 2020, y: 1480 },
        { x: 2021, y: 1720 },
        { x: 2022, y: 1950 },
        { x: 2023, y: 2300 },
        { x: 2024, y: 1200 },
      ],
    };
  }

  return {
    received: [
      { x: "Th1", y: 0 },
      { x: "Th2", y: 20 },
      { x: "Th3", y: 35 },
      { x: "Th4", y: 45 },
      { x: "Th5", y: 35 },
      { x: "Th6", y: 55 },
      { x: "Th7", y: 65 },
      { x: "Th8", y: 50 },
      { x: "Th9", y: 65 },
      { x: "Th10", y: 75 },
      { x: "Th11", y: 60 },
      { x: "Th12", y: 75 },
    ],
    due: [
      { x: "Th1", y: 15 },
      { x: "Th2", y: 9 },
      { x: "Th3", y: 17 },
      { x: "Th4", y: 32 },
      { x: "Th5", y: 25 },
      { x: "Th6", y: 68 },
      { x: "Th7", y: 80 },
      { x: "Th8", y: 68 },
      { x: "Th9", y: 84 },
      { x: "Th10", y: 94 },
      { x: "Th11", y: 74 },
      { x: "Th12", y: 62 },
    ],
  };
}

// Giả lập API lợi nhuận theo tuần
export async function getWeeksProfitData(timeFrame?: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (timeFrame === "last week") {
    return {
      sales: [
        { x: "T7", y: 33 },
        { x: "CN", y: 44 },
        { x: "T2", y: 31 },
        { x: "T3", y: 57 },
        { x: "T4", y: 12 },
        { x: "T5", y: 33 },
        { x: "T6", y: 55 },
      ],
      revenue: [
        { x: "T7", y: 10 },
        { x: "CN", y: 20 },
        { x: "T2", y: 17 },
        { x: "T3", y: 7 },
        { x: "T4", y: 10 },
        { x: "T5", y: 23 },
        { x: "T6", y: 13 },
      ],
    };
  }

  return {
    sales: [
      { x: "T7", y: 44 },
      { x: "CN", y: 55 },
      { x: "T2", y: 41 },
      { x: "T3", y: 67 },
      { x: "T4", y: 22 },
      { x: "T5", y: 43 },
      { x: "T6", y: 65 },
    ],
    revenue: [
      { x: "T7", y: 13 },
      { x: "CN", y: 23 },
      { x: "T2", y: 20 },
      { x: "T3", y: 8 },
      { x: "T4", y: 13 },
      { x: "T5", y: 27 },
      { x: "T6", y: 15 },
    ],
  };
}

// Giả lập API dữ liệu khách truy cập từ chiến dịch
export async function getCampaignVisitorsData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    total_visitors: 784_000,
    performance: -1.5,
    chart: [
      { x: "T7", y: 168 },
      { x: "CN", y: 385 },
      { x: "T2", y: 201 },
      { x: "T3", y: 298 },
      { x: "T4", y: 187 },
      { x: "T5", y: 195 },
      { x: "T6", y: 291 },
    ],
  };
}

// Giả lập API phân tích khách truy cập
export async function getVisitorsAnalyticsData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112, 123, 212, 270,
    190, 310, 115, 90, 380, 112, 223, 292, 170, 290, 110, 115, 290, 380, 312,
  ].map((value, index) => ({ x: (index + 1).toString(), y: value }));
}

// Giả lập API chi phí trung bình mỗi lượt tương tác
export async function getCostsPerInteractionData() {
  return {
    avg_cost: 560.93,
    growth: 2.5,
    chart: [
      {
        name: "Google Ads",
        data: [
          { x: "Th9", y: 15 },
          { x: "Th10", y: 12 },
          { x: "Th11", y: 61 },
          { x: "Th12", y: 118 },
          { x: "Th1", y: 78 },
          { x: "Th2", y: 125 },
          { x: "Th3", y: 165 },
          { x: "Th4", y: 61 },
          { x: "Th5", y: 183 },
          { x: "Th6", y: 238 },
          { x: "Th7", y: 237 },
          { x: "Th8", y: 235 },
        ],
      },
      {
        name: "Facebook Ads",
        data: [
          { x: "Th9", y: 75 },
          { x: "Th10", y: 77 },
          { x: "Th11", y: 151 },
          { x: "Th12", y: 72 },
          { x: "Th1", y: 7 },
          { x: "Th2", y: 58 },
          { x: "Th3", y: 60 },
          { x: "Th4", y: 185 },
          { x: "Th5", y: 239 },
          { x: "Th6", y: 135 },
          { x: "Th7", y: 119 },
          { x: "Th8", y: 124 },
        ],
      },
    ],
  };
}
