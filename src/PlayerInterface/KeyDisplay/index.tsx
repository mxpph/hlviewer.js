import { onCleanup, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import type { Game } from '../../Game'
import './style.css'
import { HlkzButtonConstants } from '../../Parsers/Hlkz'

export function KeyDisplay(props: { game: Game; visible: boolean }) {
  const [keysStore, setKeysStore] = createStore({
    jump: false,
    duck: false,
    forward: false,
    back: false,
    use: false,
    moveleft: false,
    moveright: false,
  })

  onMount(() => {
    const loaderEvents = props.game.player.events
    const offKeysPressed = loaderEvents.on('keyspressed', onKeysPressed)
    onCleanup(() => {
      offKeysPressed?.()
    })
  })

  const onKeysPressed = (buttons: number) => {
    setKeysStore('jump', (buttons & HlkzButtonConstants.BTN_JUMP) != 0)
    setKeysStore('duck', (buttons & HlkzButtonConstants.BTN_DUCK) != 0)
    setKeysStore('use', (buttons & HlkzButtonConstants.BTN_USE) != 0)
    const forward = (buttons & HlkzButtonConstants.BTN_FORWARD) != 0
    const back = (buttons & HlkzButtonConstants.BTN_BACK) != 0
    const left = (buttons & HlkzButtonConstants.BTN_MOVELEFT) != 0
    const right = (buttons & HlkzButtonConstants.BTN_MOVERIGHT) != 0
    setKeysStore('forward', forward && !back)
    setKeysStore('back', back && !forward)
    setKeysStore('moveleft', left && !right)
    setKeysStore('moveright', right && !left)
  }

  return (
    <div
      classList={{
        'hlv-keys-hud': true,
        visible: props.visible
      }}
    >
      <div class="hlv-keyboard">
        <div classList={{'hlv-key': true,  'hlv-key-w': true, activated: keysStore.forward}}>W</div>
        <div classList={{'hlv-key': true,  'hlv-key-a': true, activated: keysStore.moveleft}}>A</div>
        <div classList={{'hlv-key': true,  'hlv-key-s': true, activated: keysStore.back}}>S</div>
        <div classList={{'hlv-key': true,  'hlv-key-d': true, activated: keysStore.moveright}}>D</div>
        <div classList={{'hlv-key': true,  'hlv-key-duck': true, activated: keysStore.duck}}>DUCK</div>
        <div classList={{'hlv-key': true,  'hlv-key-jump': true, activated: keysStore.jump}}>JUMP</div>
        <div classList={{'hlv-key': true,  'hlv-key-use': true, activated: keysStore.use}}>USE</div>
      </div>
    </div>
  )
}
