import { Reader } from '../Reader'

export interface HlkzFrame {
  gametime: number
  x: number
  y: number
  z: number
  angle_x: number
  angle_y: number
  angle_z: number
  buttons: number
}

export class HlkzButtonConstants {
  static BTN_JUMP = (1 << 1)
  static BTN_DUCK = (1 << 2)
  static BTN_FORWARD = (1 << 3)
  static BTN_BACK = (1 << 4)
  static BTN_USE = (1 << 5)
  static BTN_MOVELEFT = (1 << 9)
  static BTN_MOVERIGHT = (1 << 10)
}

export class Hlkz {
  static parse(buffer: ArrayBuffer): HlkzFrame[] {
    const r = new Reader(buffer)

    let entries = buffer.byteLength / 30  // sizeof HlkzFrame
    const hlkzFrames = Array<HlkzFrame>(entries)

    const initialTime = r.f()
    r.seek(0)
    for (let i = 0; i < entries; i++) {
      hlkzFrames[i] = Hlkz.readFrame(r, initialTime)
    }
    return hlkzFrames
  }

  private static readFrame(r: Reader, initialTime?: number): HlkzFrame {
    let frame: HlkzFrame = {
      gametime: r.f() - (initialTime ?? 0),
      x: r.f(),
      y: r.f(),
      z: r.f() + 28, // view height difference from origin
      angle_x: r.f() * -3, // weird pitch inversion and scaling correction
      angle_y: r.f(),
      angle_z: r.f(),
      buttons: r.us()
    }
    if (frame.buttons & HlkzButtonConstants.BTN_DUCK)
      frame.z -= 16 // ducking view height difference
    return frame
  }
}
