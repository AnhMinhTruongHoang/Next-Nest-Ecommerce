/// url images
const BACKEND_URL = "https://next-nest-ecommerce.onrender.com/api/v1";

export const getImageUrl = (url?: string) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${BACKEND_URL}/images${url}`;
};
