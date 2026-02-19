import { ImageResponse } from "next/og";

export const runtime = "edge";
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
          background: "linear-gradient(135deg, #0f1524, #0a0a0f)",
          borderRadius: "36px",
        }}
      >
        <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
          <path
            d="M 65 10 A 45 45 0 1 0 65 90 A 35 35 0 0 1 65 10 Z"
            fill="url(#moonGrad)"
          />
          <polygon
            points="78,28 82,38 92,38 84,44 87,54 78,47 69,54 72,44 64,38 74,38"
            fill="url(#starGrad)"
          />
          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8c491" />
              <stop offset="50%" stopColor="#d4a574" />
              <stop offset="100%" stopColor="#b8864e" />
            </linearGradient>
            <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8c491" />
              <stop offset="100%" stopColor="#c9963e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    ),
    { ...size }
  );
}
