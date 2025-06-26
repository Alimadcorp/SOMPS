import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const query = decodeURIComponent(searchParams.get("q")) || "Nothing";

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
        }}
      >
        Search results for: {query}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}