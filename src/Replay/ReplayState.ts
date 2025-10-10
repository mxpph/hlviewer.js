import { HlkzFrame } from "../Parsers/Hlkz"

export class ReplayState {
  cameraPos: any[]
  cameraRot: any[]
  entities: any[]

  constructor(obj: any | null = null) {
    if (obj) {
      this.cameraPos = JSON.parse(JSON.stringify(obj.cameraPos))
      this.cameraRot = JSON.parse(JSON.stringify(obj.cameraRot))
      this.entities = JSON.parse(JSON.stringify(obj.entities))
    } else {
      this.cameraPos = [0, 0, 0]
      this.cameraRot = [0, 0, 0]
      this.entities = []
    }
  }

  feedFrame(frame: any) {
    switch (frame.type) {
      case 0:
      case 1: {
        this.cameraPos[0] = frame.camera.position[0]
        this.cameraPos[1] = frame.camera.position[1]
        this.cameraPos[2] = frame.camera.position[2]

        this.cameraRot[0] = frame.camera.orientation[0]
        this.cameraRot[1] = frame.camera.orientation[1]
        this.cameraRot[2] = frame.camera.orientation[2]

        // TODO: handle spawnbaseline, clientdata, and similar messages

        break
      }
    }
  }

  feedHlkzFrame(frame: HlkzFrame) {
    this.cameraPos[0] = frame.x
    this.cameraPos[1] = frame.y
    this.cameraPos[2] = frame.z

    this.cameraRot[0] = frame.angle_x
    this.cameraRot[1] = frame.angle_y
    this.cameraRot[2] = frame.angle_z
  }

  clone() {
    return new ReplayState(this)
  }
}
