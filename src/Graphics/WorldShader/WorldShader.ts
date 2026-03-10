import type { mat4 } from 'gl-matrix'
import type { Context, Program } from '../Context'

const fragmentSrc = `#ifdef GL_ES
precision highp float;
#endif

uniform float cameraNear;
uniform float cameraFar;

void main(void) {
  float ndcZ = gl_FragCoord.z * 2.0 - 1.0;
  float linearDepth = (2.0 * cameraNear * cameraFar) / (cameraFar + cameraNear - ndcZ * (cameraFar - cameraNear));
  float normalizedDepth = (linearDepth - cameraNear) / (cameraFar - cameraNear);
  float displayDepth = 1.0 - normalizedDepth;
  gl_FragColor = vec4(displayDepth, displayDepth, displayDepth, 1.0);
}`

const vertexSrc = `#ifdef GL_ES
precision highp float;
#endif

attribute vec3 position;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

void main(void) {
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}`

export class MainShader {
  static init(context: Context): MainShader | null {
    const attributeNames = ['position']
    const uniformNames: string[] = [
      'modelMatrix',
      'viewMatrix',
      'projectionMatrix',
      'cameraNear',
      'cameraFar'
    ]
    const program = context.createProgram({
      vertexShaderSrc: vertexSrc,
      fragmentShaderSrc: fragmentSrc,
      attributeNames,
      uniformNames
    })
    if (!program) {
      console.error('Failed to create MainShader program')
      return null
    }

    return new MainShader(program)
  }

  private program: WebGLProgram
  private aPosition: number
  private uModelMx: WebGLUniformLocation
  private uViewMx: WebGLUniformLocation
  private uProjectionMx: WebGLUniformLocation
  private uCameraNear: WebGLUniformLocation
  private uCameraFar: WebGLUniformLocation

  private constructor(program: Program) {
    this.program = program.handle
    this.aPosition = program.attributes.position
    this.uModelMx = program.uniforms.modelMatrix
    this.uViewMx = program.uniforms.viewMatrix
    this.uProjectionMx = program.uniforms.projectionMatrix
    this.uCameraNear = program.uniforms.cameraNear
    this.uCameraFar = program.uniforms.cameraFar
  }

  useProgram(gl: WebGLRenderingContext) {
    gl.useProgram(this.program)
  }

  setModelMatrix(gl: WebGLRenderingContext, matrix: mat4) {
    gl.uniformMatrix4fv(this.uModelMx, false, matrix)
  }

  setViewMatrix(gl: WebGLRenderingContext, matrix: mat4) {
    gl.uniformMatrix4fv(this.uViewMx, false, matrix)
  }

  setProjectionMatrix(gl: WebGLRenderingContext, matrix: mat4) {
    gl.uniformMatrix4fv(this.uProjectionMx, false, matrix)
  }

  setCameraBounds(gl: WebGLRenderingContext, near: number, far: number) {
    gl.uniform1f(this.uCameraNear, near)
    gl.uniform1f(this.uCameraFar, far)
  }

  setDiffuse(gl: WebGLRenderingContext, value: number) { }

  setLightmap(gl: WebGLRenderingContext, val: number) { }

  setOpacity(gl: WebGLRenderingContext, val: number) { }

  setFullbright(gl: WebGLRenderingContext, val: number) { }

  enableVertexAttribs(gl: WebGLRenderingContext) {
    gl.enableVertexAttribArray(this.aPosition)
  }

  setVertexAttribPointers(gl: WebGLRenderingContext) {
    gl.vertexAttribPointer(this.aPosition, 3, gl.FLOAT, false, 7 * 4, 0)
  }
}
