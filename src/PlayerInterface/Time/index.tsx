import { formatTime } from '../../Time'
import { Game } from '../../Game'
import { useGameState } from '../GameState'
import './style.css'
import { createSignal, onCleanup, onMount } from 'solid-js'

export function Time(props: { game: Game }) {
  const gameState = useGameState()
  const current = () => formatTime(gameState.time, 3)
  const [total, setTotal] = createSignal(formatTime(props.game.player.replay.length, 3))

  onMount(() => {
    const offReplayChange = props.game.events.on('postreplaychange',
      (game: Game) => {
        console.log("new replay", game.player.replay.length)
        setTotal(formatTime(game.player.replay.length, 3))
      }
    )

    onCleanup(() => {
      offReplayChange?.()
    })
  })

  return (
    <div class="hlv-time">
      {current()} / {total()}
    </div>
  )
}
