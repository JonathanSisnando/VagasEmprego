import { ImageResponse } from "next/og";
import { siteConfig } from "../config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#1d4ed8",
              fontSize: 36,
              fontWeight: 900,
            }}
          >
            V
          </div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "white" }}>
            {siteConfig.nome}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 60,
            fontWeight: 900,
            lineHeight: 1.15,
            maxWidth: 950,
            color: "white",
          }}
        >
          Encontre vagas de emprego em Manaus
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            maxWidth: 850,
            color: "rgba(255,255,255,0.85)",
          }}
        >
          {siteConfig.descricao}
        </div>
      </div>
    ),
    { ...size }
  );
}
