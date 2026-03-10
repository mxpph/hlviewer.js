import type { Bsp } from '../Bsp'
import type { Camera } from './Camera'
import type { Context } from './Context'
import { SkyShader } from './SkyShader/SkyShader'

export class SkyScene {
  static init(context: Context): SkyScene | null {
    const shader = SkyShader.init(context)
    if (!shader) {
      console.error("skyscenen't")
      return null
    }

    return new SkyScene({ context, shader })
  }

  private context: Context
  private shader: SkyShader
  private vertexBuffer: WebGLBuffer | null = null
  private indexBuffer: WebGLBuffer | null = null
  private isReady = false

  private constructor(params: { context: Context; shader: SkyShader }) {
    this.context = params.context
    this.shader = params.shader
  }

  changeMap(bsp: Bsp) {
    if (bsp.skies.length !== 6) {
      this.isReady = false
      return
    }

    const gl = this.context.gl
    const vertexBuffer = gl.createBuffer()
    const indexBuffer = gl.createBuffer()

    if (!vertexBuffer || !indexBuffer) {
      throw new Error('Failed to create WebGL buffers')
    }

    // prettier-ignore
    const indices = new Uint8Array([
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23,   // left
    ])
    // prettier-ignore
    const vertices = new Float32Array([
      // Top face
      -1.0, -1.0,  1.0, 0.499, 0.001,
       1.0, -1.0,  1.0, 0.499, 0.249,
       1.0,  1.0,  1.0, 0.001, 0.249,
      -1.0,  1.0,  1.0, 0.001, 0.001,

      // Bottom face
      -1.0, -1.0, -1.0, 0.499, 0.749,
      -1.0,  1.0, -1.0, 0.001, 0.749,
       1.0,  1.0, -1.0, 0.001, 0.501,
       1.0, -1.0, -1.0, 0.499, 0.501,

      // Front face
      -1.0,  1.0, -1.0, 0.501, 0.749,
      -1.0,  1.0,  1.0, 0.501, 0.501,
       1.0,  1.0,  1.0, 0.999, 0.501,
       1.0,  1.0, -1.0, 0.999, 0.749,

      // Back face
      -1.0, -1.0, -1.0, 0.999, 0.249,
       1.0, -1.0, -1.0, 0.501, 0.249,
       1.0, -1.0,  1.0, 0.501, 0.001,
      -1.0, -1.0,  1.0, 0.999, 0.001,

      // Right face
       1.0, -1.0, -1.0, 0.499, 0.499,
       1.0,  1.0, -1.0, 0.001, 0.499,
       1.0,  1.0,  1.0, 0.001, 0.251,
       1.0, -1.0,  1.0, 0.499, 0.251,

      // Left face
      -1.0, -1.0, -1.0, 0.501, 0.499,
      -1.0, -1.0,  1.0, 0.501, 0.251,
      -1.0,  1.0,  1.0, 0.999, 0.251,
      -1.0,  1.0, -1.0, 0.999, 0.499
    ].map((a, i) => ((i % 5) < 3) ? a * 4096 : a))

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

    this.vertexBuffer = vertexBuffer
    this.indexBuffer = indexBuffer
    this.isReady = true
  }

  draw(camera: Camera) {
    if (!this.isReady) {
      return
    }

    const gl = this.context.gl
    const shader = this.shader

    shader.useProgram(gl)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer)
    shader.enableVertexAttribs(gl)
    shader.setVertexAttribPointers(gl)

    const x = camera.position[0]
    const y = camera.position[1]
    const z = camera.position[2]
    camera.position[0] = 0
    camera.position[1] = 0
    camera.position[2] = 0
    camera.updateViewMatrix()
    camera.position[0] = x
    camera.position[1] = y
    camera.position[2] = z

    shader.setViewMatrix(gl, camera.viewMatrix)
    shader.setProjectionMatrix(gl, camera.projectionMatrix)

    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_BYTE, 0)
    gl.clear(gl.DEPTH_BUFFER_BIT)
  }
}
