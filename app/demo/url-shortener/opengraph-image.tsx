import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'URL Shortener System Design - Interactive Demo'
export const size = { width: 1200, height: 630 }
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
          backgroundImage: 'linear-gradient(to bottom right, #1e1b4b, #4c1d95)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px' }}>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #a78bfa, #f59e0b)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            URL Shortener
          </h1>
          <p style={{ fontSize: 32, color: '#e5e7eb', textAlign: 'center', maxWidth: 900, marginBottom: 40 }}>
            Build Scalable Link Shortening System
          </p>
          <div style={{ display: 'flex', gap: 25, fontSize: 20, color: '#9ca3af' }}>
            <span>🚦 Rate Limiting</span>
            <span>💾 Caching</span>
            <span>📊 Analytics</span>
            <span>⚡ Sharding</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
