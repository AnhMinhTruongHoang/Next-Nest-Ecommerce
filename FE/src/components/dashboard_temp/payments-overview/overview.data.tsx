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

export async function getPaymentsOverviewData(
  opts?: GetOverviewOpts
): Promise<PaymentsOverviewResp> {
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "");
  if (!base) throw new Error("Missing NEXT_PUBLIC_BACKEND_URL");

  const params = new URLSearchParams();
  params.set("timeFrame", mapTimeFrame(opts?.timeFrame));
  if (opts?.from) params.set("from", opts.from);
  if (opts?.to) params.set("to", opts.to);

  const res = await fetch(`${base}/api/v1/payments/overview?${params}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    signal: opts?.signal,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Fetch failed (${res.status}): ${text || res.statusText}`);
  }

  const json = await res.json();
  const payload = json?.data ?? json;

  return {
    received: Array.isArray(payload?.received) ? payload.received : [],
    due: Array.isArray(payload?.due) ? payload.due : [],
  };
}
