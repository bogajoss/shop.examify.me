import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title")?.slice(0, 100) || "Examify";
    const description = searchParams.get("description")?.slice(0, 160) || "";

    // Fetch the font for Bengali support with a fallback
    let fontData: ArrayBuffer | null = null;
    try {
      fontData = await fetch(
        new URL(
          "https://fonts.gstatic.com/s/hindsiliguri/v12/ijwbRE66id1_S6S_99shP6asO6shSL79fO8.ttf",
        ),
      ).then((res) => {
        if (!res.ok) throw new Error("Font fetch failed");
        return res.arrayBuffer();
      });
    } catch (fontError) {
      console.error("Failed to load Hind Siliguri font:", fontError);
    }

    return new ImageResponse(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          position: "relative",
        }}
      >
        {/* Decorative background elements */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            backgroundColor: "#f0fdf4",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 500,
            height: 500,
            borderRadius: "50%",
            backgroundColor: "#f0fdf4",
            display: "flex",
          }}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            padding: "60px",
            borderRadius: "40px",
            border: "4px solid #15803d",
            maxWidth: "90%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 32,
              fontWeight: 700,
              color: "#15803d",
              marginBottom: 30,
              letterSpacing: "0.1em",
            }}
          >
            EXAMIFY.ME
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#052e16",
              textAlign: "center",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            {title}
          </div>

          {description ? (
            <div
              style={{
                fontSize: 30,
                color: "#166534",
                marginTop: 10,
                textAlign: "center",
                maxWidth: "800px",
                lineHeight: 1.4,
              }}
            >
              {description}
            </div>
          ) : null}

          <div
            style={{
              marginTop: 50,
              padding: "16px 48px",
              backgroundColor: "#15803d",
              color: "white",
              borderRadius: "100px",
              fontSize: 36,
              fontWeight: 700,
              display: "flex",
            }}
          >
            Enroll Now / এখনই এনরোল করুন
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "#166534",
            fontWeight: 500,
          }}
        >
          Admission & Academic Preparation Platform
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: fontData
          ? [
              {
                name: "Hind Siliguri",
                data: fontData,
                style: "normal",
                weight: 700 as any,
              },
            ]
          : [],
      },
    );
  } catch (e: any) {
    console.error(`OG Image generation error: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
