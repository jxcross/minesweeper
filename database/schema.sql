-- Minesweeper Leaderboard Schema
-- 지뢰찾기 리더보드 데이터베이스 스키마

CREATE TABLE IF NOT EXISTS scores (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    player_name  TEXT    NOT NULL
                         CHECK(length(player_name) >= 1 AND length(player_name) <= 30),
    difficulty   TEXT    NOT NULL
                         CHECK(difficulty IN ('beginner', 'intermediate', 'expert')),
    time_seconds INTEGER NOT NULL
                         CHECK(time_seconds > 0 AND time_seconds <= 999),
    achieved_at  TEXT    NOT NULL
                         DEFAULT (strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
);

-- 난이도별 시간 오름차순 조회 최적화 인덱스
CREATE INDEX IF NOT EXISTS idx_scores_difficulty_time
    ON scores (difficulty, time_seconds ASC);
