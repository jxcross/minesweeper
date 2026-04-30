import { useState, useEffect, useRef } from 'react'
import { useGame } from './hooks/useGame'
import { useTimer } from './hooks/useTimer'
import { Board } from './components/Board'
import { Header } from './components/Header'
import { DifficultySelector } from './components/DifficultySelector'
import { ScoreSubmitModal } from './components/ScoreSubmit'
import { LeaderboardModal } from './components/Leaderboard'
import { Confetti } from './components/ui/Confetti'
import type { Difficulty, BoardConfig } from './types/game'

export default function App() {
  const { state, reveal, flag, chord, reset, setDifficulty, tick } = useGame()
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const prevStatus = useRef(state.status)

  useTimer(state.status, tick)

  useEffect(() => {
    if (prevStatus.current !== 'won' && state.status === 'won') {
      setShowConfetti(true)
      if (state.difficulty !== 'custom') {
        setTimeout(() => setShowScoreModal(true), 500)
      }
      const timer = setTimeout(() => setShowConfetti(false), 3500)
      prevStatus.current = state.status
      return () => clearTimeout(timer)
    }
    if (state.status === 'idle') {
      setShowScoreModal(false)
      setShowConfetti(false)
    }
    prevStatus.current = state.status
  }, [state.status, state.difficulty])

  const handleDifficultyChange = (d: Difficulty, config: BoardConfig) => {
    setDifficulty(d, config)
    setShowScoreModal(false)
    setShowLeaderboard(false)
  }

  return (
    <div>
      {showConfetti && <Confetti />}

      <div className="panel-outer" style={{ display: 'inline-block', minWidth: 200 }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 6,
        }}>
          <span style={{ fontSize: 16, fontWeight: 700 }}>💣 지뢰찾기</span>
          <button
            onClick={() => setShowLeaderboard(true)}
            title="리더보드"
            aria-label="Open leaderboard"
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: 20, padding: '0 4px',
            }}
          >
            🏆
          </button>
        </div>

        <DifficultySelector
          current={state.difficulty}
          onChange={handleDifficultyChange}
        />

        <Header
          minesRemaining={state.minesRemaining}
          elapsed={state.elapsedSeconds}
          status={state.status}
          onReset={reset}
        />

        <Board
          board={state.board}
          status={state.status}
          onReveal={reveal}
          onFlag={flag}
          onChord={chord}
        />

        {state.status === 'won' && state.difficulty === 'custom' && (
          <div style={{
            textAlign: 'center', padding: '6px', fontSize: 13, color: '#666',
            marginTop: 4,
          }}>
            커스텀 기록은 저장되지 않습니다.
          </div>
        )}
      </div>

      {showScoreModal && (
        <ScoreSubmitModal
          difficulty={state.difficulty}
          timeSeconds={state.elapsedSeconds}
          onClose={() => setShowScoreModal(false)}
          onSubmitted={() => {
            setShowScoreModal(false)
            setShowLeaderboard(true)
          }}
        />
      )}

      {showLeaderboard && (
        <LeaderboardModal
          initialDifficulty={state.difficulty}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  )
}
