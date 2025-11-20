export const getImageUrl = (url?: string) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/slider") || url.startsWith("/thumbnails")) {
    return `https://next-nest-ecommerce.onrender.com/images${url}`;
  }

  return `https://next-nest-ecommerce.onrender.com${url}`;
};
