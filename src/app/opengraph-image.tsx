import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "إسلام لبنان - رفيقك الإسلامي الرقمي الشامل";
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
            marginBottom: "20px",
          }}
        >
          <svg
            width="80"
            height="80"
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

        {/* Headline - clear and bold */}
        <div
          style={{
            fontSize: "68px",
            fontWeight: 700,
            color: "#f5f0eb",
            lineHeight: 1.2,
            textAlign: "center",
            marginBottom: "6px",
          }}
        >
          إسلام لبنان
        </div>

        {/* Subtitle tagline */}
        <div
          style={{
            fontSize: "32px",
            fontWeight: 400,
            color: "#d4a574",
            textAlign: "center",
            marginBottom: "24px",
          }}
        >
          رفيقك الإسلامي الرقمي الشامل
        </div>

        {/* Decorative line separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "24px",
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

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "28px",
          }}
        >
          {["مواقيت الصلاة", "القرآن الكريم", "الأذكار", "حاسبة الزكاة", "رمضان والمزيد"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  border: "1px solid rgba(212,165,116,0.3)",
                  color: "#d4a574",
                  fontSize: "17px",
                  background: "rgba(212,165,116,0.08)",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* Call to action */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px 36px",
            borderRadius: "30px",
            background: "linear-gradient(135deg, #d4a574, #c9963e)",
            color: "#0a0a0f",
            fontSize: "22px",
            fontWeight: 700,
          }}
        >
          islamleb.com ← تصفّح الآن
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
