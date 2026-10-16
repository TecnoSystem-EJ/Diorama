import { ImageResponse } from "next/og";

export const alt = "Diorama — Cultura, natureza e futuros";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#F4F1EA", color: "#1A365D", padding: "72px" }}>
      <div style={{ display: "flex", fontFamily: "serif", fontSize: 122, letterSpacing: "-5px", borderBottom: "2px solid #1A365D", paddingBottom: 42 }}>DIORAMA</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontSize: 44 }}>Cultura, natureza e futuros.</div>
        <div style={{ fontSize: 26, color: "#333" }}>Edições · Matérias · Ensaios · Projetos</div>
      </div>
    </div>,
    size,
  );
}
