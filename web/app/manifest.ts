import type { MetadataRoute } from "next";

const DESCRIPTION =
  "Crowdfunding Momentum Kit: readiness tools, Campaign Intelligence Report, materials & Momentum consulting — The Architect.";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "The Architect — Crowdfunding Momentum Kit",
    short_name: "CMK",
    description: DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0b0f14",
    theme_color: "#0b0f14",
    categories: ["business", "finance", "productivity"],
    icons: [
      {
        src: "/apple-icon",
        type: "image/png",
        sizes: "180x180",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
    ],
  };
}
