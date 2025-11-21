/// url images
const BACKEND_URL = "https://next-nest-ecommerce.onrender.com";

export const getImageUrl = (url?: string) => {
  if (!url) return "";

  // Nếu đã là URL đầy đủ (ảnh external)
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // DB luôn lưu dạng "/thumbnails/xxx.jpg" hoặc "/slider/xxx.jpg"
  // NestJS serve ảnh ở /images/*
  return `${BACKEND_URL}/images${url}`;
};
