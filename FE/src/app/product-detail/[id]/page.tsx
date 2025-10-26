import ProductDetail from "@/components/productDetail/product.detail";
import axios from "axios";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;

  try {
    const res = await axios.get(`${baseURL}/api/v1/products/${id}`);
    const currentProduct = res.data?.data ?? null;

    if (!currentProduct) {
      return notFound();
    }

    return <ProductDetail currentProduct={currentProduct} />;
  } catch (error) {
    return notFound();
  }
}
