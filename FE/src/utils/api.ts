import queryString from "query-string";
import slugify from "slugify";

export const sendRequest = async <T>(props: IRequest) => {
  //type
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ "content-type": "application/json", ...headers }),
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T; //generic
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};

export const sendRequestFile = async <T>(props: IRequest) => {
  //type
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ ...headers }),
    body: body ? body : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T; //generic
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};

export const fetchDefaultImages = (type: string) => {
  if (type === "GITHUB") return "/images/github.png";
  if (type === "GOOGLE") return "/images/google.png";
  return "/images/noimage.png";
};

export const convertSlugUrl = (str: string) => {
  if (!str) return "";
  str = slugify(str, {
    lower: true,
    locale: "vi",
  });
  return str;
};

export async function getVNPayUrlAPI(
  amount: number,
  locale: string,
  paymentRef?: string
): Promise<string> {
  const response = await fetch(
    "http://localhost:8000/api/v1/vnpay/payment-url",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount, bankCode: "NCB", locale, paymentRef }),
    }
  );

  if (!response.ok) {
    throw new Error("Không thể tạo URL thanh toán VNPay");
  }

  const result = await response.json();

  // Backend trả về data.data.url
  const url = result?.data?.data?.url;
  if (!url) {
    console.error("VNPay response:", result);
    throw new Error("Không tìm thấy URL thanh toán trong phản hồi backend");
  }

  return url;
}

export async function createOrderAPI(
  userId: string,
  fullName: string,
  shippingAddress: string,
  phoneNumber: string,
  totalPrice: number,
  paymentMethod: string,
  items: any[],
  paymentRef?: string
) {
  const response = await fetch("http://localhost:8000/api/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId,
      fullName,
      shippingAddress,
      phoneNumber,
      totalPrice,
      paymentMethod,
      items,
      paymentRef,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error?.message || "Tạo đơn hàng thất bại");
  }

  return await response.json();
}
