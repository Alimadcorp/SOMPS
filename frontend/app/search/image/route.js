import { ImageResponse } from "next/og";

export const runtime = "edge";

const baseStyle = {
  fontSize: 40,
  color: "white",
  background: "linear-gradient(135deg, #00a, #002, #000)",
  backgroundSize: "100% 100%",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
  fontWeight: "bold",
  textShadow: "2px 2px 5px black",
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const query = decodeURIComponent(searchParams.get("q") || "Nothing");
    const msg = searchParams.get("msg");

    const content = msg
      ? <p>{decodeURIComponent(msg)}</p>
      : (
          <>
            <p>{Math.floor(Math.random() * Math.random() * 100)} search results for: {query}</p>
            <p style={{
              fontSize: 16,
              color: "cyan",
              marginTop: 16,
              textShadow: "2px 2px 5px black",
              textAlign: "center",
            }}>
              https://somps.vercel.app
            </p>
          </>
        );

    return new ImageResponse(<div style={baseStyle}>{content}</div>, {
      width: 600,
      height: 350,
    });
  } catch (e) {
    console.error(e);
  }
}
