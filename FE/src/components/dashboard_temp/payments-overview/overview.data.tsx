export type SeriesPoint = { x: number | string; y: number };

export type PaymentsOverviewResp = {
  received: SeriesPoint[];
  due: SeriesPoint[];
};

function mapTimeFrame(tf?: string): "monthly" | "yearly" {
  if (!tf) return "monthly";
  const v = tf.toLowerCase();
  return v === "yearly" || v === "year" ? "yearly" : "monthly";
}

type GetOverviewOpts = {
  timeFrame?: string;
  from?: string;
  to?: string;
  signal?: AbortSignal;
};

const getList = <T,>(res: any): T[] => {
  if (Array.isArray(res?.data?.result)) return res.data.result;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.result)) return res.result;
  if (Array.isArray(res)) return res;
  return [];
};

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return { "Content-Type": "application/json" };
  }

  const token = localStorage.getItem("access_token") || "";
  const pureToken = token.startsWith("Bearer ") ? token.slice(7) : token;

  return {
    "Content-Type": "application/json",
    ...(pureToken ? { Authorization: `Bearer ${pureToken}` } : {}),
  };
};

const isValidSeries = (payload: PaymentsOverviewResp) => {
  const receivedTotal = payload.received.reduce((sum, item) => sum + item.y, 0);
  const dueTotal = payload.due.reduce((sum, item) => sum + item.y, 0);
  return receivedTotal > 0 || dueTotal > 0;
};

function buildEmptySeries(
  timeFrame: "monthly" | "yearly"
): PaymentsOverviewResp {
  if (timeFrame === "yearly") {
    const year = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => year - 4 + index);

    return {
      received: years.map((year) => ({ x: String(year), y: 0 })),
      due: years.map((year) => ({ x: String(year), y: 0 })),
    };
  }

  const months = Array.from({ length: 12 }, (_, index) => `Th${index + 1}`);

  return {
    received: months.map((month) => ({ x: month, y: 0 })),
    due: months.map((month) => ({ x: month, y: 0 })),
  };
}

function buildOverviewFromOrders(
  orders: IOrder[],
  timeFrame: "monthly" | "yearly"
): PaymentsOverviewResp {
  const series = buildEmptySeries(timeFrame);

  orders.forEach((order) => {
    const createdAt = order.createdAt ? new Date(order.createdAt) : null;
    if (!createdAt || Number.isNaN(createdAt.getTime())) return;

    const status = String(order.status || "").toUpperCase();
    const amount = Number(order.finalTotal ?? order.totalPrice ?? 0);

    if (!amount) return;

    const index =
      timeFrame === "yearly"
        ? series.received.findIndex(
            (item) => String(item.x) === String(createdAt.getFullYear())
          )
        : createdAt.getMonth();

    if (index < 0) return;

    if (["PAID", "SHIPPED", "COMPLETED"].includes(status)) {
      series.received[index].y += amount;
    } else if (["PENDING"].includes(status)) {
      series.due[index].y += amount;
    }
  });

  return series;
}

async function getOverviewFromOrders(
  base: string,
  timeFrame: "monthly" | "yearly",
  signal?: AbortSignal
): Promise<PaymentsOverviewResp> {
  const res = await fetch(`${base}/orders?current=1&pageSize=9999`, {
    method: "GET",
    headers: getAuthHeaders(),
    signal,
  });

  const json = await res.json();
  const orders = getList<IOrder>(json);

  return buildOverviewFromOrders(orders, timeFrame);
}

export async function getPaymentsOverviewData(
  opts?: GetOverviewOpts
): Promise<PaymentsOverviewResp> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");

  const timeFrame = mapTimeFrame(opts?.timeFrame);

  const params = new URLSearchParams();
  params.set("timeFrame", timeFrame);
  if (opts?.from) params.set("from", opts.from);
  if (opts?.to) params.set("to", opts.to);

  try {
    const res = await fetch(`${base}/payments/overview?${params}`, {
      method: "GET",
      headers: getAuthHeaders(),
      signal: opts?.signal,
    });

    if (res.ok) {
      const json = await res.json();
      const payload = json?.data ?? json;

      const result = {
        received: Array.isArray(payload?.received) ? payload.received : [],
        due: Array.isArray(payload?.due) ? payload.due : [],
      };

      if (isValidSeries(result)) {
        return result;
      }
    }
  } catch (err: any) {
    if (err?.name === "AbortError") throw err;
  }

  return getOverviewFromOrders(base, timeFrame, opts?.signal);
}
