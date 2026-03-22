import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/** Favicon — matches homepage brand mark (teal → blue gradient). */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: 10,
          background: "linear-gradient(135deg, rgba(0,255,204,0.98) 0%, rgba(98,166,255,0.92) 100%)",
          boxShadow:
            "inset 0 0 0 1.5px rgba(255,255,255,0.35), inset 0 -6px 14px rgba(4,16,19,0.18), 0 2px 8px rgba(0,255,204,0.15)",
        }}
      />
    ),
    { ...size }
  );
}
