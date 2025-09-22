import ProductsTable from "@/components/admin/product.table";
import SafeHydrate from "@/lib/SafeHydrate";

export default function ManageProductPage() {
  return (
    <SafeHydrate>
      <ProductsTable />
    </SafeHydrate>
  );
}
