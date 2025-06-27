import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q") || "Nothing";
    let show = searchParams.get("msg") || "Nothing";
    if (show !== "Nothing") {
      show = decodeURIComponent(show);
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: "white",
              background: "linear-gradient(135deg, #00a, #002, #000000)",
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
            }}
          >
            <p>{show}</p>
          </div>
        ),
        {
          width: 600,
          height: 350,
        }
      );
    } else {
      query = decodeURIComponent(query);
      return new ImageResponse(
        (
          <div
            style={{
              fontSize: 40,
              color: "white",
              background: "linear-gradient(135deg, #00a, #002, #000000)",
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
            }}
          >
            <p>
              {Math.floor(Math.random() * Math.random() * 100)} search results
              for: {query}
            </p>
            <p
              style={{
                fontSize: 16,
                color: "cyan",
                textAlign: "center",
                marginTop: 16,
                textShadow: "2px 2px 5px black",
              }}
            >
              https://somps.vercel.app
            </p>
          </div>
        ),
        {
          width: 600,
          height: 350,
        }
      );
    }
  } catch (e) {
    console.error(e);
  }
}
