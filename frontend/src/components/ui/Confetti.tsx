import { useMemo } from 'react'

const COLORS = ['#ff0000', '#0000ff', '#00aa00', '#ffcc00', '#aa00ff', '#ff8800']

interface Particle {
  id: number
  color: string
  left: string
  delay: string
  size: number
}

export function Confetti() {
  const particles: Particle[] = useMemo(() =>
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      left: `${Math.random() * 100}vw`,
      delay: `${Math.random() * 1.5}s`,
      size: 6 + Math.floor(Math.random() * 6),
    })),
  [])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            top: 0,
            width: p.size,
            height: p.size,
            background: p.color,
            animationDelay: p.delay,
            borderRadius: p.id % 3 === 0 ? '50%' : 2,
          }}
        />
      ))}
    </div>
  )
}
