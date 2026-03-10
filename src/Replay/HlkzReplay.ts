import { Hlkz, HlkzFrame } from "../Parsers/Hlkz";

export class HlkzReplay {
  runType: any
  mapName: string
  data: HlkzFrame[]
  length: number

  constructor(runType: string, mapName: string, dataBuffer: ArrayBuffer) {
    this.runType = runType;
    this.mapName = mapName;
    this.data = Hlkz.parse(dataBuffer);
    this.length = this.data[this.data.length - 1].gametime
  }
}