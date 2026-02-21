import { formatTime } from '../../Time'
import type { ReplayPlayer } from '../../ReplayPlayer'
import { useGameState } from '../GameState'
import './style.css'

export function Time(props: { player: ReplayPlayer }) {
  const gameState = useGameState()
  const current = () => formatTime(gameState.time, 3)
  const total = () => formatTime(props.player.replay.length, 3)

  return (
    <div class="hlv-time">
      {current()} / {total()}
    </div>
  )
}
