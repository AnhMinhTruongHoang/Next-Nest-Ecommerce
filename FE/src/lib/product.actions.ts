"use server";

import { revalidateTag } from "next/cache";

/// Update Product
export const updateProductAction = async (data: any, access_token: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${data._id}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  const d = await res.json();

  revalidateTag("listProducts");
  return d;
};

/// Delete Product
export const deleteProductAction = async (
  Product: IProduct,
  access_token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/products/${Product._id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const d = await res.json();

  revalidateTag("listProducts");
  return d;
};
