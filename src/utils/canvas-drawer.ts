/*
 * @Author: xiongman
 * @Date: 2023-12-05 14:44:36
 * @LastEditors: xiongman
 * @LastEditTime: 2023-12-05 14:44:36
 * @Description:
 */

export default class CanvasDrawer {
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    this.ctx = this.canvas?.getContext("2d")
  }

  canvas: HTMLCanvasElement = null
  ctx: CanvasRenderingContext2D = null
  canvasW: number
  canvasH: number
  __animateFlag: number

  size(options?: Pick<CSSStyleDeclaration, "width" | "height">) {
    if (!options) {
      options = getComputedStyle(this.canvas, null) as Pick<CSSStyleDeclaration, "width" | "height">
    }
    const { width: bWidth, height: bHeight } = options || getComputedStyle(this.canvas, null)
    const width = parseInt(`${bWidth}`)
    const height = parseInt(`${bHeight}`)
    this.canvasW = this.canvas.width = width
    this.canvasH = this.canvas.height = height
    return this
  }

  drawVideo(video: HTMLVideoElement) {
    this.size().ctx.drawImage(video, 0, 0, this.canvasW, this.canvasH)
    this.__animateFlag && window.cancelAnimationFrame(this.__animateFlag)
    this.__animateFlag = window.requestAnimationFrame(() => {
      this.drawVideo(video)
    })
  }

  getBase64uRL(type: "png" | "jpg") {
    if (!this.canvas) return null
    return this.canvas.toDataURL(`image/${type}`)
  }

  imageBase64ToFile(type: "png" | "jpg") {
    const base64Url = this.getBase64uRL(type)
    if (!base64Url) return null
    const arr = base64Url.split(",")
    const binary = atob(arr[1])
    const mine = arr[0].match(/:(.*?);/)[1]
    const array = []
    for (let i = 0, { length } = binary; i < length; i++) {
      array.push(binary.charCodeAt(i))
    }
    const blob = new Blob([new Uint8Array(array)], { type: mine })
    return new File([blob], `${Date.now()}.${type}`, { type: mine })
  }
}
