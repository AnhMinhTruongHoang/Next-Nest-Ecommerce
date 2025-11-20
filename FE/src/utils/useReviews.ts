// hooks/useReviews.ts
import { useCallback, useEffect, useState } from "react";

export function useReviews(
  productId: string,
  token?: string,
  apiBase = process.env.NEXT_PUBLIC_BACKEND_URL!
) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const fetchAll = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${apiBase}/reviews?productId=${productId}&page=1&limit=20&sort=recent`,
        { headers }
      );
      const d = await res.json();
      setItems(d.items || d.data?.items || d.data?.result || []);
    } finally {
      setLoading(false);
    }
  }, [productId, apiBase, token]);

  const create = useCallback(
    async (payload: { rating: number; comment?: string }) => {
      const res = await fetch(`${apiBase}/reviews`, {
        method: "POST",
        headers,
        body: JSON.stringify({ productId, ...payload }),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Gửi đánh giá thất bại");
      await fetchAll(); // hoặc setItems(prev => [...prev, newItem])
    },
    [productId, apiBase, token, fetchAll]
  );

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);
  return { items, loading, fetchAll, create };
}
