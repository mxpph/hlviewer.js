import { formatTime } from '../../Time'
import { useGameState } from '../GameState'
import './style.css'

export function TimerDisplay(props: { visible: boolean }) {
  const gameState = useGameState()
  const current = () => formatTime(gameState.time, 1)

  return (
    <div classList={{
      "hlv-timer-display": true,
      visible: props.visible
    }}>
      {current()}
    </div>
  )
}
