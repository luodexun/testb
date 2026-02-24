/*
 * @Author: xiongman
 * @Date: 2023-11-07 13:52:57
 * @LastEditors: chenmeifeng
 * @LastEditTime: 2025-05-27 11:02:09
 * @Description: 处理dom拖拽、放大、缩小的操作类
 */

interface IDragAndScale {
  el: HTMLDivElement
}

function throttle<EV>(callback: (event: EV) => void, timeout = 0) {
  let timer = 0
  return (event: EV) => {
    window.clearTimeout(timer)
    timer = window.setTimeout(() => callback(event), timeout)
  }
}

export class DragAndScale {
  constructor(props: IDragAndScale) {
    const { el } = props
    this.dom = el
    this.init()
  }

  dom: HTMLDivElement
  private scale = 1
  private translateX = 0
  private translateY = 0
  private mouseDownFun: (event: MouseEvent) => void
  private mouseWheelFun: (event: WheelEvent) => void
  private mouseDbClickFun: (event: MouseEvent) => void

  init() {
    this.initDrag()
    this.initParams()
    this.initWheel()
    this.initDbClick()
  }

  destory() {
    this.dom.removeEventListener("mousedown", this.mouseDownFun, false)
    this.dom.removeEventListener("wheel", this.mouseWheelFun, false)
    this.dom.removeEventListener("dblclick", this.mouseDbClickFun, false)
  }

  private initParams() {
    this.scale = 1
    this.translateX = 0
    this.translateY = 0
    this.setTransform()
  }
  private initDrag() {
    if (!this.dom) return
    const theDom = this.dom
    const mouseDownFun = (this.mouseDownFun = this.mousedown.bind(this))
    theDom.addEventListener("mousedown", mouseDownFun, false)
  }

  mousedown(downEv: MouseEvent) {
    downEv?.stopPropagation?.()
    downEv?.preventDefault?.()

    const onMouseMove = throttle(this.dealMouseMove.bind(this))

    const onMouseUp = throttle(() => {
      this.dom.removeEventListener("mousemove", onMouseMove, false)
      this.dom.removeEventListener("mouseup", onMouseUp, false)
    })

    this.dom.addEventListener("mousemove", onMouseMove, false)
    this.dom.addEventListener("mouseup", onMouseUp, false)
  }

  private dealMouseMove(moveEv: MouseEvent) {
    moveEv?.stopPropagation?.()
    moveEv?.preventDefault?.()
    //计算偏移坐标
    this.translateX += moveEv.movementX
    this.translateY += moveEv.movementY
    this.setTransform()
  }

  private initWheel() {
    if (!this.dom) return
    const onMouseWheel = (this.mouseWheelFun = throttle(this.mouseWheel.bind(this)))
    this.dom.addEventListener("wheel", onMouseWheel, false)
  }

  private mouseWheel(wheelEv: WheelEvent) {
    wheelEv?.stopPropagation?.()
    wheelEv?.preventDefault?.()
    const scaleDelta = wheelEv.deltaY > 0 ? -0.06 : 0.06
    this.scale += scaleDelta
    if (this.scale < 1) this.scale = 1
    this.setTransform()
  }

  private initDbClick() {
    if (!this.dom) return
    const mouseDbClickFun = (this.mouseDbClickFun = throttle(() => {
      if (this.scale === 1 && this.translateX === 0 && this.translateY === 0) return
      this.scale = 1
      this.translateY = this.translateX = 0
      this.setTransform()
    }, 300))
    this.dom.addEventListener("dblclick", mouseDbClickFun, false)
  }

  private setTransform() {
    if (!this.dom?.style) return
    this.dom.style.transform = `scale(${this.scale}) translate(${this.translateX}px, ${this.translateY}px)`
  }
}
