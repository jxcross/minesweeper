# 스타일 가이드 (Style Guide)

## 1. 디자인 컨셉

클래식 Windows 3.x / 95 스타일의 Minesweeper를 현대 브라우저에 구현한다. 특징적인 회색 팔레트, bevel(입체) 효과, 빨간 LCD 디스플레이를 충실히 재현하되 반응형·접근성을 추가한다.

---

## 2. 색상 팔레트 (Color Palette)

### 2.1 CSS 변수 (index.css)

```css
:root {
  /* 기본 표면 */
  --color-surface:       #c0c0c0;  /* 메인 회색 배경 */
  --color-surface-dark:  #808080;  /* 어두운 회색 */
  --color-surface-darker:#404040;  /* 더 어두운 회색 */

  /* Bevel 효과 */
  --color-border-light:  #ffffff;  /* 위/왼쪽 밝은 테두리 */
  --color-border-dark:   #808080;  /* 아래/오른쪽 어두운 테두리 */
  --color-border-outer:  #404040;  /* 외곽 패널 테두리 */

  /* 셀 */
  --color-cell-hidden:   #c0c0c0;
  --color-cell-revealed: #c0c0c0;
  --color-cell-mine-hit: #ff0000;  /* 클릭된 지뢰 빨간 배경 */

  /* LCD 디스플레이 */
  --color-lcd-bg:        #000000;
  --color-lcd-fg:        #ff0000;  /* 빨간 세그먼트 */
  --color-lcd-dim:       #400000;  /* 비활성 세그먼트 */

  /* 셀 크기 (반응형) */
  --cell-size: clamp(24px, 4vw, 36px);
}
```

### 2.2 Tailwind 테마 확장 (tailwind.config.ts)

```ts
theme: {
  extend: {
    colors: {
      ms: {
        surface:    '#c0c0c0',
        dark:       '#808080',
        darker:     '#404040',
        light:      '#ffffff',
        'mine-hit': '#ff0000',
        'lcd-bg':   '#000000',
        'lcd-fg':   '#ff0000',
        'lcd-dim':  '#400000',
      }
    },
    fontFamily: {
      lcd: ['"Courier New"', '"Lucida Console"', 'monospace'],
    },
    fontSize: {
      'cell-num': ['14px', { fontWeight: '700', lineHeight: '1' }],
    }
  }
}
```

---

## 3. 숫자 색상 (Number Colors)

표준 지뢰찾기 숫자 색상을 따른다.

| 숫자 | HEX | Tailwind 클래스 |
|---|---|---|
| 1 | `#0000FF` | `text-blue-700` |
| 2 | `#008000` | `text-green-700` |
| 3 | `#FF0000` | `text-red-600` |
| 4 | `#000080` | `text-blue-900` |
| 5 | `#800000` | `text-red-900` |
| 6 | `#008080` | `text-teal-600` |
| 7 | `#000000` | `text-black` |
| 8 | `#808080` | `text-gray-500` |

```ts
// constants/game.ts
export const NUMBER_COLORS: Record<number, string> = {
  1: 'text-blue-700',
  2: 'text-green-700',
  3: 'text-red-600',
  4: 'text-blue-900',
  5: 'text-red-900',
  6: 'text-teal-600',
  7: 'text-black',
  8: 'text-gray-500',
}
```

---

## 4. Bevel 효과 (CSS 클래스)

클래식 Windows UI의 입체감을 표현하는 핵심 스타일.

```css
/* 볼록 효과 - hidden 셀, 버튼 기본 상태 */
.bevel-raised {
  border-top:    2px solid var(--color-border-light);
  border-left:   2px solid var(--color-border-light);
  border-bottom: 2px solid var(--color-border-dark);
  border-right:  2px solid var(--color-border-dark);
}

/* 오목 효과 - 클릭 중인 버튼, 패널 안쪽 */
.bevel-inset {
  border-top:    2px solid var(--color-border-dark);
  border-left:   2px solid var(--color-border-dark);
  border-bottom: 2px solid var(--color-border-light);
  border-right:  2px solid var(--color-border-light);
}

/* 외곽 패널 (보드 컨테이너, 헤더 패널) */
.panel-outer {
  border-top:    3px solid var(--color-border-light);
  border-left:   3px solid var(--color-border-light);
  border-bottom: 3px solid var(--color-border-outer);
  border-right:  3px solid var(--color-border-outer);
  background:    var(--color-surface);
  padding:       6px;
}

/* 안쪽 패널 (헤더 LCD 프레임) */
.panel-inset {
  border-top:    2px solid var(--color-border-outer);
  border-left:   2px solid var(--color-border-outer);
  border-bottom: 2px solid var(--color-border-light);
  border-right:  2px solid var(--color-border-light);
}
```

---

## 5. 셀 시각 명세 (Cell Visual Spec)

| 상태 | 배경 | 테두리 | 내용 |
|---|---|---|---|
| `hidden` | `#c0c0c0` | bevel-raised | 없음 |
| `flagged` | `#c0c0c0` | bevel-raised | 🚩 |
| `questioned` | `#c0c0c0` | bevel-raised | `?` (굵은 검정) |
| `revealed` (0) | `#c0c0c0` | 1px `#808080` all | 없음 |
| `revealed` (1~8) | `#c0c0c0` | 1px `#808080` all | 숫자 (색상 적용) |
| `mine` | `#c0c0c0` | 1px `#808080` all | 💣 |
| `mine-hit` | `#ff0000` | 1px `#808080` all | 💣 |
| `wrong-flag` | `#c0c0c0` | 1px `#808080` all | ❌ |
| focused | `#c0c0c0` | 2px `#005fcc` + bevel | — |

---

## 6. 타이포그래피 (Typography)

| 용도 | 폰트 | 크기 | 굵기 |
|---|---|---|---|
| 앱 타이틀 | system-ui | 18px | 700 |
| 셀 숫자 | system-ui | 14px | 700 |
| LCD 디스플레이 | Courier New, monospace | 20px | 700 |
| 버튼/탭 | system-ui | 13px | 500 |
| 모달 제목 | system-ui | 16px | 700 |
| 리더보드 데이터 | monospace | 13px | 400 |

---

## 7. 간격 및 크기 (Spacing & Sizing)

| 요소 | 값 |
|---|---|
| 셀 크기 | `clamp(24px, 4vw, 36px)` |
| 셀 폰트 크기 | `clamp(11px, 2vw, 14px)` |
| 보드 패딩 | `4px` |
| 헤더 높이 | `40px` |
| LCD 패널 높이 | `32px` |
| 스마일 버튼 크기 | `36px × 36px` |
| 앱 최대 너비 | 보드 크기에 맞게 자동 |
| 모달 최대 너비 | `400px` |

---

## 8. 애니메이션 (Animations)

### 8.1 Confetti (승리)

```css
@keyframes confetti-fall {
  0%   { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
  100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}

@keyframes confetti-sway {
  0%, 100% { margin-left: 0; }
  50%       { margin-left: 50px; }
}

.confetti-particle {
  position: fixed;
  animation:
    confetti-fall 3s ease-in forwards,
    confetti-sway 1s ease-in-out infinite;
  pointer-events: none;
  z-index: 9999;
}
```

- 파티클 수: 150개
- 색상: 랜덤 (빨강, 파랑, 초록, 노랑, 보라)
- 크기: 8px × 8px ~ 12px × 12px
- 지속 시간: 3초

### 8.2 셀 전환

```css
.cell-reveal-transition {
  transition: background-color 50ms ease-in;
}
```

### 8.3 스마일 버튼 호버

```css
.smiley-button:hover {
  transform: scale(1.05);
}
.smiley-button:active {
  transform: scale(0.97);
  /* bevel-inset 효과로 전환 */
}
```

### 8.4 모달 등장

```css
@keyframes modal-appear {
  from { opacity: 0; transform: scale(0.95); }
  to   { opacity: 1; transform: scale(1); }
}

.modal-content {
  animation: modal-appear 150ms ease-out;
}
```

---

## 9. 접근성 (Accessibility)

### 9.1 ARIA 속성

```tsx
// Board
<div role="grid" aria-label="Minesweeper board">

// Cell
<div
  role="gridcell"
  aria-label={getCellAriaLabel(cell)}  // "Row 3, Column 4, Hidden" 등
  tabIndex={isFocused ? 0 : -1}
  aria-pressed={cell.state === 'flagged'}
/>
```

### 9.2 포커스 가시성

```css
.cell:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: -2px;
  z-index: 1;
}

button:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

### 9.3 색상 대비

- LCD 텍스트: 빨강(#ff0000) on 검정(#000000) — 대비 5.25:1 ✓ (AA)
- 숫자 1(파랑 #0000FF) on 회색(#c0c0c0) — 대비 5.06:1 ✓ (AA)
- 포커스 링(#005fcc) on 회색 — 대비 4.71:1 ✓ (AA)

---

## 10. 컴포넌트 시각 예시

### 10.1 SevenSegment 디스플레이

```
┌────────────────────┐
│ [━━━] [━━━] [━━━] │  ← 비활성 세그먼트 (어두운 빨강)
│ [┃ ┃] [┃ ┃] [┃ ┃] │
│ [━━━] [━━━] [━━━] │  ← 활성 세그먼트 (밝은 빨강 #ff0000)
│ [┃ ┃] [┃ ┃] [┃ ┃] │
│ [━━━] [━━━] [━━━] │
│  0 1 0               │
└────────────────────┘
배경: #000000, 활성 세그먼트: #ff0000, 비활성: #400000
```

### 10.2 셀 예시

```
┌──┐  ┌──┐  ┌──┐  ┌──┐  ┌──┐
│  │  │🚩│  │ 1│  │  │  │💣│
└──┘  └──┘  └──┘  └──┘  └──┘
hidden flagged  1(blue) revealed(0) mine
```
