/// url images
const BACKEND_URL = "https://next-nest-ecommerce.onrender.com";

export const getImageUrl = (url?: string) => {
  if (!url) return "";

  // nếu đã full URL
  if (url.startsWith("http")) return url;

  // DB lưu dạng /slider/... hoặc /thumbnails/...
  return `${BACKEND_URL}/images${url}`;
};
