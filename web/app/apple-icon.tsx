import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #0b0f14 0%, #121a24 100%)",
          borderRadius: 40,
          border: "3px solid rgba(0,255,204,0.55)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 52,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-0.06em",
              lineHeight: 1,
            }}
          >
            TA
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              color: "rgba(0,255,204,0.95)",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            CMK
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
