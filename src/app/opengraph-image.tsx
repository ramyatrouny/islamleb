import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "إسلام لبنان - رفيقك الرقمي في شهر رمضان المبارك";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f1524 40%, #141425 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative radial glow - top right */}
        <div
          style={{
            position: "absolute",
            top: "-120px",
            right: "-80px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(212,165,116,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Decorative radial glow - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-60px",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(45,106,79,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Top decorative border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #d4a574, #c9963e, #d4a574, transparent)",
          }}
        />

        {/* Bottom decorative border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, transparent, #d4a574, #c9963e, #d4a574, transparent)",
          }}
        />

        {/* Crescent moon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <svg
            width="90"
            height="90"
            viewBox="0 0 100 100"
            fill="none"
          >
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

        {/* Site name in Arabic */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#f5f0eb",
            lineHeight: 1.2,
            textAlign: "center",
            marginBottom: "8px",
            letterSpacing: "2px",
          }}
        >
          إسلام لبنان
        </div>

        {/* Domain */}
        <div
          style={{
            fontSize: "28px",
            fontWeight: 400,
            color: "#d4a574",
            textAlign: "center",
            marginBottom: "28px",
            letterSpacing: "4px",
          }}
        >
          islamleb.com
        </div>

        {/* Decorative line separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, transparent, #d4a574)",
            }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#d4a574",
            }}
          />
          <div
            style={{
              width: "80px",
              height: "1px",
              background: "linear-gradient(90deg, #d4a574, transparent)",
            }}
          />
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "30px",
            fontWeight: 400,
            color: "#a8a0b4",
            textAlign: "center",
            maxWidth: "800px",
            lineHeight: 1.6,
          }}
        >
          رفيقك الرقمي في شهر رمضان المبارك
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {["مواقيت الصلاة", "القرآن الكريم", "الأذكار", "حاسبة الزكاة"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  border: "1px solid rgba(212,165,116,0.3)",
                  color: "#d4a574",
                  fontSize: "18px",
                  background: "rgba(212,165,116,0.08)",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
