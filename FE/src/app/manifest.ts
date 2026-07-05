import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GamerZone",
    short_name: "GamerZone",
    description:
      "GamerZone is an ecommerce website for gaming gear, accessories, and custom product experiences.",
    icons: [
      {
        src: "/images/logos/gz.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/logos/gz.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#05070A",
    background_color: "#05070A",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
  };
}
