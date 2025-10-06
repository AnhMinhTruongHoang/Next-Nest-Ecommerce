import ProductDetail from "@/components/productDetail/product.detail";
import axios from "axios";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const res = await axios.get(`${baseURL}/api/v1/products/${params.id}`);
  const currentProduct = res.data?.data ?? null;

  return <ProductDetail currentProduct={currentProduct} />;
}
