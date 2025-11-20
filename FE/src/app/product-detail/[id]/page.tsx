import ProductDetail from "@/components/productDetail/product.detail";
import axios from "axios";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${id}`
    );
    const currentProduct = res.data?.data ?? null;

    if (!currentProduct) {
      return notFound();
    }

    return <ProductDetail currentProduct={currentProduct} />;
  } catch (error) {
    return notFound();
  }
}
