import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Break My Website - Master System Design'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000',
          backgroundImage: 'linear-gradient(to bottom right, #000000, #1a1a2e)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          <h1
            style={{
              fontSize: 72,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Break My Website
          </h1>
          <p
            style={{
              fontSize: 32,
              color: '#e5e7eb',
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Master System Design Through Interactive Learning
          </p>
          <div
            style={{
              display: 'flex',
              gap: 20,
              marginTop: 40,
              fontSize: 20,
              color: '#9ca3af',
            }}
          >
            <span>⚡ Auto-Scaling</span>
            <span>🛡️ Fault Tolerance</span>
            <span>🔄 Circuit Breakers</span>
            <span>💾 Caching</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
