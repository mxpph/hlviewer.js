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
    const frame: HlkzFrame = {
      gametime: r.f() - (initialTime ?? 0),
      x: r.f(),
      y: r.f(),
      z: r.f() - 72 / 2 + 64,
      angle_x: r.f(),
      angle_y: r.f(),
      angle_z: r.f(),
      buttons: r.us()
    }
    return frame
  }
}