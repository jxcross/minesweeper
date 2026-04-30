interface Props {
  value: number
  digits?: number
}

function Digit({ char }: { char: string }) {
  const n = parseInt(char, 10)
  const isNum = !isNaN(n)
  const isMinus = char === '-'

  const segs = isNum ? [
    [true, true, true, false, true, true, true],   // 0
    [false, false, true, false, false, true, false], // 1
    [true, false, true, true, true, false, true],   // 2
    [true, false, true, true, false, true, true],   // 3
    [false, true, true, true, false, true, false],  // 4
    [true, true, false, true, false, true, true],   // 5
    [true, true, false, true, true, true, true],    // 6
    [true, false, true, false, false, true, false], // 7
    [true, true, true, true, true, true, true],     // 8
    [true, true, true, true, false, true, true],    // 9
  ][n] : Array(7).fill(false)

  const minusSegs = isMinus ? [false, false, false, true, false, false, false] : Array(7).fill(false)
  const active = isNum ? segs : (isMinus ? minusSegs : Array(7).fill(false))

  const seg = (on: boolean) => (on ? '#ff0000' : '#400000')

  return (
    <svg width="13" height="23" viewBox="0 0 13 23" style={{ display: 'block' }}>
      {/* top */}
      <polygon points="2,0 11,0 10,2 3,2" fill={seg(active[0])} />
      {/* top-left */}
      <polygon points="0,2 2,4 2,10 0,11" fill={seg(active[1])} />
      {/* top-right */}
      <polygon points="11,2 13,2 13,11 11,10" fill={seg(active[2])} />
      {/* middle */}
      <polygon points="1,11 3,10 10,10 12,11 10,12 3,12" fill={seg(active[3])} />
      {/* bottom-left */}
      <polygon points="0,12 2,13 2,19 0,21" fill={seg(active[4])} />
      {/* bottom-right */}
      <polygon points="11,13 13,12 13,21 11,19" fill={seg(active[5])} />
      {/* bottom */}
      <polygon points="3,21 10,21 11,23 2,23" fill={seg(active[6])} />
    </svg>
  )
}

export function SevenSegment({ value, digits = 3 }: Props) {
  const clamped = Math.max(-99, Math.min(value, 999))
  let str: string
  if (clamped < 0) {
    str = '-' + String(Math.abs(clamped)).padStart(digits - 1, '0')
  } else {
    str = String(clamped).padStart(digits, '0')
  }

  return (
    <div
      style={{
        background: '#000',
        padding: '3px 4px',
        display: 'inline-flex',
        gap: '1px',
        border: '1px solid #333',
      }}
    >
      {str.slice(0, digits).split('').map((ch, i) => (
        <Digit key={i} char={ch} />
      ))}
    </div>
  )
}
