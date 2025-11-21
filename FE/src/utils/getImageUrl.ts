const BACKEND_URL = "https://next-nest-ecommerce.onrender.com";

export const getImageUrl = (url?: string) => {
  if (!url) return "";

  // Nếu URL full thì trả về luôn
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  // Mặc định DB lưu dạng /slider/xxx hoặc /thumbnails/xxx
  // => Tất cả ảnh đều phải map về /images/*
  return `${BACKEND_URL}/images${url}`;
};
