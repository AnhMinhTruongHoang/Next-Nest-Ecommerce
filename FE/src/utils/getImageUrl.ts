export const getImageUrl = (url?: string) => {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/slider") || url.startsWith("/thumbnails")) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}/images${url}`;
  }

  return `${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`;
};
