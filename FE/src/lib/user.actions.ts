"use server";

import { revalidateTag } from "next/cache";

/// Update user
export const updateUserAction = async (data: any, access_token: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${data._id}`,
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

  revalidateTag("listUsers");
  return d;
};

/// Delete user
export const deleteUserAction = async (user: IUser, access_token: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user._id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const d = await res.json();

  revalidateTag("listUsers");
  return d;
};
/// Delete order
export const deleteOrderAction = async (
  order: IOrder,
  access_token: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${order._id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    }
  );

  const d = await res.json();

  revalidateTag("listOrders");
  return d;
};
