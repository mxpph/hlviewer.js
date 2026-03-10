import type { mat4 } from 'gl-matrix'
import type { Context, Program } from '../Context'

const fragmentSrc = `#ifdef GL_ES
precision highp float;
#endif

void main(void) {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`

const vertexSrc = `#ifdef GL_ES
precision highp float;
#endif

attribute vec3 position;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
}`

export class SkyShader {
  static init(context: Context): SkyShader | null {
    const attributeNames = ['position']
    const uniformNames: string[] = ['viewMatrix', 'projectionMatrix']
    const program = context.createProgram({
      vertexShaderSrc: vertexSrc,
      fragmentShaderSrc: fragmentSrc,
      attributeNames,
      uniformNames
    })
    if (!program) {
      console.error('Failed to create sky shader program')
      return null
    }

    return new SkyShader(program)
  }

  private program: WebGLProgram
  private aPosition: number
  private uViewMx: WebGLUniformLocation
  private uProjectionMx: WebGLUniformLocation

  private constructor(program: Program) {
    this.program = program.handle
    this.aPosition = program.attributes.position
    this.uViewMx = program.uniforms.viewMatrix
    this.uProjectionMx = program.uniforms.projectionMatrix
  }

  useProgram(gl: WebGLRenderingContext) {
    gl.useProgram(this.program)
  }

  setViewMatrix(gl: WebGLRenderingContext, matrix: mat4) {
    gl.uniformMatrix4fv(this.uViewMx, false, matrix)
  }

  setProjectionMatrix(gl: WebGLRenderingContext, matrix: mat4) {
    gl.uniformMatrix4fv(this.uProjectionMx, false, matrix)
  }

  enableVertexAttribs(gl: WebGLRenderingContext) {
    gl.enableVertexAttribArray(this.aPosition)
  }

  setVertexAttribPointers(gl: WebGLRenderingContext) {
    // The stride remains 5 * 4 because the vertex array in SkyScene still interleaves texture coordinates
    gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 5 * 4, 0)
  }
}
