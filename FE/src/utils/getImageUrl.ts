const BACKEND_URL = "https://next-nest-ecommerce.onrender.com";

export const getImageUrl = (url?: string) => {
  if (!url) return "";

  // Nếu đã là full URL
  if (url.startsWith("http")) return url;

  // Nếu BE đã trả dạng /images/...
  if (url.startsWith("/images/")) {
    return `${BACKEND_URL}${url}`;
  }

  // Nếu BE trả dạng /thumbnails/... hoặc /slider/...
  if (url.startsWith("/")) {
    return `${BACKEND_URL}/images${url}`;
  }

  // Nếu BE trả dạng thumbnails/xxx.png hoặc slider/xxx.png
  return `${BACKEND_URL}/images/${url}`;
};
