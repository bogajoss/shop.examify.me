import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Get parameters from URL, following documentation pattern
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'Examify - Admission & Academic Preparation';
    
    const description = searchParams.get('description')?.slice(0, 160) || 
      'Advanced learning platform for admission and academic preparation in Bangladesh.';

    // Fetch the font for Bengali support
    let fontData: ArrayBuffer | null = null;
    try {
      const fontResponse = await fetch(
        new URL('https://fonts.gstatic.com/s/hindsiliguri/v12/ijwbRE66id1_S6S_99shP6asO6shSL79fO8.ttf')
      );
      if (fontResponse.ok) {
        fontData = await fontResponse.arrayBuffer();
      }
    } catch (fontError) {
      console.error('Failed to load Hind Siliguri font:', fontError);
    }

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'center',
            backgroundColor: '#fff',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #f1f1f1 2%, transparent 0%), radial-gradient(circle at 75px 75px, #f1f1f1 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
            fontFamily: fontData ? '"Hind Siliguri"' : 'sans-serif',
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#15803d',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '15px',
              }}
            >
              <div style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>E</div>
            </div>
            <div
              style={{
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#15803d',
                letterSpacing: '-0.02em',
              }}
            >
              Examify
            </div>
          </div>

          {/* Main Content Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              maxWidth: '900px',
            }}
          >
            <div
              style={{
                fontSize: '75px',
                fontWeight: '900',
                color: '#052e16',
                lineHeight: '1.1',
                marginBottom: '30px',
                wordBreak: 'break-word',
              }}
            >
              {title}
            </div>

            <div
              style={{
                fontSize: '32px',
                color: '#4b5563',
                lineHeight: '1.4',
                marginBottom: '50px',
              }}
            >
              {description}
            </div>
          </div>

          {/* CTA Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                backgroundColor: '#15803d',
                color: 'white',
                padding: '15px 35px',
                borderRadius: '50px',
                fontSize: '28px',
                fontWeight: 'bold',
                boxShadow: '0 10px 15px -3px rgba(21, 128, 61, 0.3)',
              }}
            >
              Enroll Now / এখনই এনরোল করুন →
            </div>
            
            <div
              style={{
                fontSize: '24px',
                color: '#9ca3af',
                fontWeight: '500',
              }}
            >
              shop.examify.me
            </div>
          </div>

          {/* Decorative accent */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '10px',
              height: '100%',
              backgroundColor: '#15803d',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: fontData ? [
          {
            name: 'Hind Siliguri',
            data: fontData,
            style: 'normal',
            weight: 700,
          },
        ] : [],
      }
    );
  } catch (e: any) {
    console.error(`OG Image generation error: ${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
