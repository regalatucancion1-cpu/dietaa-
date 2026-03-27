import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #10b981, #059669)",
          borderRadius: 108,
        }}
      >
        <div
          style={{
            fontSize: 290,
            fontWeight: 700,
            color: "white",
            letterSpacing: -10,
          }}
        >
          D
        </div>
      </div>
    ),
    { ...size }
  );
}
