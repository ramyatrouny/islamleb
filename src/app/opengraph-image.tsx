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
          backgroundColor: "#0a0a0f",
          position: "relative",
        }}
      >
        {/* Top gold border */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "5px",
            backgroundColor: "#d4a574",
          }}
        />

        {/* Bottom gold border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "5px",
            backgroundColor: "#d4a574",
          }}
        />

        {/* Decorative glow - top right */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-50px",
            width: "400px",
            height: "400px",
            borderRadius: "200px",
            backgroundColor: "rgba(212,165,116,0.08)",
          }}
        />

        {/* Decorative glow - bottom left */}
        <div
          style={{
            position: "absolute",
            bottom: "-80px",
            left: "-40px",
            width: "350px",
            height: "350px",
            borderRadius: "175px",
            backgroundColor: "rgba(45,106,79,0.1)",
          }}
        />

        {/* Crescent & star as text */}
        <div
          style={{
            fontSize: "72px",
            marginBottom: "16px",
          }}
        >
          ☪
        </div>

        {/* Site name */}
        <div
          style={{
            fontSize: "72px",
            fontWeight: 700,
            color: "#f5f0eb",
            textAlign: "center",
            marginBottom: "8px",
          }}
        >
          إسلام لبنان
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "32px",
            color: "#d4a574",
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          رفيقك الإسلامي الرقمي الشامل
        </div>

        {/* Separator */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{ width: "80px", height: "2px", backgroundColor: "#d4a574" }}
          />
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "4px",
              backgroundColor: "#d4a574",
            }}
          />
          <div
            style={{ width: "80px", height: "2px", backgroundColor: "#d4a574" }}
          />
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            justifyContent: "center",
            marginBottom: "32px",
          }}
        >
          {["مواقيت الصلاة", "القرآن الكريم", "الأذكار", "حاسبة الزكاة", "رمضان والمزيد"].map(
            (label) => (
              <div
                key={label}
                style={{
                  padding: "10px 22px",
                  borderRadius: "20px",
                  border: "1px solid rgba(212,165,116,0.4)",
                  color: "#d4a574",
                  fontSize: "18px",
                }}
              >
                {label}
              </div>
            )
          )}
        </div>

        {/* CTA button */}
        <div
          style={{
            display: "flex",
            padding: "14px 40px",
            borderRadius: "30px",
            backgroundColor: "#d4a574",
            color: "#0a0a0f",
            fontSize: "24px",
            fontWeight: 700,
          }}
        >
          islamleb.com
        </div>
      </div>
    ),
    { ...size }
  );
}
