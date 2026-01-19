import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Notification System Design - From Basic to Legendary'
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
          backgroundImage: 'linear-gradient(to bottom right, #0f172a, #1e1b4b)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px' }}>
          <h1
            style={{
              fontSize: 68,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #10b981, #3b82f6)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            Notification System
          </h1>
          <p style={{ fontSize: 32, color: '#e5e7eb', textAlign: 'center', maxWidth: 900, marginBottom: 40 }}>
            Evolution from Basic to Legendary
          </p>
          <div style={{ display: 'flex', gap: 30, fontSize: 20, color: '#9ca3af' }}>
            <span>⚡ Basic</span>
            <span>🛡️ Advanced</span>
            <span>👑 Legendary</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
