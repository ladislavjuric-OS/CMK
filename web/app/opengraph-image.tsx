import { ImageResponse } from "next/og";

export const alt = "The Architect — Crowdfunding Momentum Kit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: "#0b0f14",
          backgroundImage:
            "radial-gradient(700px 400px at 82% 18%, rgba(0,255,204,0.22), transparent 55%), radial-gradient(520px 380px at 8% 28%, rgba(98,166,255,0.18), transparent 50%)",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: "rgba(0,255,204,0.92)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          Crowdfunding Momentum Kit
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 900,
            color: "rgba(255,255,255,0.96)",
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            marginTop: 14,
          }}
        >
          The Architect
        </div>
        <div
          style={{
            fontSize: 26,
            color: "rgba(255,255,255,0.62)",
            marginTop: 22,
            maxWidth: 920,
            lineHeight: 1.45,
          }}
        >
          $890K+ raised · 5 campaigns · 12K+ units shipped · Readiness tools, Campaign Intelligence Report & Momentum consulting
        </div>
      </div>
    ),
    { ...size }
  );
}
