import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'System Design Concepts - Interactive Visualizations'
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
          backgroundImage: 'linear-gradient(to bottom right, #000000, #1a1a2e)',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '80px' }}>
          <h1
            style={{
              fontSize: 64,
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #60a5fa, #a78bfa)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: 20,
              textAlign: 'center',
            }}
          >
            System Design Concepts
          </h1>
          <p style={{ fontSize: 28, color: '#e5e7eb', textAlign: 'center', maxWidth: 900, marginBottom: 40 }}>
            Interactive Visualizations for Learning
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15, justifyContent: 'center', fontSize: 18, color: '#9ca3af' }}>
            <span>📈 Auto-Scaling</span>
            <span>🛡️ Fault Tolerance</span>
            <span>📊 Traffic Patterns</span>
            <span>⚡ Caching</span>
            <span>🔌 Circuit Breaker</span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
