import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sanctuary — Sacred Daily Christian Prayers",
    short_name: "Sanctuary",
    description: "A contemplative Christian prayer rhythm to anchor your heart and draw near to God daily.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#fdf0ec",
    theme_color: "#1f3a28",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/icon.jpg",
        sizes: "192x192",
        type: "image/jpeg",
        purpose: "maskable",
      },
      {
        src: "/icon.jpg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}