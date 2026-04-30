# 💣 지뢰찾기 (Minesweeper)

클래식 Windows Minesweeper를 현대 웹 기술로 구현한 풀스택 게임.

## 기능

- 초급(9×9/10) / 중급(16×16/40) / 고급(16×30/99) / 커스텀 난이도
- 첫 클릭 3×3 안전지대 보장
- BFS 자동 공개, Chord Reveal (중간클릭/더블클릭)
- 7-세그먼트 LCD 타이머 및 지뢰 카운터
- 승리 Confetti 애니메이션
- 온라인 리더보드 (SQLite + REST API)
- 키보드 완전 접근성 (방향키, Space, F, ESC)
- 반응형 디자인 (모바일 지원)

## 기술 스택

| 영역 | 기술 |
|---|---|
| Frontend | React 18 + TypeScript + Vite 5 |
| Styling | Tailwind CSS 4 + CSS Variables |
| Backend | Node.js + Express 4 + TypeScript |
| Database | SQLite (better-sqlite3) |
| 테스트 | Vitest (FE) + Jest/Supertest (BE) |

## 개발 시작

### 요구사항
- Node.js 18+
- npm 9+

### 설치 및 실행

```bash
# 백엔드
cd backend
npm install
npm run dev        # http://localhost:3001

# 프론트엔드 (새 터미널)
cd frontend
npm install
npm run dev        # http://localhost:5173
```

### 환경 변수

**backend/.env** (선택사항)
```
PORT=3001
FRONTEND_URL=http://localhost:5173
DB_PATH=./data/minesweeper.db
```

**frontend/.env** (선택사항)
```
VITE_API_URL=http://localhost:3001
```

## 테스트

```bash
# 백엔드 (15개 테스트)
cd backend && npm test

# 프론트엔드 (27개 테스트)
cd frontend && npm test

# 커버리지
cd frontend && npm run test:coverage
cd backend && npm run test:coverage
```

## 빌드

```bash
cd frontend && npm run build
# 결과: frontend/dist/
```

## API

```
GET  /api/scores?difficulty=beginner&limit=10  → 리더보드 조회
POST /api/scores                                → 점수 등록
GET  /health                                    → 서버 상태 확인
```

## 문서

| 파일 | 설명 |
|---|---|
| [도메인 정의서](docs/1-domain-definition.md) | 핵심 개념, 비즈니스 룰 |
| [PRD](docs/2-prd.md) | 기능/비기능 요구사항 |
| [사용자 시나리오](docs/3-scenario.md) | 7개 시나리오 |
| [프로젝트 구조](docs/4-project-structure.md) | 아키텍처, 디렉토리 |
| [아키텍처 다이어그램](docs/5-arch-diagram.md) | Mermaid 다이어그램 |
| [ERD](docs/6-erd.md) | 데이터베이스 설계 |
| [실행 계획](docs/7-execution-plan.md) | 8단계 구현 계획 |
| [와이어프레임](docs/8-wireframes.md) | ASCII UI 설계 |
| [스타일 가이드](docs/9-style-guide.md) | 색상, 타이포그래피 |
| [테스트 매뉴얼](docs/testing-manual.md) | 12개 수동 테스트 |
