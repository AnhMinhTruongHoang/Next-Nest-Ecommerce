const BACKEND_URL =
  process.env.NEXT_PUBLIC_IMAGE_URL ||
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/api\/v\d+\/?$/, "") ||
  "https://next-nest-ecommerce.onrender.com";

export const getImageUrl = (url?: string) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  const cleanBackendUrl = BACKEND_URL.replace(/\/+$/, "");

  if (url.startsWith("/images/")) {
    return `${cleanBackendUrl}${url}`;
  }

  if (url.startsWith("/")) {
    return `${cleanBackendUrl}/images${url}`;
  }

  return `${cleanBackendUrl}/images/${url}`;
};
